// SPDX-License-Identifier: EUPL-1.2

export const APP_CONFIG = {
  // @ts-ignore
  apiUrl: window.config.serviceUrl,
  // @ts-ignore
  authUrl: window.config.authUrl,
  // @ts-ignore
  publicUrl: window.config.publicUrl,
  // @ts-ignore
  clientId: window.config.clientId,
  // @ts-ignore
  environment: window.config.environment,
};

export const AUTH_KEY_TOKEN_SESSION = 'portal-selfservice-sessionkey';

export const AUTH_SCOPE = 'example';
