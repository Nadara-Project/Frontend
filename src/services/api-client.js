// src/services/api-client.js
import { statusFallback, translateErrors, translateMessage } from './errors';

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://nadara.apps.madafa.net/api/v1'
).replace(/\/+$/, '');

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// التخزين قد يرمي استثناء (تصفح خاص، أو حظر ملفات الموقع)، فلا نسمح له بكسر التطبيق.
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // الجلسة تبقى في الذاكرة فقط لهذه الصفحة
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // لا شيء لإزالته
    }
  },
};

const readUser = () => {
  try {
    return JSON.parse(storage.get(USER_KEY));
  } catch {
    return null;
  }
};

/**
 * مخزن جلسة خارجي بسيط تشترك فيه الواجهة عبر useSyncExternalStore،
 * حتى تتحدّث كل المكوّنات فور تسجيل الدخول أو الخروج (بما فيها التبويبات الأخرى).
 */
const listeners = new Set();
let snapshot = { token: storage.get(TOKEN_KEY), user: readUser() };

const emit = () => {
  snapshot = { token: storage.get(TOKEN_KEY), user: readUser() };
  listeners.forEach((listener) => listener());
};

window.addEventListener('storage', (event) => {
  if (event.key === null || event.key === TOKEN_KEY || event.key === USER_KEY) emit();
});

export const authStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
};

const saveSession = ({ token, user }) => {
  storage.set(TOKEN_KEY, token);
  storage.set(USER_KEY, JSON.stringify(user ?? null));
  emit();
};

const saveUser = (user) => {
  if (!storage.get(TOKEN_KEY) || !user) return;
  storage.set(USER_KEY, JSON.stringify({ ...readUser(), ...user }));
  emit();
};

const clearSession = () => {
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);
  emit();
};

/**
 * خطأ موحّد لكل طلبات الـ API.
 * - message: رسالة عربية جاهزة للعرض.
 * - errors: أخطاء الحقول (422) مترجمة، بنفس مفاتيح الباك إند.
 * - retryAfter: عدد ثواني الانتظار عند 429 إن توفّر.
 */
export class ApiError extends Error {
  constructor(status, body, { retryAfter = null } = {}) {
    const rawMessage = body?.message ?? '';
    super(translateMessage(rawMessage, { status }) || statusFallback(status));
    this.name = 'ApiError';
    this.status = status;
    this.rawMessage = rawMessage;
    this.errors = translateErrors(body?.errors ?? {}, status);
    this.retryAfter = retryAfter ?? parseRetrySeconds(rawMessage);
  }

  fieldError(field) {
    return this.errors[field]?.[0] ?? null;
  }

  /** أول رسالة حقل، أو الرسالة العامة. */
  firstError() {
    const first = Object.values(this.errors)[0];
    return first?.[0] ?? this.message;
  }
}

const parseRetrySeconds = (message) => {
  const match = /(\d+)\s*seconds?/i.exec(message ?? '');
  return match ? Number(match[1]) : null;
};

const buildUrl = (path, query) => {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

/**
 * @param {string} path مسار نسبي مثل /appointments
 * @param {object} options
 * @param {'json'|'blob'} [options.responseType]
 */
async function api(
  path,
  { method = 'GET', body, query, auth = true, signal, responseType = 'json' } = {}
) {
  const headers = { Accept: responseType === 'json' ? 'application/json' : '*/*' };
  const isFormData = body instanceof FormData;

  // مع FormData يضبط المتصفح Content-Type مع boundary بنفسه
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const token = storage.get(TOKEN_KEY);
  const sentToken = auth && token;
  if (sentToken) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError(0, null);
  }

  if (!response.ok) {
    // بعض أخطاء الخادم (مثل 500 أو 413 من الـ proxy) ترجع HTML وليس JSON
    const data = await response.json().catch(() => null);

    // نمسح الجلسة فقط إذا كان التوكن المرسل هو المرفوض، لا عند فشل طلب عام
    if (response.status === 401 && sentToken) clearSession();

    const retryHeader = Number(response.headers.get('Retry-After'));
    throw new ApiError(response.status, data, {
      retryAfter: Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : null,
    });
  }

  if (responseType === 'blob') return response.blob();
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

const toFormData = (fields) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else if (typeof value === 'boolean') {
      // قاعدة boolean في Laravel ترفض النص "true"، وتقبل "1" و "0"
      formData.append(key, value ? '1' : '0');
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

/* -------------------------------------------------------------------------- */
/*                                   Auth                                     */
/* -------------------------------------------------------------------------- */

export const auth = {
  register: async (payload) => {
    const { data } = await api('/auth/register', {
      method: 'POST',
      body: { ...payload, device_name: 'web' },
      auth: false,
    });
    saveSession(data);
    return data.user;
  },

  login: async (email, password) => {
    const { data } = await api('/auth/login', {
      method: 'POST',
      body: { email, password, device_name: 'web' },
      auth: false,
    });
    saveSession(data);
    return data.user;
  },

  /** يتحقق من صلاحية التوكن المخزّن ويحدّث بيانات المستخدم. 401 يمسح الجلسة تلقائياً. */
  refreshUser: async () => {
    if (!storage.get(TOKEN_KEY)) return null;
    const { data } = await api('/auth/me');
    saveUser(data);
    return data;
  },

  forgotPassword: (email) =>
    api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),

  // الخادم يُبطل كل التوكنات بعد النجاح، لذلك ننظّف الجلسة المحلية أيضًا.
  resetPassword: async ({ token, email, password, passwordConfirmation }) => {
    const result = await api('/auth/reset-password', {
      method: 'POST',
      body: { token, email, password, password_confirmation: passwordConfirmation },
      auth: false,
    });
    clearSession();
    return result;
  },

  // إبطال التوكن على الخادم إن أمكن، مع ضمان تنظيف الجلسة محليًا في كل الحالات.
  logout: async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // الجلسة المحلية هي مصدر الحقيقة للواجهة.
    } finally {
      clearSession();
    }
  },

  /** يلغي كل توكنات المستخدم على كل الأجهزة، بما فيها هذا الجهاز. */
  logoutAll: async () => {
    try {
      await api('/auth/logout-all', { method: 'POST' });
    } finally {
      clearSession();
    }
  },

  isAuthenticated: () => !!storage.get(TOKEN_KEY),
  currentUser: () => readUser(),
};

