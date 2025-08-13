<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { LxLoader } from '@wntr/lx-ui';
import { onMounted } from 'vue';
import { postPerson } from '@/services/personService';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  // If already registered, redirect to dashboard
  try {
    const resp = await postPerson();
    if (resp.status >= 200 && resp.status < 300) {
      router.push({ name: 'dashboard' });
    }
  } catch (e) {
    // else redirect to registration
    router.push({ name: 'registration' });
  }
});
</script>
<template>
  <div>
    <LxLoader :loading="true" />
  </div>
</template>
