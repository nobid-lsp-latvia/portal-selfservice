<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import { LxQr, LxLoader, LxIcon, LxButton } from '@wntr/lx-ui';
import useViewStore from '@/stores/useViewStore';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { postDocument } from '@/services/personService';
import useNotifyStore from '@/stores/useNotifyStore';
import { useUserStore } from '@/stores/useUserStore';
import ResendCode from '@/components/ResendCode.vue';

const COUNTDOWN_TIME = 60;

const route = useRoute();
const t = useI18n();
const viewStore = useViewStore();
const notification = useNotifyStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref(null);
const qr = ref(null);

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

onMounted(async () => {
  if (route.params.id === '1') {
    viewStore.setPageTitle(t.t('pages.document.drivingLicense.title'));
  } else {
    viewStore.setPageTitle(t.t('pages.document.diploma.title'));
  }
});

async function generateQr() {
  try {
    loading.value = true;
    error.value = null;
    startTimer();
    const res = await postDocument(route.params.id === '1' ? 'mdl' : 'rtu');
    qr.value = res.data?.urlData;
  } catch (e) {
    if (e.status === 404) {
      notification.pushError(t.t('pages.activate.errorNoDocument'));
    } else {
      notification.pushError(t.t('pages.activate.error'));
    }
    error.value = e.status;
    console.log(e);
  }
  loading.value = false;
}

watch(
  () => route.params.lang,
  () => {
    if (route.params.id === '1') {
      viewStore.setPageTitle(t.t('pages.document.drivingLicense.title'));
    } else {
      viewStore.setPageTitle(t.t('pages.document.diploma.title'));
    }
  }
);

const mappedTexts = computed(() => {
  if (route.params.id === '1') {
    return 'drivingLicense';
  }
  return 'diploma';
});

const email = computed(() => userStore.email);

onBeforeUnmount(() => {
  viewStore.setPageTitle(null);
});
</script>

<template>
  <div class="document-view">
    <article class="lx-article">
      <div class="qr-instruction">
        <p>
          {{ t.t('pages.document.secondText') }}
        </p>
        <p>
          {{ t.t('pages.document.stepOne') }}
        </p>
        <p>
          {{ t.t('pages.document.stepTwo') }}
        </p>
        <p>
          {{ t.t('pages.document.stepThree') }}
        </p>
        <p>
          {{ t.t('pages.document.stepFour', { email }) }}
        </p>
      </div>
      <div>
        <div v-if="loading || error || !qr" class="loader-wrapper">
          <LxLoader
            v-if="loading"
            :loading="loading"
            :label="t.t('pages.activate.loaderTitle')"
            :description="t.t('pages.activate.loaderDescription')"
          />
          <div class="qr-code-load-error" v-if="error">
            <LxIcon value="invalid" />
            {{
              error === 404 ? t.t('pages.activate.errorNoDocument') : t.t('pages.activate.error')
            }}
            <LxButton
              :label="t.t('pages.document.generateQr')"
              @click="generateQr"
              v-if="!qr && !loading && error && error !== 404"
            />
          </div>
          <LxButton
            :label="t.t('pages.document.generateQr')"
            @click="generateQr"
            v-if="!qr && !loading && !error"
          />
        </div>
        <LxQr :value="qr" :ignore-theme="true" size="l" v-else-if="!error && !loading && qr" />
      </div>
      <div class="document-qr-again-wrapper" v-if="qr">
        <ResendCode
          :heading="t.t('pages.document.didntReceive')"
          :label="t.t('pages.document.generateAgain')"
          :timeLeft="timeLeft"
          :formatted-time="formattedTime"
          @click="generateQr"
        />
      </div>
    </article>
    <div class="side-panel">
      <!-- TODO: add RTU logo-->
      <!-- TODO: add correct alt text -->
      <span v-if="route.params.id === '1'"><img src="@/assets/CSDD_logo.png" alt="Logo" /></span>
      <span v-if="route.params.id === '2'">
        <!-- TODO: remove inline styles -->
        <img src="@/assets/RTU_logo.png" alt="Logo" />
      </span>
      <div>
        <label>{{ t.t('pages.document.documentIssuer') }}</label>
        <p class="lx-primary">{{ t.t(`pages.document.${mappedTexts}.issuer`) }}</p>
      </div>

      <!-- <p class="small-header">{{ t.t('pages.document.issuerInfo') }}</p> -->
      <div>
        <label>{{ t.t('pages.document.website') }}</label>
        <p class="lx-primary">
          <a target="_blank" :href="`https://${t.t(`pages.document.${mappedTexts}.website`)}`">
            {{ t.t(`pages.document.${mappedTexts}.website`) }}
          </a>
        </p>
      </div>
      <div>
        <label>{{ t.t('pages.document.email') }}</label>
        <p class="lx-primary">{{ t.t(`pages.document.${mappedTexts}.email`) }}</p>
      </div>
      <div>
        <label>{{ t.t('pages.document.phone') }}</label>
        <p class="lx-primary">{{ t.t(`pages.document.${mappedTexts}.phone`) }}</p>
      </div>
      <div>
        <label>{{ t.t('pages.document.address') }}</label>
        <p class="lx-primary">{{ t.t(`pages.document.${mappedTexts}.address`) }}</p>
      </div>
      <div>
        <label>{{ t.t('pages.document.number') }}</label>
        <p class="lx-primary">{{ t.t(`pages.document.${mappedTexts}.number`) }}</p>
      </div>
    </div>
  </div>
</template>
