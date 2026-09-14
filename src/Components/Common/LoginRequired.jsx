import { Link } from 'react-router-dom';
import { FiAlertOctagon } from 'react-icons/fi';

/**
 * رسالة "تسجيل الدخول مطلوب" لصفحات الحجز والاستشارة.
 * `from` هو المسار الذي يعود إليه المستخدم مباشرة بعد تسجيل الدخول.
 */
const LoginRequired = ({ from }) => (
  <section dir="rtl" className="w-full bg-[#D5C7AD1A] px-[16px] py-[72px] sm:px-[24px] sm:py-[88px]">
    <div className="mx-auto flex w-full max-w-[448px] flex-col items-center gap-[12px]">
      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#D5C7AD80] sm:h-[80px] sm:w-[80px]">
        <FiAlertOctagon className="h-[32px] w-[32px] text-[#4A294B] sm:h-[40px] sm:w-[40px]" aria-hidden="true" />
      </div>

      <h2 className="w-full pt-[4px] text-center font-[Tajawal] text-[22px] font-bold leading-[32px] text-[#4C2325] sm:text-[24px]">
        تسجيل الدخول مطلوب
      </h2>

      <p className="w-full text-center font-[Tajawal] text-[15px] leading-[24px] text-[#4C2325] sm:text-[16px]">
        يرجى تسجيل الدخول للمتابعة، أو أنشئ حساباً جديداً خلال دقيقة.
      </p>

      <div className="mt-[8px] flex w-full flex-col items-center justify-center gap-[10px] sm:flex-row">
        <Link
          to="/login"
          state={{ from }}
          className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#4C2325] px-[24px] font-[Tajawal] text-[17px] font-medium text-white shadow-[0px_1px_2px_0px_#0000000D] transition hover:opacity-90 sm:w-[176px]"
        >
          تسجيل الدخول
        </Link>
        <Link
          to="/register"
          state={{ from }}
          className="flex h-[48px] w-full items-center justify-center rounded-[8px] border border-[#4C2325] px-[24px] font-[Tajawal] text-[17px] font-medium text-[#4C2325] transition hover:bg-[#4C2325]/5 sm:w-[176px]"
        >
          إنشاء حساب
        </Link>
      </div>
    </div>
  </section>
);

export default LoginRequired;
