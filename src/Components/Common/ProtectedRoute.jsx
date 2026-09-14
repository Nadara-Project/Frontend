import { Link, Navigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../Layouts/Header';

/**
 * يمنع الوصول للمسارات الخاصة، ويحتفظ بالمسار المطلوب (مع معاملات البحث مثل ?service_id)
 * حتى يعود إليه المستخدم مباشرة بعد تسجيل الدخول.
 * يشترك في مخزن الجلسة، فيُخرج المستخدم فوراً إذا انتهت جلسته وهو داخل الصفحة.
 *
 * patientOnly: الحجز والدفع والاستشارة من صلاحيات المريض فقط في الباك إند،
 * فنعرض رسالة واضحة للطبيب أو الأدمن بدل نموذج سيُرفض بخطأ 403.
 */
const ProtectedRoute = ({ children, patientOnly = false }) => {
  const location = useLocation();
  const { isAuthenticated, isPatient } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  if (patientOnly && !isPatient) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] font-['Tajawal']" dir="rtl">
        <Header />
        <main className="mx-auto flex max-w-[480px] flex-col items-center gap-[12px] px-[16px] py-[80px] text-center">
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#D5C7AD80] text-[#4C2325]">
            <FiLock className="h-[28px] w-[28px]" aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-[700] text-[#4C2325]">هذه الصفحة مخصّصة للمرضى</h1>
          <p className="text-[15px] leading-[24px] text-[#6B5E5F]">
            الحجز والاستشارات والدفع متاحة لحسابات المرضى فقط. حسابك الحالي حساب طاقم.
          </p>
          <Link to="/" className="mt-[8px] text-[14px] font-[700] text-[#4C2325] hover:underline">
            العودة إلى الرئيسية
          </Link>
        </main>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
