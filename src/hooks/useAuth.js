import { useCallback, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, authStore } from '../services/api-client';

/**
 * يشترك في مخزن الجلسة، فتُعاد تهيئة الواجهة تلقائياً
 * عند تسجيل الدخول أو الخروج دون الاعتماد على تغيّر المسار.
 */
export const useAuth = () => {
  const { token, user } = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await auth.logout();
    navigate('/login', { replace: true });
  }, [navigate]);

  return { user, isAuthenticated: !!token, logout };
};
