// SPDX-License-Identifier: EUPL-1.2

import { defineStore } from 'pinia';

export const useTestStore = defineStore('demo', {
  state: () => ({
    registered: false,
  }),
});
