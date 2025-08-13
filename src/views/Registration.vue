<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { LxButton, LxTextInput, LxCheckbox, lxStringUtils, LxModal } from '@wntr/lx-ui';
import useViewStore from '@/stores/useViewStore';
import { ref, shallowRef, onBeforeUnmount, onMounted, watch, nextTick, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { postPhone, verifyPhone, postEmail, verifyEmail } from '@/services/personService';
import useNotifyStore from '@/stores/useNotifyStore';
import ResendCode from '@/components/ResendCode.vue';

const viewStore = useViewStore();
const router = useRouter();
const route = useRoute();
const t = useI18n();
const notification = useNotifyStore();

const steps = shallowRef(1);

const COUNTDOWN_TIME = 60;

const phoneUse = shallowRef(false);
const phoneVerification = shallowRef('');

const phone = ref('');

const emailUse = shallowRef(false);
const emailVerification = shallowRef('');

const email = ref('');

const phoneHidden = computed(
  () => `${phone.value?.substring(0, 2)}****${phone.value?.substring(6, 8)}`
);

const emailHidden = computed(() => {
  const [localPart, domain] = email.value.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  return `${firstChar}****${lastChar}@${domain}`;
});

const loading = shallowRef(false);
const invalid = shallowRef(false);

const emailTries = shallowRef(0);
const phoneTries = shallowRef(0);

const timeLeft = ref(COUNTDOWN_TIME);
const timer = ref(null);
const isRunning = ref(false);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

function startTimer() {
  if (timer.value) clearInterval(timer.value); // Reset timer if running

  timeLeft.value = COUNTDOWN_TIME;
  isRunning.value = true;

  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      clearInterval(timer.value);
      isRunning.value = false;
    }
  }, 1000);
}

async function postPhoneNumber() {
  try {
    loading.value = true;
    const resp = await postPhone(phone.value);
    viewStore.setPageTitle(t.t('pages.registration.phoneVerification.title'));
    startTimer();
    steps.value += 1;
    phoneTries.value = 3;
  } catch (e) {
    notification.pushError(t.t('pages.registration.phone.error'));
    phone.value = '';
  }
  loading.value = false;
}

async function verifyPhoneNumber() {
  try {
    loading.value = true;
    const resp = await verifyPhone(phoneVerification.value);
    notification.pushSuccess(t.t('pages.registration.phoneVerification.correctCode'));
    viewStore.setPageTitle(t.t('pages.registration.email.title'));
    invalid.value = false;
    steps.value += 1;
  } catch (e) {
    notification.pushError(t.t('pages.registration.phoneVerification.wrongCode'));
    invalid.value = true;
    phoneVerification.value = '';
    phoneTries.value -= 1;
    if (phoneTries.value === 0) {
      notification.pushError(t.t('pages.registration.phoneVerification.noTries'));
      steps.value -= 1;
      viewStore.setPageTitle(t.t('pages.registration.phone.title'));
      invalid.value = false;
    }
  }
  loading.value = false;
}

async function postEmailAddress() {
  try {
    loading.value = true;
    const resp = await postEmail(email.value);
    viewStore.setPageTitle(t.t('pages.registration.emailVerification.title'));
    steps.value += 1;
    startTimer();
    emailTries.value = 3;
  } catch (e) {
    notification.pushError(t.t('pages.registration.email.error'));
    email.value = '';
  }
  loading.value = false;
}

async function verifyEmailAddress() {
  try {
    loading.value = true;
    const resp = await verifyEmail(emailVerification.value);
    notification.pushSuccess(t.t('pages.registration.emailVerification.correctCode'));
    viewStore.setPageTitle(null);
    invalid.value = false;
    steps.value += 1;
    router.push({ name: 'dashboard' });
  } catch (e) {
    notification.pushError(t.t('pages.registration.emailVerification.wrongCode'));
    invalid.value = true;
    emailVerification.value = '';

    emailTries.value -= 1;
    if (emailTries.value === 0) {
      notification.pushError(t.t('pages.registration.phoneVerification.noTries'));
      steps.value -= 1;
      viewStore.setPageTitle(t.t('pages.registration.email.title'));
      invalid.value = false;
    }
  }
  loading.value = false;
}

function moveTo(step) {
  switch (step) {
    case 2:
      postPhoneNumber();
      break;
    case 3:
      verifyPhoneNumber();
      break;
    case 4:
      postEmailAddress();
      break;
    default:
      verifyEmailAddress();
  }
}

watch(
  () => route.params.lang,
  () => {
    switch (steps.value) {
      case 2:
        viewStore.setPageTitle(t.t('pages.registration.phoneVerification.title'));
        break;
      case 3:
        viewStore.setPageTitle(t.t('pages.registration.email.title'));
        break;
      case 4:
        viewStore.setPageTitle(t.t('pages.registration.emailVerification.title'));
        break;
      default:
        viewStore.setPageTitle(t.t('pages.registration.phone.title'));
    }
  }
);

async function resendNumber() {
  try {
    loading.value = true;
    const resp = await postPhone(phone.value);
    startTimer();
    notification.pushSuccess(t.t('pages.registration.phoneVerification.sentAgain'));
    phoneTries.value = 3;
  } catch (e) {
    notification.pushError(t.t('pages.registration.phone.error'));
    phone.value = '';
  }
  loading.value = false;
}

async function resendEmail() {
  try {
    loading.value = true;
    const resp = await postEmail(email.value);
    startTimer();
    notification.pushSuccess(t.t('pages.registration.phoneVerification.sentAgain'));
    emailTries.value = 3;
  } catch (e) {
    notification.pushError(t.t('pages.registration.email.error'));
    email.value = '';
  }
  loading.value = false;
}

