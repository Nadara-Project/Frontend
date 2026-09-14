import { useEffect, useState } from 'react';

/**
 * عدّاد تنازلي حتى وقت محدد (ISO 8601) مأخوذ من الخادم،
 * فلا يُعاد ضبطه عند تحديث الصفحة كما كان يحدث مع عدّاد ثابت يبدأ من 30 دقيقة.
 *
 * @returns {number|null} الثواني المتبقية (لا تقل عن صفر)، أو null إن لم يوجد موعد نهائي.
 */
export function useCountdown(targetIso) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetIso) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [targetIso]);

  if (!targetIso) return null;
  const target = new Date(targetIso).getTime();
  if (Number.isNaN(target)) return null;
  return Math.max(0, Math.round((target - now) / 1000));
}
