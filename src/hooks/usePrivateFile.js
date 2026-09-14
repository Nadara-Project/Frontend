import { useEffect, useState } from 'react';

/**
 * الإيصالات وصور الاستشارات محفوظة على قرص خاص ولا يمكن فتحها برابط عام،
 * لأن الطلب يحتاج توكن. نجلبها كـ Blob ونحوّلها لرابط محلي مؤقت يُحرَّر عند الإزالة.
 *
 * @param {(() => Promise<Blob>) | null} loader مرّر null لتأجيل التحميل
 * @param {unknown} key يتغيّر عند الحاجة لملف مختلف
 */
export function usePrivateFile(loader, key) {
  const [state, setState] = useState({ key: null, url: null, type: '', error: null });

  useEffect(() => {
    if (!loader) return undefined;

    let objectUrl = null;
    let cancelled = false;

    loader().then(
      (blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setState({ key, url: objectUrl, type: blob.type, error: null });
      },
      (error) => {
        if (!cancelled) setState({ key, url: null, type: '', error });
      }
    );

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // loader دالة جديدة في كل render؛ key هو ما يحدد الملف
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, Boolean(loader)]);

  const loading = Boolean(loader) && state.key !== key;
  return { url: loading ? null : state.url, type: state.type, error: loading ? null : state.error, loading };
}

/** يفتح ملفاً خاصاً في تبويب جديد. التبويب يُفتح فوراً حتى لا يحظره المتصفح. */
export async function openPrivateFile(loader) {
  const popup = window.open('', '_blank');
  try {
    const blob = await loader();
    const url = URL.createObjectURL(blob);
    if (popup) {
      popup.location.href = url;
    } else {
      window.location.href = url;
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    popup?.close();
    throw error;
  }
}
