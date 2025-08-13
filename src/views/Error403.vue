<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { LxErrorPage } from '@wntr/lx-ui';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const t = useI18n();
const router = useRouter();

function action(actionName) {
  if (actionName === 'dashboard') {
    router.push({ name: 'home' });
    return;
  }
  router.go(-1);
}

const texts = computed(() => ({
  defaultError403: {
    title: t.t('errors.403.title'),
    description: t.t('errors.403.description'),
  },
}));
</script>
<template>
  <LxErrorPage
    kind="403"
    @actionClick="action"
    :action-definitions="[
      { id: 'back', name: t.t('pages.error.goBack'), icon: 'undo' },
      {
        id: 'dashboard',
        name: t.t('pages.error.goHome'),
        icon: 'dashboard',
        kind: 'secondary',
      },
    ]"
    :texts="texts"
  />
</template>
