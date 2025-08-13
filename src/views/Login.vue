<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { useI18n } from 'vue-i18n';
import { LxButton } from '@wntr/lx-ui';
import useAuthStore from '@/stores/useAuthStore';
import { authorize } from '@/services/authService';

const authStore = useAuthStore();
const i18n = useI18n();
</script>

<template>
  <LxButton
    v-if="authStore.isAuthorized"
    :href="{ name: 'loading' }"
    :label="i18n.t('pages.home.buttons.loginAuthorized')"
    icon="next"
  />
  <LxButton
    v-if="!authStore.isAuthorized"
    @click="authorize"
    :label="i18n.t('pages.home.buttons.loginUnauthorized')"
    icon="next"
  />
</template>
