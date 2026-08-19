import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { auth } from '../../../services/api-client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await auth.forgotPassword(email);
    navigate('/check-email');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[16px] border w-full max-w-[446px] p-[24px]">
        <Header title="استعادة كلمة المرور" subtitle="أدخل بريدك لإرسال رابط التعيين" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} className="h-[53px] px-[16px] border rounded-[8px]" />
          <button type="submit" className="h-[48px] bg-[#4C2325] text-white rounded-[8px]">إرسال</button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;