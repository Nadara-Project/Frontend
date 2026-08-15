import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
   const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('إرسال رابط إعادة الضبط إلى:', email);
        navigate('/check-email');
  };
    // هنا يتم ربط الـ API لإرسال الإيميل
 

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
        
        <Header 
          title="استعادة كلمة المرور" 
          subtitle="أدخلي بريدك الإلكتروني لإرسال رابط إعادة الضبط" 
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] pt-[24px] px-[24px] pb-[24px] w-full">
          <div className="flex flex-col gap-[8px] w-full text-right">
            <label className="text-[14px] font-medium text-[#4C2325]">البريد الالكتروني</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full h-[53px] pt-[15px] pb-[14px] px-[16px] border border-[#9E9E9E] rounded-[8px] bg-white text-[14px] text-[#4C2325] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4C2325] focus:ring-1 focus:ring-[#4C2325] transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[48px] bg-[#4C2325] hover:bg-[#381a1b] text-white font-['Tajawal'] font-medium text-[14px] rounded-[8px] transition-colors cursor-pointer mt-2"
          >
            إرسال رابط التعيين
          </button>
        </form>

        <div className="w-full min-h-[57px] flex items-center justify-center text-[14px] text-[#4C2325] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 gap-1 mt-auto">
          <span>تذكرت كلمة المرور؟</span>
          <Link to="/login" className="text-[#4C2325] font-bold hover:underline">
            تسجيل دخول
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;