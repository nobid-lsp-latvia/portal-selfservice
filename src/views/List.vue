<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { computed } from 'vue';
import { LxList, LxIcon } from '@wntr/lx-ui';
import { useI18n } from 'vue-i18n';

const t = useI18n();

const firstList = computed(() => [
  {
    id: '1',
    name: t.t('pages.document.drivingLicense.title'),
    symbol: 'driving-license',
    icon: 'next',
    href: { name: 'document', params: { id: '1' } },
  },
]);

const secondList = computed(() => [
  {
    id: '2',
    name: t.t('pages.document.diploma.title'),
    symbol: 'diploma',
    icon: 'next',
    href: { name: 'document', params: { id: '2' } },
  },
]);
</script>

<template>
  <div class="document-list">
    <div class="document-group">
      <p>CSDD</p>
      <LxList :items="firstList" list-type="2">
        <template #customItem="item">
          <div class="document-list-item">
            <div>
              <LxIcon :value="item?.symbol" />
              <p class="lx-primary">{{ item?.name }}</p>
            </div>
          </div>
        </template>
      </LxList>
    </div>
    <div class="document-group">
      <p>RTU</p>
      <LxList :items="secondList" list-type="2">
        <template #customItem="item">
          <div class="document-list-item">
            <div>
              <LxIcon :value="item?.symbol" />
              <p class="lx-primary">{{ item?.name }}</p>
            </div>
          </div>
        </template>
      </LxList>
    </div>
  </div>
</template>
