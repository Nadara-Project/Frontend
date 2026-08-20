// src/services/api-client.js
const BASE_URL = 'https://nadara.apps.madafa.net/api/v1';
const tokenStore = {
  get: () => localStorage.getItem('auth_token'),
  set: (token) => localStorage.setItem('auth_token', token),
  clear: () => localStorage.removeItem('auth_token'),
};

class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? 'Request failed');
    this.status = status;
    this.errors = body?.errors ?? {};
  }
  fieldError(field) {
    return this.errors[field]?.[0] ?? null;
  }
}

async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    if (response.status === 401) tokenStore.clear();
    throw new ApiError(response.status, data);
  }
  return data;
}

export const auth = {
  register: async (payload) => {
    const { data } = await api('/auth/register', { method: 'POST', body: { ...payload, device_name: 'web' }, auth: false });
    tokenStore.set(data.token);
    return data.user;
  },
  login: async (email, password) => {
    const { data } = await api('/auth/login', { method: 'POST', body: { email, password, device_name: 'web' }, auth: false });
    tokenStore.set(data.token);
    return data.user;
  },
  forgotPassword: (email) => api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),
};