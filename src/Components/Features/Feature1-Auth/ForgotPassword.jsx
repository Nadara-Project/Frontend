import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../../Layouts/Header'; // 
import { auth } from '../../../services/api-client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await auth.forgotPassword(email); 
      navigate('/check-email');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.');
      } else {
        setError('تعرّض الاتصال للخلل، تأكد من البريد الإلكتروني.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir="rtl">
      {/* 1. الناف بار العام في أعلى الصفحة */}
      <MainHeader />

      {/* 2. محتوى النموذج في المنتصف */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] border w-full max-w-[446px] p-[24px] shadow-sm">
          
          {/* رأسية النموذج */}
          <div className="text-center mb-6">
            <h1 className="text-[24px] font-bold text-[#4C2325] font-[Tajawal]">استعادة كلمة المرور</h1>
            <p className="text-[14px] text-gray-500 font-[Tajawal] mt-1">أدخل بريدك لإرسال رابط التعيين</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="h-[53px] px-[16px] border rounded-[8px] focus:outline-none focus:border-[#4C2325]" 
            />
            
            {error && <span className="text-red-500 text-[12px]">{error}</span>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="h-[48px] bg-[#4C2325] text-white rounded-[8px] font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;