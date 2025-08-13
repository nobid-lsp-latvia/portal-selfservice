<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { LxTile } from '@wntr/lx-ui';
import { useI18n } from 'vue-i18n';
import { postPerson } from '@/services/personService';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore';

const router = useRouter();
const t = useI18n();
const userStore = useUserStore();

onMounted(async () => {
  const resp = await postPerson();
  if (resp.status >= 400) {
    router.push({ name: 'registration' });
  } else {
    const email = resp.data?.contacts?.find((x) => x.type === 'email')?.value;
    const phone = resp.data?.contacts?.find((x) => x.type === 'phone')?.value;
    userStore.setUserData(email, phone);
  }
});
</script>

<template>
  <div>
    <div class="lx-dashboard">
      <LxTile
        icon="qr"
        :label="t.t('pages.dashboard.activateTitle')"
        :description="t.t('pages.dashboard.activateDescription')"
        :to="{ name: 'activate' }"
      />
      <LxTile
        icon="documents"
        :label="t.t('pages.dashboard.documentTitle')"
        :description="t.t('pages.dashboard.documentDescription')"
        :to="{ name: 'documents' }"
      />
    </div>
    <div style="height: 1rem"></div>
    <div class="lx-dashboard">
      <LxTile
        icon="help"
        :label="t.t('shell.shell.helpTitle')"
        :to="{ name: 'help' }"
        kind="mini"
      />
    </div>
  </div>
</template>
