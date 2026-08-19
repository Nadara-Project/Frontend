import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { FiMail } from "react-icons/fi";

const CheckEmail = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
        
        <Header 
          title="تفقد بريدك الإلكتروني" 
          subtitle="أرسلنا رابط إعادة ضبط كلمة المرور إلى بريدك الإلكتروني." 
        />

        <div className="flex flex-col items-center pt-[24px] px-[24px] pb-[24px] w-full text-center">
          {/* أيقونة الإيميل باللون الأساسي والذهبي/البيج المحدث */}
          <div className="w-[80px] h-[80px] bg-[#D5C7AD]/20 rounded-full flex items-center justify-center mb-[20px]">
            <FiMail className="w-[40px] h-[40px] text-[#4C2325]" />
          </div>

          <p className="text-[14px] text-[#4C2325]/80 mb-[24px]">
            لم يصلك البريد؟ تأكد من مجلد الرسائل غير المرغوب فيها (Spam) أو أعد المحاولة.
          </p>

          <Link
            to="/forgot-password"
            className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-medium text-[14px] rounded-[8px] flex items-center justify-center transition-colors"
          >
            إعادة الإرسال
          </Link>
        </div>

        {/* الفوتر السفلي - بالقيم المحدثة من Figma */}
        <div className="w-full h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex items-center justify-center gap-1 font-tajawal text-center mt-auto">
          <span className="font-normal text-[14px] leading-[24px] text-[#4C2325]">
            تذكرت كلمة المرور؟
          </span>
          
          <Link 
            to="/login" 
            className="font-bold text-[14px] leading-[20px] tracking-[0.14px] text-[#4C2325] hover:underline mr-1"
          >
            تسجيل دخول
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CheckEmail;