import { CLINIC } from '../config/clinic';

const LOCALE = 'ar-u-nu-latn'; // عربي بأرقام لاتينية، كما في باقي الموقع

/** "60.00" → "60 ₪" */
export const formatPrice = (value) => {
  const amount = Number(value);
  if (value === null || value === undefined || value === '' || Number.isNaN(amount)) return '—';
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${CLINIC.currency}`;
};

export const formatDuration = (minutes) => {
  const total = Number(minutes);
  if (!total) return '';
  if (total < 60) return `${total} دقيقة`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  const hoursLabel = hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتان' : `${hours} ساعات`;
  return rest ? `${hoursLabel} و${rest} دقيقة` : hoursLabel;
};

const pad = (n) => String(n).padStart(2, '0');

/**
 * أوقات المواعيد تصل بتوقيت العيادة مع الإزاحة ("2026-09-20T09:00:00+03:00").
 * نقرأ التاريخ والساعة من النص مباشرة، فيرى المريض ساعة العيادة
 * مهما كانت المنطقة الزمنية لجهازه.
 */
export const parseWallTime = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso ?? '');
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return { ymd: `${year}-${month}-${day}`, hour: Number(hour), minute: Number(minute) };
};

/** 9, 0 → "09:00 ص" */
export const formatClock = (hour, minute = 0) => {
  const suffix = hour < 12 ? 'ص' : 'م';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${pad(h12)}:${pad(minute)} ${suffix}`;
};

export const formatSlotTime = (iso) => {
  const wall = parseWallTime(iso);
  return wall ? formatClock(wall.hour, wall.minute) : '';
};

/** "2026-09-17" → "الخميس، 17 سبتمبر 2026" */
export const formatDateLong = (ymd) => {
  const [year, month, day] = (ymd ?? '').split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(LOCALE, {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/** "2026-09-17" → "الخميس" */
export const formatWeekday = (ymd) => {
  const [year, month, day] = (ymd ?? '').split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(LOCALE, {
    timeZone: 'UTC',
    weekday: 'long',
  });
};

/** "2026-09-17T09:00:00+03:00" → "الخميس، 17 سبتمبر 2026 - 09:00 ص" */
export const formatAppointmentDateTime = (iso) => {
  const wall = parseWallTime(iso);
  if (!wall) return '';
  return `${formatDateLong(wall.ymd)} - ${formatClock(wall.hour, wall.minute)}`;
};

/** لطوابع الإنشاء والتحديث: تُعرض بتوقيت العيادة. */
export const formatTimestamp = (iso, { withTime = true } = {}) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
  try {
    return date.toLocaleString(LOCALE, { ...options, timeZone: CLINIC.timezone });
  } catch {
    return date.toLocaleString(LOCALE, options);
  }
};

/** تاريخ اليوم في العيادة بصيغة YYYY-MM-DD (وليس تاريخ جهاز المستخدم أو UTC). */
export const todayInClinic = () => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: CLINIC.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
};

export const addDays = (ymd, days) => {
  const [year, month, day] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
};

/** ثوانٍ → "04:59" */
export const formatCountdown = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`;
};

export const secondsUntil = (iso) => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  return Number.isNaN(target) ? null : Math.round((target - Date.now()) / 1000);
};

export const hoursUntil = (iso) => {
  const seconds = secondsUntil(iso);
  return seconds === null ? null : seconds / 3600;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/** "Dr. Layla Haddad" → "LH"، "د. سارة محمود" → "سم" */
export const initials = (name = '') =>
  name
    .replace(/^(dr\.?|د\.?)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export const pluralizeImages = (count) => {
  if (!count) return 'لا يوجد';
  if (count === 1) return 'صورة واحدة';
  if (count === 2) return 'صورتان';
  return count <= 10 ? `${count} صور` : `${count} صورة`;
};
