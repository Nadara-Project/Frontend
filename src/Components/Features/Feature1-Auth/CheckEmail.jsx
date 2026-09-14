import { Link, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";

const CheckEmail = () => {
  const email = useLocation().state?.email;

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col" dir="rtl">
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
          <Header
            title="تفقد بريدك الإلكتروني"
            subtitle="إذا كان البريد مسجّلاً لدينا، فقد أرسلنا إليه رابط إعادة تعيين كلمة المرور."
          />

          <div className="flex flex-col items-center px-4 pb-6 sm:px-6 w-full text-center">
            <div className="w-[80px] h-[80px] bg-[#D5C7AD]/20 rounded-full flex items-center justify-center mb-[20px]">
              <FiMail className="w-[40px] h-[40px] text-[#4C2325]" aria-hidden="true" />
            </div>

            {email && (
              <p dir="ltr" className="mb-[12px] text-[14px] font-[600] text-[#4C2325] break-all">
                {email}
              </p>
            )}

            <p className="text-[14px] leading-[22px] text-[#4C2325]/80 mb-[24px]">
              الرابط صالح لمدة ساعة واحدة. لم يصلك البريد؟ تأكد من مجلد الرسائل غير المرغوب فيها (Spam)، أو أعد
              الإرسال بعد دقيقة.
            </p>

            <Link
              to="/forgot-password"
              state={email ? { email } : undefined}
              className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-medium text-[14px] rounded-[8px] flex items-center justify-center transition-colors"
            >
              إعادة الإرسال
            </Link>
          </div>

          <div className="w-full min-h-[57px] py-[16px] px-4 sm:px-6 bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex flex-wrap items-center justify-center gap-1 text-center mt-auto">
            <span className="text-[14px] leading-[24px] text-[#4C2325]">تذكرت كلمة المرور؟</span>
            <Link to="/login" className="font-bold text-[14px] leading-[20px] text-[#4C2325] hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckEmail;
