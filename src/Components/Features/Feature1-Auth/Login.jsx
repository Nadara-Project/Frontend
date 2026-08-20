import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import MainHeader from '../../../Layouts/Header'; // الناف بار العام للموقع
import Header from './Header'; // رأسية النموذج الداخلية
import { auth } from '../../../services/api-client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    setIsLoading(true);
    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error.status === 422) {
        setErrorMessage(error.fieldError('email') || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else {
        setErrorMessage(error.message || "حدث خطأ أثناء تسجيل الدخول.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir="rtl">
      
      {/* 1. الناف بار العام للموقع يظهر في الأعلى */}
      <MainHeader />

      {/* 2. محتوى صفحة تسجيل الدخول في المنتصف */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
          
          <Header 
            title="تسجيل الدخول" 
            subtitle="مرحباً بك مجدداً في نضارة للجلدية والتجميل" 
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] p-[24px]">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-[13px] text-center">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-1 text-right">
              <label className="text-[14px] font-medium text-[#2B2527]">البريد الالكتروني</label>
              <input 
                type="email" 
                dir="ltr"
                placeholder="example@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[53px] px-[16px] border border-[#9E9E9E] rounded-[8px] text-[14px] focus:outline-none focus:border-[#4C2325]"
              />
            </div>

            <div className="flex flex-col gap-1 text-right">
              <label className="text-[14px] font-medium text-[#2B2527]">كلمة المرور</label>
              <div className="relative flex items-center w-full">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[53px] px-[16px] pl-[45px] border border-[#9E9E9E] rounded-[8px] text-[14px] focus:outline-none focus:border-[#4C2325]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute left-[16px] text-[#9CA3AF]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[14px] text-[#2B2527]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#4C2325]"
                />
                تذكرني
              </label>
              <Link to="/forgot-password" className="hover:underline text-[#4C2325] font-medium">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-medium rounded-[8px] transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="w-full h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex items-center justify-center gap-1 text-center">
            <span className="text-[14px] text-[#4C2325]">ليس لديك حساب؟</span>
            <Link to="/register" className="font-bold text-[14px] text-[#4C2325] hover:underline mr-1">إنشاء حساب</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;