const privacyModal = ref();

onBeforeRouteLeave((to, _, next) => {
  if (to.name === 'privacy') {
    privacyModal.value.open();
  } else {
    next();
  }
});

onMounted(async () => {
  nextTick(() => {
    viewStore.setPageTitle(t.t('pages.registration.phone.title'));
  });
});

onBeforeUnmount(() => {
  viewStore.setPageTitle(null);
});
</script>

<template>
  <div class="registration">
    <article class="lx-article" v-if="steps === 1">
      <div class="informative-text">
        <p>
          {{ t.t('pages.registration.phone.firstText') }}
        </p>
        <p>{{ t.t('pages.registration.phone.secondText') }}</p>
      </div>

      <div>
        <label for="phone">{{ t.t('pages.registration.phone.inputLabel') }}</label>
        <LxTextInput
          id="phone"
          v-model="phone"
          placeholder="+371"
          :maxlength="8"
          mask="integer"
          :invalid="invalid"
        />
      </div>

      <div class="article-checkbox-wrapper">
        <LxCheckbox v-model="phoneUse">
          <span>
            {{ t.t('pages.registration.phone.agreementLabel') }}&nbsp;
            <router-link :to="{ name: 'privacy' }">
              {{ t.t('pages.registration.phone.privacyPolicy') }}
            </router-link>
          </span>
        </LxCheckbox>
      </div>

      <LxButton
        @click="moveTo(2)"
        :label="t.t('pages.registration.phone.button')"
        icon="next"
        :disabled="!phoneUse || phone?.length !== 8"
        :busy="loading"
      />
    </article>
    <article class="lx-article" v-if="steps === 2">
      <div class="informative-text">
        <p>
          {{ t.t('pages.registration.phoneVerification.firstText') }}<b>+371 {{ phoneHidden }}</b>
        </p>
        <p>{{ t.t('pages.registration.phoneVerification.secondText') }}</p>
      </div>

      <div>
        <label for="phoneVerification">
          {{ t.t('pages.registration.phoneVerification.inputLabel') }}
        </label>
        <LxTextInput
          id="phoneVerification"
          v-model="phoneVerification"
          placeholder="0-0-0-0-0-0"
          mask="custom"
          custom-mask-value="0-0-0-0-0-0"
          :invalid="invalid"
          :invalidation-message="t.t('pages.registration.emailVerification.wrongCode')"
        />
      </div>

      <LxButton
        @click="moveTo(3)"
        :label="t.t('pages.registration.phoneVerification.button')"
        icon="next"
        :disabled="phoneVerification?.length !== 6"
        :busy="loading"
      />

      <ResendCode
        :time-left="timeLeft"
        :formatted-time="formattedTime"
        :loading="loading"
        :label="t.t('pages.registration.phoneVerification.sendAgain')"
        :heading="t.t('pages.registration.phoneVerification.didntReceive')"
        @click="resendNumber()"
      />
    </article>

    <article class="lx-article" v-if="steps === 3">
      <div class="informative-text">
        <p>
          {{ t.t('pages.registration.email.firstText') }}
        </p>
        <p>{{ t.t('pages.registration.email.secondText') }}</p>
      </div>
      <div>
        <label for="email"> {{ t.t('pages.registration.email.inputLabel') }}</label>
        <LxTextInput
          id="email"
          v-model="email"
          :placeholder="t.t('pages.registration.email.placeholder')"
          :invalid="invalid"
        />
      </div>

      <div class="article-checkbox-wrapper">
        <LxCheckbox v-model="emailUse">
          <span>
            {{ t.t('pages.registration.email.agreementLabel') }}&nbsp;
            <router-link :to="{ name: 'privacy' }">
              {{ t.t('pages.registration.email.privacyPolicy') }}
            </router-link>
          </span>
        </LxCheckbox>
      </div>

      <LxButton
        @click="moveTo(4)"
        :label="t.t('pages.registration.email.button')"
        icon="next"
        :disabled="!emailUse || !lxStringUtils.isEmail(email)"
        :busy="loading"
      />
    </article>

    <article class="lx-article" v-if="steps === 4">
      <div class="informative-text">
        <p>
          {{ t.t('pages.registration.emailVerification.firstText') }} <b> {{ emailHidden }}</b>
        </p>
        <p>{{ t.t('pages.registration.emailVerification.secondText') }}</p>
      </div>
      <div>
        <label for="emailVerification">
          {{ t.t('pages.registration.emailVerification.inputLabel') }}
        </label>
        <LxTextInput
          id="emailVerification"
          v-model="emailVerification"
          placeholder="0-0-0-0-0-0"
          mask="custom"
          custom-mask-value="0-0-0-0-0-0"
          :invalid="invalid"
          :invalidation-message="t.t('pages.registration.emailVerification.wrongCode')"
        />
      </div>

      <LxButton
        @click="moveTo(null)"
        :label="t.t('pages.registration.emailVerification.button')"
        icon="next"
        :disabled="emailVerification?.length !== 6"
        :busy="loading"
      />
      <ResendCode
        :time-left="timeLeft"
        :formatted-time="formattedTime"
        :loading="loading"
        :label="t.t('pages.registration.phoneVerification.sendAgain')"
        :heading="t.t('pages.registration.phoneVerification.didntReceive')"
        @click="resendEmail()"
      />
    </article>
    <LxModal
      ref="privacyModal"
      :label="t.t('pages.privacy.title')"
      :button-primary-visible="true"
      :button-primary-label="t.t('pages.privacy.close')"
      @primary-action="privacyModal.close()"
    >
      {{ t.t('pages.privacy.content') }}
    </LxModal>
  </div>
</template>
