import { useEffect, useState } from 'react';

/** يؤخر تحديث القيمة حتى يتوقف المستخدم عن الكتابة، لتقليل طلبات البحث. */
export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
