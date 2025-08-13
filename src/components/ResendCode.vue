<!-- SPDX-License-Identifier: EUPL-1.2 -->

<script setup>
import { LxIcon, LxLoader } from '@wntr/lx-ui';

const props = defineProps({
  timeLeft: { type: Number, default: 0 },
  formattedTime: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  label: { type: String, default: '' },
  heading: { type: String, default: '' },
});

const emits = defineEmits(['click']);

function buttonClick() {
  emits('click');
}
</script>

<template>
  <div class="onboarding-button-wrapper">
    <p>{{ heading }}</p>
    <div
      class="lx-button lx-button-secondary"
      :class="[{ 'lx-disabled': timeLeft > 0 }, { 'lx-disabled lx-busy': loading }]"
      v-if="timeLeft > 0"
    >
      <div class="lx-button-content-wrapper">
        <div class="lx-loader-container" v-if="loading">
          <LxLoader :loading="true" size="s" />
        </div>
        <div class="custom-button-icon-wrapper" v-else-if="!loading && timeLeft > 0">
          <LxIcon value="timer" />
          <p>{{ formattedTime }}</p>
        </div>
        <div class="custom-button-icon-wrapper" v-else>
          <LxIcon value="refresh" />
        </div>

        <div class="lx-button-content">
          <div class="lx-button-label">
            {{ label }}
          </div>
        </div>
      </div>
    </div>

    <button
      class="lx-button lx-button-secondary"
      :class="[{ 'lx-disabled': timeLeft > 0 }, { 'lx-disabled lx-busy': loading }]"
      :title="label"
      :disabled="timeLeft > 0 || loading"
      v-else
      @click="buttonClick"
    >
      <div class="lx-button-content-wrapper">
        <div class="lx-loader-container" v-if="loading">
          <LxLoader :loading="true" size="s" />
        </div>
        <div class="custom-button-icon-wrapper" v-else-if="!loading && timeLeft > 0">
          <LxIcon value="timer" />
          <p>{{ formattedTime }}</p>
        </div>
        <div class="custom-button-icon-wrapper" v-else>
          <LxIcon value="refresh" />
        </div>

        <div class="lx-button-content">
          <div class="lx-button-label">
            {{ label }}
          </div>
        </div>
      </div>
    </button>
  </div>
</template>
