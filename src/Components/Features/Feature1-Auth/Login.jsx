import React, { useState } from 'react';
import Header from './Header';
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // التحقق من البريد الإلكتروني
    if (!email.trim()) {
      setEmailError("يرجى إدخال البريد الإلكتروني");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("البريد الإلكتروني غير صحيح");
      isValid = false;
    } else {
      setEmailError("");
    }

    // التحقق من كلمة المرور
    if (!password) {
      setPasswordError("يرجى إدخال كلمة المرور");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

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
            <label className="text-[14px] font-medium text-[#2B2527]">البريد الالكتروني</label>
            <input
              type="email"
              dir="ltr"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                if (emailError) setEmailError("");
              }}
              className={`w-full h-[53px] pt-[15px] pb-[14px] px-[16px] border rounded-[8px] bg-white text-[14px] text-[#2B2527] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#9E9E9E] focus:border-[#4C2325] focus:ring-[#4C2325]"
              }`}
            />
            {emailError && (
              <span className="text-red-500 text-[12px] font-normal mt-0.5">
                {emailError}
              </span>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div className="flex flex-col gap-2 w-full text-right">
            <label className="text-[14px] font-medium text-[#2B2527]">كلمة المرور</label>
            <div className="relative flex items-center w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  
                  if (val.length === 0) {
                    setPasswordError("يرجى إدخال كلمة المرور");
                  } else if (val.length < 8) {
                    setPasswordError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
                  } else {
                    setPasswordError("");
                  }
                }}
                className={`w-full h-[53px] pt-[15px] pb-[14px] px-[16px] pl-[45px] border rounded-[8px] bg-white text-[14px] text-[#2B2527] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-[#9E9E9E] focus:border-[#4C2325] focus:ring-[#4C2325]"
                }`}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-[16px] text-[#9CA3AF] hover:text-[#4C2325] cursor-pointer transition-colors"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </div>
            </div>

            {passwordError && (
              <span className="text-red-500 text-[12px] font-normal mt-0.5">
                {passwordError}
              </span>
            )}
          </div>

          {/* تذكرني & نسيت كلمة المرور */}
          <div className="flex items-center justify-between text-[14px] w-full text-[#2B2527]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#4C2325] focus:ring-[#4C2325]"
              />
              تذكرني
            </label>
            <Link to="/forgot-password" className="hover:underline text-[#4C2325] font-medium">
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-medium rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
          >
            <span>تسجيل الدخول</span>
            <FiLogIn size={20} />
          </button>

        </form>

        {/* الفوتر السفلي */}
        <div className="w-full h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex items-center justify-center gap-1 font-tajawal text-center">
          <span className="font-normal text-[14px] leading-[24px] text-[#4C2325]">
            ليس لديك حساب؟
          </span>
          
          <Link 
            to="/register" 
            className="font-bold text-[14px] leading-[20px] tracking-[0.14px] text-[#4C2325] hover:underline mr-1"
          >
            إنشاء حساب
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;