/* -------------------------------------------------------------------------- */
/*                                  Profile                                   */
/* -------------------------------------------------------------------------- */

export const profile = {
  get: async () => {
    const { data } = await api('/profile');
    saveUser(data);
    return data;
  },

  /** الحقول المقبولة: name, phone, birth_date, gender */
  update: async (fields) => {
    const { data } = await api('/profile', { method: 'PUT', body: fields });
    saveUser(data);
    return data;
  },

  // POST وليس PUT لأن PHP لا يقرأ multipart في طلبات PUT
  uploadImage: async (file) => {
    const { data } = await api('/profile/image', {
      method: 'POST',
      body: toFormData({ image: file }),
    });
    saveUser(data);
    return data;
  },

  removeImage: async () => {
    const { data } = await api('/profile/image', { method: 'DELETE' });
    saveUser(data);
    return data;
  },
};

/* -------------------------------------------------------------------------- */
/*                                  Catalog                                   */
/* -------------------------------------------------------------------------- */

export const catalog = {
  /** @returns {Promise<{data: object[], meta: object}>} */
  categories: ({ perPage = 100, signal } = {}) =>
    api('/categories', { query: { per_page: perPage }, auth: false, signal }),

  services: ({ categoryId, q, page = 1, perPage = 12, signal } = {}) =>
    api('/services', {
      query: { category_id: categoryId, q, page, per_page: perPage },
      auth: false,
      signal,
    }),

  service: async (id, { signal } = {}) =>
    (await api(`/services/${id}`, { auth: false, signal })).data,
};

/* -------------------------------------------------------------------------- */
/*                                  Doctors                                   */
/* -------------------------------------------------------------------------- */

export const doctors = {
  list: ({ serviceId, q, onlineConsultations, perPage = 100, signal } = {}) =>
    api('/doctors', {
      query: {
        service_id: serviceId,
        q,
        accepts_online_consultations: onlineConsultations ? 1 : undefined,
        per_page: perPage,
      },
      auth: false,
      signal,
    }),

  get: async (id, { signal } = {}) => (await api(`/doctors/${id}`, { auth: false, signal })).data,

  /** @param {string} date بصيغة YYYY-MM-DD */
  availability: async (id, date, { signal } = {}) =>
    (await api(`/doctors/${id}/availability`, { query: { date }, auth: false, signal })).data,
};

/* -------------------------------------------------------------------------- */
/*                                Appointments                                */
/* -------------------------------------------------------------------------- */

export const appointments = {
  list: ({ status, page = 1, perPage = 10, signal } = {}) =>
    api('/appointments', { query: { status, page, per_page: perPage }, signal }),

  get: async (id, { signal } = {}) => (await api(`/appointments/${id}`, { signal })).data,

  /** 409 يعني أن الفترة حُجزت قبلك: أعد تحميل الإتاحة. */
  create: async ({ doctorId, serviceId, startAt }) =>
    (
      await api('/appointments', {
        method: 'POST',
        body: { doctor_id: doctorId, service_id: serviceId, start_at: startAt },
      })
    ).data,

  cancel: async (id, reason) =>
    (
      await api(`/appointments/${id}/cancel`, {
        method: 'POST',
        body: { reason: reason?.trim() || undefined },
      })
    ).data,

  uploadReceipt: async (id, { file, method, reference }) =>
    (
      await api(`/appointments/${id}/payment-receipt`, {
        method: 'POST',
        body: toFormData({ receipt: file, method, reference: reference?.trim() }),
      })
    ).data,

  /** الإيصال على قرص خاص: يُجلب بالتوكن كملف وليس كرابط عام. */
  receiptFile: (id) => api(`/appointments/${id}/payment-receipt`, { responseType: 'blob' }),
};

