// SPDX-License-Identifier: EUPL-1.2

import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    email: null,
    phone: null,
  }),
  actions: {
    setUserData(email, phone) {
      this.email = email;
      this.phone = phone;
    },
  },
});
