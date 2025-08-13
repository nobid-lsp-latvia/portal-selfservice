// SPDX-License-Identifier: EUPL-1.2

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import VueClickAway from 'vue3-click-away';
import App from '@/App.vue';
import router from '@/router';
import lv from '@/locales/lv.json';
import en from '@/locales/en.json';
import events from '@/router/events';
import { createLx } from '@wntr/lx-ui';
import { APP_CONFIG, AUTH_KEY_TOKEN_SESSION } from '@/constants';

import '@wntr/lx-ui/dist/styles/lx-shell-grid-public.css';
import '@wntr/lx-ui/dist/bundles/lx-bt-digimaks.css';

import '@/assets/styles.css';

const myApp = createApp(App);
myApp.use(createPinia());
events(router);
myApp.use(router);

myApp.use(
  createI18n({
    legacy: false,
    locale: 'lv',
    messages: {
      lv,
      en,
    },
  })
);
myApp.use(VueClickAway);
myApp.use(createLx, {
  systemId: 'portal-selfservice',
  authSessionKey: AUTH_KEY_TOKEN_SESSION,
  authUrl: APP_CONFIG.authUrl,
  authClientId: APP_CONFIG.clientId,
  publicUrl: APP_CONFIG.publicUrl,
  environment: APP_CONFIG.environment,
  iconSet: 'phosphor',
});
myApp.mount('#app');
