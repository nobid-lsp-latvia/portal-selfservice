// SPDX-License-Identifier: EUPL-1.2

import api from '@/api';

export async function getPerson() {
  return api().post('/1.0/person');
}

export async function postEmail(email) {
  const body = {
    email,
  };
  return api().post('/1.0/person/email', body);
}

export async function verifyEmail(code) {
  const body = {
    verificationCode: code,
  };
  return api().post('/1.0/person/email/verify', body);
}

export async function postPhone(phone) {
  const body = {
    phoneNumber: `+371${phone}`,
  };
  return api().post('/1.0/person/phone', body);
}

export async function verifyPhone(code) {
  const body = {
    verificationCode: code,
  };
  return api().post('/1.0/person/phone/verify', body);
}

export async function postPid() {
  return api().post('/1.0/pid');
}

export async function postPerson() {
  return api().post('/1.0/person');
}

export async function postDocument(type) {
  return api().post(`/1.0/${type}`, { type });
}
