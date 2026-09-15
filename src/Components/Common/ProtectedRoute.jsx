import { Link, Navigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { homePathFor } from '../../config/navigation';
import Header from '../../Layouts/Header';

const DENIED_COPY = {
  patient: {
    title: 'هذه الصفحة مخصّصة للمرضى',
    body: 'الحجز والاستشارات والدفع متاحة لحسابات المرضى فقط. حسابك الحالي حساب طاقم.',
  },
  admin: {
    title: 'هذه الصفحة لإدارة المنصة',
    body: 'إدارة الخدمات والتصنيفات متاحة لحسابات الإدارة فقط.',
  },
};

/**
 * يمنع الوصول للمسارات الخاصة، ويحتفظ بالمسار المطلوب (مع معاملات البحث مثل ?service_id)
 * حتى يعود إليه المستخدم مباشرة بعد تسجيل الدخول.
 * يشترك في مخزن الجلسة، فيُخرج المستخدم فوراً إذا انتهت جلسته وهو داخل الصفحة.
 *
 * role: الدور المطلوب ('patient' | 'admin'). الباك إند يرفض غيره بـ 403،
 * فنعرض رسالة واضحة بدل صفحة تفشل طلباتها.
 */
const ProtectedRoute = ({ children, role, patientOnly = false }) => {
  const location = useLocation();
  const { isAuthenticated, user, isPatient } = useAuth();
  const requiredRole = patientOnly ? 'patient' : role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  const allowed =
    !requiredRole || (requiredRole === 'patient' ? isPatient : user?.role === requiredRole);

  if (!allowed) {
    const copy = DENIED_COPY[requiredRole];
    return (
      <div className="min-h-screen bg-[#F4F2EE] font-['Tajawal']" dir="rtl">
        <Header />
        <main className="mx-auto flex max-w-[480px] flex-col items-center gap-[12px] px-[16px] py-[80px] text-center">
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#D5C7AD80] text-[#4C2325]">
            <FiLock className="h-[28px] w-[28px]" aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-[700] text-[#4C2325]">{copy.title}</h1>
          <p className="text-[15px] leading-[24px] text-[#6B5E5F]">{copy.body}</p>
          <Link to={homePathFor(user)} className="mt-[8px] text-[14px] font-[700] text-[#4C2325] hover:underline">
            الذهاب إلى حسابي
          </Link>
        </main>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
