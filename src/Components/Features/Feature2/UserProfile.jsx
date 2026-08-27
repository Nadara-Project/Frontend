import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMessageSquare, FiFolder, FiUser, FiLogOut } from 'react-icons/fi';
import { auth } from '../../../services/api-client'; // استدعي دالة جلب وحفظ الملف الشخصي حسب هيكلة مشروعك

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: 'غزة - الرمال', // قيمة افتراضية لعدم وجودها بالـ API
    birthDate: '1996/04/12' // قيمة افتراضية لعدم وجودها بالـ API
  });

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // جلب البيانات من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // افتراض وجود دالة في الـ api-client لجلب البروفايل، مثلا: auth.getProfile()
        // أو استخدام fetch مع الـ Token المخزن في الـ localStorage
        const token = localStorage.getItem('token');
        const response = await fetch('https://nadara.apps.madafa.net/api/v1/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const result = await response.json();
        
        if (response.ok && result.data) {
          setFormData((prev) => ({
            ...prev,
            name: result.data.name || '',
            phone: result.data.phone || '',
            email: result.data.email || '',
          }));
        }
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      // إرسال البيانات المحدثة للباك إند (تأكدي من الرابط وطريقة الـ Method إذا كانت PUT أو POST حسب البوستمان لديكِ)
      const response = await fetch('https://nadara.apps.madafa.net/api/v1/profile', {
        method: 'PUT', // أو POST حسب الـ API لديكِ
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ text: 'تم حفظ التغييرات بنجاح!', type: 'success' });
      } else {
        setMessage({ text: result.message || 'حدث خطأ أثناء الحفظ.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'تعذر الاتصال بالسيرفر.', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <p className="text-[#4C2325] font-medium">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-row-reverse" dir="rtl">
      
      {/* 1. المحتوى الرئيسي (يسار الشاشة) */}
      <div className="flex-1 p-8 flex flex-col items-center">
        
        {/* عنوان الصفحة */}
        <div className="w-full max-w-4xl mb-6 text-right">
          <h1 className="text-[26px] font-bold text-[#4C2325]">ملفي الشخصي</h1>
        </div>

        {/* صندوق النموذج */}
        <div className="bg-white rounded-[24px] border border-[#E5E7EB] w-full max-w-4xl p-8 shadow-sm">
          
          {message.text && (
            <div className={`mb-6 p-3 rounded-[12px] text-[14px] text-center ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* الصف الأول: الاسم الكامل ورقم الجوال */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#2B2527]">الاسم الكامل</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-[53px] px-[16px] border border-[#E2E8F0] rounded-[12px] text-[14px] focus:outline-none focus:border-[#4C2325] bg-white" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#2B2527]">رقم الجوال</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="ltr"
                  className="h-[53px] px-[16px] border border-[#E2E8F0] rounded-[12px] text-[14px] text-right focus:outline-none focus:border-[#4C2325] bg-white" 
                />
              </div>
            </div>

            {/* الصف الثاني: البريد الإلكتروني والعنوان */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#2B2527]">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  dir="ltr"
                  className="h-[53px] px-[16px] border border-[#E2E8F0] rounded-[12px] text-[14px] text-right focus:outline-none focus:border-[#4C2325] bg-white" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#2B2527]">العنوان</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="h-[53px] px-[16px] border border-[#E2E8F0] rounded-[12px] text-[14px] focus:outline-none focus:border-[#4C2325] bg-white" 
                />
              </div>
            </div>

            {/* الصف الثالث: تاريخ الميلاد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#2B2527]">تاريخ الميلاد</label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full h-[53px] px-[16px] border border-[#E2E8F0] rounded-[12px] text-[14px] focus:outline-none focus:border-[#4C2325] bg-white" 
                  />
                  <FiCalendar className="absolute left-4 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            {/* زر حفظ التغييرات */}
            <div className="flex justify-start mt-4">
              <button 
                type="submit" 
                className="w-[180px] h-[48px] bg-[#4C2325] text-white rounded-[12px] font-medium hover:bg-[#36181A] transition cursor-pointer"
              >
                حفظ التغييرات
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* 2. القائمة الجانبية (Sidebar - يمين الشاشة) */}
      <div className="w-[280px] bg-white border-l border-[#E2E8F0] flex flex-col justify-between p-6 min-h-screen">
        
        <div>
          {/* رأس القائمة (لوحة المريض + اسم المستخدم) */}
          <div className="text-right mb-8">
            <h2 className="text-[16px] font-bold text-[#2B2527]">لوحة المريض</h2>
            <p className="text-[13px] text-gray-500 mt-1">{formData.name || 'سارة أحمد'}</p>
          </div>

          {/* روابط التنقل */}
          <nav className="flex flex-col gap-2">
            <Link 
              to="/appointments" 
              className="flex items-center justify-between px-4 py-3 rounded-[10px] text-gray-600 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <FiCalendar size={18} />
                <span className="text-[14px] font-medium">مواعيدي</span>
              </div>
              <span className="w-5 h-5 bg-[#E2D9CC] text-[#4C2325] text-[11px] font-bold rounded-full flex items-center justify-center">2</span>
            </Link>

            <Link 
              to="/consultations" 
              className="flex items-center justify-between px-4 py-3 rounded-[10px] text-gray-600 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <FiMessageSquare size={18} />
                <span className="text-[14px] font-medium">استشاراتي</span>
              </div>
              <span className="w-5 h-5 bg-[#E2D9CC] text-[#4C2325] text-[11px] font-bold rounded-full flex items-center justify-center">1</span>
            </Link>

            <Link 
              to="/medical-record" 
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-gray-600 hover:bg-gray-50 transition"
            >
              <FiFolder size={18} />
              <span className="text-[14px] font-medium">سجلي الطبي</span>
            </Link>

            {/* العنصر النشط (Active - ملفي الشخصي) */}
            <Link 
              to="/profile" 
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-[#4C2325] text-white transition"
            >
              <FiUser size={18} />
              <span className="text-[14px] font-medium">ملفي الشخصي</span>
            </Link>
          </nav>
        </div>

        {/* زر تسجيل الخروج في الأسفل */}
        <div className="border-t border-gray-100 pt-4">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }} 
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-[10px] transition cursor-pointer"
          >
            <FiLogOut size={18} />
            <span className="text-[14px] font-medium">تسجيل الخروج</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default UserProfile;