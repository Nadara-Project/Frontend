import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[16px] border w-full max-w-[446px] p-[24px]">
        <Header title="إنشاء حساب" subtitle="مرحباً بك في نضارة" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" placeholder="الاسم" onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-[53px] px-[16px] border rounded-[8px]" />
          {errors.name && <span className="text-red-500 text-[12px]">{errors.name[0]}</span>}
          <input name="email" type="email" placeholder="البريد" onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-[53px] px-[16px] border rounded-[8px]" />
          <input name="phone" placeholder="الهاتف" onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-[53px] px-[16px] border rounded-[8px]" />
          <input name="password" type="password" placeholder="كلمة المرور" onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-[53px] px-[16px] border rounded-[8px]" />
          <input name="confirmPassword" type="password" placeholder="تأكيد كلمة المرور" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="h-[53px] px-[16px] border rounded-[8px]" />
          <button type="submit" className="h-[48px] bg-[#4C2325] text-white rounded-[8px]">إنشاء حساب</button>
        </form>
      </div>
    </div>
  );
};
export default Register;