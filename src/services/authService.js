// SPDX-License-Identifier: EUPL-1.2

import apiAuth from '@/apiAuth';
import { APP_CONFIG, AUTH_SCOPE } from '@/constants';

export function session() {
  return apiAuth().get('/api/1.0/session');
}

export function keepAlive() {
  return apiAuth().get('/api/1.0/session/keep-alive');
}

export function roles() {
  return apiAuth().get('/api/1.0/session/roles');
}

export function setRole(roleCode) {
  return apiAuth().patch('/api/1.0/session', { role: roleCode });
}

export function authorize() {
  const redirectURI = new URL('/auth-done', APP_CONFIG.publicUrl).href;
  const params = new URLSearchParams({
    client_id: APP_CONFIG.clientId,
    redirect_uri: redirectURI,
    acr_values: AUTH_SCOPE,
  });
  window.location.href = `${APP_CONFIG.authUrl}authorize?${params.toString()}`;
}

export function status() {
  return apiAuth().get('/api/1.0/session');
}

export async function logout() {
  await apiAuth().delete('/api/1.0/session');
}