/* -------------------------------------------------------------------------- */
/*                               Consultations                                */
/* -------------------------------------------------------------------------- */

export const consultations = {
  list: ({ page = 1, perPage = 10, signal } = {}) =>
    api('/consultations', { query: { page, per_page: perPage }, signal }),

  get: async (id, { signal } = {}) => (await api(`/consultations/${id}`, { signal })).data,

  create: async ({ doctorId, serviceId, symptoms, photos = [] }) =>
    (
      await api('/consultations', {
        method: 'POST',
        body: toFormData({
          doctor_id: doctorId,
          service_id: serviceId,
          symptoms: symptoms.trim(),
          photos,
        }),
      })
    ).data,

  uploadReceipt: async (id, { file, method, reference }) =>
    (
      await api(`/consultations/${id}/payment-receipt`, {
        method: 'POST',
        body: toFormData({ receipt: file, method, reference: reference?.trim() }),
      })
    ).data,

  sendMessage: async (id, message) =>
    (
      await api(`/consultations/${id}/messages`, {
        method: 'POST',
        body: { message: message.trim() },
      })
    ).data,

  attachmentFile: (id, attachmentId) =>
    api(`/consultations/${id}/attachments/${attachmentId}`, { responseType: 'blob' }),
};

/* -------------------------------------------------------------------------- */
/*                         Admin — كتالوج المنصة (US-007/008)                  */
/* -------------------------------------------------------------------------- */

export const admin = {
  categories: {
    /** كل التصنيفات مع عدد خدماتها (بما فيها المعطّلة). */
    list: ({ q, page = 1, perPage = 15, signal } = {}) =>
      api('/admin/categories', { query: { q, page, per_page: perPage }, signal }),

    get: async (id, { signal } = {}) => (await api(`/admin/categories/${id}`, { signal })).data,

    create: async ({ name }) =>
      (await api('/admin/categories', { method: 'POST', body: { name: name.trim() } })).data,

    update: async (id, { name }) =>
      (await api(`/admin/categories/${id}`, { method: 'PUT', body: { name: name.trim() } })).data,

    /** يرجع 409 إذا كان التصنيف ما زال يحتوي خدمات. */
    remove: (id) => api(`/admin/categories/${id}`, { method: 'DELETE' }),
  },

  services: {
    /** يشمل الخدمات المعطّلة. isActive: true | false | undefined للكل. */
    list: ({ q, categoryId, isActive, page = 1, perPage = 15, signal } = {}) =>
      api('/admin/services', {
        query: {
          q,
          category_id: categoryId,
          is_active: isActive === undefined ? undefined : isActive ? 1 : 0,
          page,
          per_page: perPage,
        },
        signal,
      }),

    get: async (id, { signal } = {}) => (await api(`/admin/services/${id}`, { signal })).data,

    /** multipart لأن الصورة تُرسل مع الإنشاء. */
    create: async ({ categoryId, name, description, price, isActive, image }) =>
      (
        await api('/admin/services', {
          method: 'POST',
          body: toFormData({
            category_id: categoryId,
            name: name.trim(),
            description: description?.trim(),
            price,
            is_active: isActive,
            image,
          }),
        })
      ).data,

    /** JSON: الصورة لها مسار مستقل لأن PHP لا يقرأ multipart في PUT. */
    update: async (id, { categoryId, name, description, price, isActive }) =>
      (
        await api(`/admin/services/${id}`, {
          method: 'PUT',
          body: {
            category_id: categoryId,
            name: name.trim(),
            description: description?.trim() || null,
            price,
            is_active: isActive,
          },
        })
      ).data,

    toggleActive: async (id) =>
      (await api(`/admin/services/${id}/toggle-active`, { method: 'POST' })).data,

    uploadImage: async (id, file) =>
      (
        await api(`/admin/services/${id}/image`, {
          method: 'POST',
          body: toFormData({ image: file }),
        })
      ).data,

    removeImage: async (id) => (await api(`/admin/services/${id}/image`, { method: 'DELETE' })).data,

    /** حذف ناعم: المواعيد السابقة تبقى مرتبطة بالخدمة. */
    remove: (id) => api(`/admin/services/${id}`, { method: 'DELETE' }),
  },

  /** أعداد سريعة للوحة الإدارة، من meta.total بطلب صفحة واحدة. */
  stats: async ({ signal } = {}) => {
    const total = (promise) => promise.then((response) => response?.meta?.total ?? 0);
    const [services, active, inactive, categories] = await Promise.all([
      total(api('/admin/services', { query: { per_page: 1 }, signal })),
      total(api('/admin/services', { query: { per_page: 1, is_active: 1 }, signal })),
      total(api('/admin/services', { query: { per_page: 1, is_active: 0 }, signal })),
      total(api('/admin/categories', { query: { per_page: 1 }, signal })),
    ]);
    return { services, active, inactive, categories };
  },
};
