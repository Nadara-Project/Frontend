// src/services/api-client.js
const BASE_URL = 'https://nadara.apps.madafa.net/api/v1';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const userStore = {
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user ?? null)),
  clear: () => localStorage.removeItem(USER_KEY),
};

/**
 * مخزن جلسة خارجي بسيط تشترك فيه الواجهة عبر useSyncExternalStore،
 * حتى تتحدّث كل المكوّنات فور تسجيل الدخول أو الخروج (بما فيها التبويبات الأخرى).
 */
const listeners = new Set();
let snapshot = { token: tokenStore.get(), user: userStore.get() };

const emit = () => {
  snapshot = { token: tokenStore.get(), user: userStore.get() };
  listeners.forEach((listener) => listener());
};

window.addEventListener('storage', emit);

export const authStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
};

const saveSession = ({ token, user }) => {
  tokenStore.set(token);
  userStore.set(user);
  emit();
};

const clearSession = () => {
  tokenStore.clear();
  userStore.clear();
  emit();
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
    if (response.status === 401) clearSession();
    throw new ApiError(response.status, data);
  }
  return data;
}

export const auth = {
  register: async (payload) => {
    const { data } = await api('/auth/register', { method: 'POST', body: { ...payload, device_name: 'web' }, auth: false });
    saveSession(data);
    return data.user;
  },
  login: async (email, password) => {
    const { data } = await api('/auth/login', { method: 'POST', body: { email, password, device_name: 'web' }, auth: false });
    saveSession(data);
    return data.user;
  },
  forgotPassword: (email) => api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),

  // إبطال التوكن على الخادم إن أمكن، مع ضمان تنظيف الجلسة محليًا في كل الحالات.
  logout: async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // تجاهل فشل الطلب: الجلسة المحلية هي مصدر الحقيقة للواجهة.
    } finally {
      clearSession();
    }
  },

  isAuthenticated: () => !!tokenStore.get(),
  currentUser: () => userStore.get(),
};
