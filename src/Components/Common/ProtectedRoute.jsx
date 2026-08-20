import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../../services/api-client';

/**
 * يمنع الوصول للمسارات الخاصة، ويحتفظ بالمسار المطلوب
 * حتى يعود إليه المستخدم مباشرة بعد تسجيل الدخول.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
