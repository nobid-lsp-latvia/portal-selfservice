// SPDX-License-Identifier: EUPL-1.2

import useAuthStore from '@/stores/useAuthStore';

export default () => {
  const authStore = useAuthStore();
  // const portalSelfserviceScopes = {
  //   citizen: 'citizen',
  // };
  return {
    // Temporary function to test permissions
    isAuthorized: () => authStore.session?.active,
  };
};
