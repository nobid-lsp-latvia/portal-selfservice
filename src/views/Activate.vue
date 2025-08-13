<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { shallowRef, ref, computed } from 'vue';
import { LxQr, LxLoader, LxIcon, LxButton } from '@wntr/lx-ui';
import { useI18n } from 'vue-i18n';
import { postPid } from '@/services/personService';
import useNotifyStore from '@/stores/useNotifyStore';
import { useUserStore } from '@/stores/useUserStore';
import ResendCode from '@/components/ResendCode.vue';

const COUNTDOWN_TIME = 60;

const t = useI18n();
const notification = useNotifyStore();
const userStore = useUserStore();

const loading = shallowRef(false);
const error = shallowRef(false);
const qr = ref(null);

const email = computed(() => userStore.email);

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

async function generateQr() {
  try {
    startTimer();
    loading.value = true;
    error.value = false;
    const resp = await postPid();
    qr.value = resp.data?.urlData;
  } catch (e) {
    notification.pushError(t.t('pages.activate.error'));
    error.value = true;
  }
  loading.value = false;
}
</script>

<template>
  <div class="activation">
    <article class="lx-article">
      <p>
        {{ t.t('pages.activate.firstText') }}
      </p>
      <div class="qr-instruction">
        <p>
          {{ t.t('pages.activate.secondText') }}
        </p>
        <p>
          {{ t.t('pages.activate.stepOne') }}
        </p>
        <p>
          {{ t.t('pages.activate.stepTwo') }}
        </p>
        <p>
          {{ t.t('pages.activate.stepThree') }}
        </p>
        <p>
          {{ t.t('pages.activate.stepFour', { email }) }}
        </p>
      </div>
      <div>
        <div v-if="loading || error || !qr" class="loader-wrapper">
          <LxLoader
            :loading="loading"
            :label="t.t('pages.activate.loaderTitle')"
            :description="t.t('pages.activate.loaderDescription')"
          />
          <div class="qr-code-load-error" v-if="error">
            <LxIcon value="invalid" />
            {{ t.t('pages.activate.error') }}
            <LxButton
              :label="t.t('pages.activate.generateQr')"
              @click="generateQr"
              v-if="!qr && !loading && error"
            />
          </div>
          <LxButton
            :label="t.t('pages.activate.generateQr')"
            @click="generateQr"
            v-if="!qr && !loading && !error"
          />
        </div>
        <LxQr :value="qr" :ignore-theme="true" v-else-if="!error && !loading && qr" />
      </div>
      <div class="activate-again-wrapper" v-if="qr">
        <ResendCode
          :heading="t.t('pages.activate.didntReceive')"
          :label="t.t('pages.activate.generateAgain')"
          :timeLeft="timeLeft"
          :formatted-time="formattedTime"
          @click="generateQr"
        />
      </div>
    </article>
    <img src="@/assets/illustration.png" alt="NOBID EUDIW illustration" />
  </div>
</template>
