import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * تحميل بيانات غير متزامن مع إلغاء الطلب القديم عند تغيّر المدخلات أو مغادرة الصفحة.
 *
 * loader يستقبل AbortSignal ويرجع Promise.
 * أثناء إعادة التحميل تبقى البيانات السابقة ظاهرة (بدون وميض)، و loading = true.
 *
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} loader
 * @param {unknown[]} deps
 */
export function useAsync(loader, deps = []) {
  const [reloadToken, setReloadToken] = useState(0);

  // هوية الطلب الحالي: كائن جديد كلما تغيّرت المدخلات أو طُلبت إعادة التحميل
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const request = useMemo(() => ({}), [...deps, reloadToken]);

  const [result, setResult] = useState({ request: null, data: undefined, error: null });

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve()
      .then(() => loader(controller.signal))
      .then(
        (data) => {
          if (!controller.signal.aborted) setResult({ request, data, error: null });
        },
        (error) => {
          if (controller.signal.aborted || error?.name === 'AbortError') return;
          setResult((previous) => ({ request, data: previous.data, error }));
        }
      );

    return () => controller.abort();
    // loader يُعاد إنشاؤه في كل render؛ التغيير الحقيقي تمثّله deps عبر request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  /** تعديل البيانات محلياً بعد عملية ناجحة دون طلب جديد. */
  const setData = useCallback(
    (updater) =>
      setResult((previous) => ({
        ...previous,
        data: typeof updater === 'function' ? updater(previous.data) : updater,
      })),
    []
  );

  const loading = result.request !== request;

  return {
    data: result.data,
    error: loading ? null : result.error,
    loading,
    reload,
    setData,
  };
}
