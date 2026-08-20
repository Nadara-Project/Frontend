import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../Layouts/Header'; // الناف بار الرئيسي للموقع
import { auth } from '../../../services/api-client';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.register({
        name: formData.name, email: formData.email, phone: formData.phone,
        password: formData.password, password_confirmation: formData.confirmPassword
      });
      navigate('/dashboard');
    } catch (error) {
      if (error.status === 422) setErrors(error.errors);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir="rtl">
      {/* 1. الناف بار الرئيسي يظهر في أعلى الصفحة */}
      <Header />

      {/* 2. محتوى صفحة التسجيل (النموذج في المنتصف) */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] border w-full max-w-[446px] p-[24px] shadow-sm">
          
          {/* رأسية النموذج الداخلية */}
          <div className="text-center mb-6">
            <h1 className="text-[24px] font-bold text-[#4C2325] font-[Tajawal]">إنشاء حساب</h1>
            <p className="text-[14px] text-gray-500 font-[Tajawal] mt-1">مرحباً بك في نضارة</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              name="name" 
              placeholder="الاسم" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            {errors.name && <span className="text-red-500 text-[12px]">{errors.name[0]}</span>}
            
            <input 
              name="email" 
              type="email" 
              placeholder="البريد" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            
            <input 
              name="phone" 
              placeholder="الهاتف" 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            
            <input 
              name="password" 
              type="password" 
              placeholder="كلمة المرور" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="تأكيد كلمة المرور" 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            
            <button 
              type="submit" 
              className="h-[48px] bg-[#4C2325] text-white rounded-[8px] font-medium transition hover:opacity-90 mt-2"
            >
              إنشاء حساب
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;