import React, { useState } from 'react';
import Header from './Header';
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      
      {/* الكارت الرئيسي */}
     <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
        
        {/* Header */}
       <Header 
  title="تسجيل الدخول" 
  subtitle="مرحباً بك مجدداً في نضارة للجلدية والتجميل" 
/>

       {/* Login form */}
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-[16px] pt-[16px] px-[24px] pb-[24px] w-full"
        >
          
          {/* حقل البريد الإلكتروني */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label className="text-[14px] font-medium text-[#4C2325]">البريد الالكتروني</label>
            <input
              type="email"
              dir="ltr"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[53px] pt-[15px] pb-[14px] px-[16px] border border-[#9E9E9E] rounded-[8px] bg-white text-[14px] text-[#4C2325] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4C2325] focus:ring-1 focus:ring-[#4C2325]"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label className="text-[14px] font-medium text-[#4C2325]">كلمة المرور</label>
            <div className="relative flex items-center w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[53px] pt-[15px] pb-[14px] px-[16px] pl-[45px] border border-[#9E9E9E] rounded-[8px] bg-white text-[14px] text-[#4C2325] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4C2325] focus:ring-1 focus:ring-[#4C2325]"
              />
              <div 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-[16px] text-[#9CA3AF] hover:text-[#4C2325] cursor-pointer transition-colors"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </div>
            </div>
          </div>

          {/* تذكرني & نسيت كلمة المرور */}
          <div className="flex items-center justify-between text-[14px] w-full text-[#4C2325]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#4C2325] focus:ring-[#4C2325]"
              />
              تذكرني
            </label>
           <Link to="/forgot-password" className="hover:underline text-[#4C2325]">
  نسيت كلمة المرور؟
</Link>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#4C2325] hover:bg-[#381a1b] text-white font-medium rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>تسجيل الدخول</span>
            <FiLogIn size={20} />
          </button>

        </form>
<div className="w-[446px] h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD33] flex items-center justify-center gap-1 font-tajawal text-center">
  <span className="font-normal text-[16px] leading-[24px] text-[#4C2325]">
    ليس لديك حساب؟
  </span>
  
  <Link 
    to="/register" 
    className="font-bold text-[14px] leading-[20px] tracking-[0.14px] text-[#4C2325] hover:underline"
  >
    سجل الآن
  </Link>
</div>
  

      </div>
    </div>
  );
};

export default Login;