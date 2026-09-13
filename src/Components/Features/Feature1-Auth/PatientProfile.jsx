import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiCamera, FiCalendar, FiChevronDown, FiTrash2 } from 'react-icons/fi';

const BASE_URL = 'https://nadara.apps.madafa.net/api/v1';

export default function PatientProfile() {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'أنثى',
    phone: '',
    email: '',
    birth_date: '',
    address: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // تحويل صيغة التاريخ إلى YYYY-MM-DD
  const formatDateToYMD = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    return dateString;
  };

  // 1. جلب بيانات المريض
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const userData = res.data.data?.user || res.data.user || res.data.data || res.data;

        let formattedGender = userData.gender || 'female';
        if (formattedGender === 'female') formattedGender = 'أنثى';
        if (formattedGender === 'male') formattedGender = 'ذكر';

        setFormData({
          name: userData.name || '',
          gender: formattedGender,
          phone: userData.phone || '',
          email: userData.email || '',
          birth_date: formatDateToYMD(userData.birth_date || userData.date_of_birth || ''),
          address: userData.address || ''
        });

        // اعتماد image_url القادم من الـ API مباشرة
        if (userData.image_url) {
          setAvatarPreview(userData.image_url);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          navigate('/login');
        } else {
          setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب البيانات' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // رفع الصورة (POST /profile/image)
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      const res = await axios.post(`${BASE_URL}/profile/image`, imageFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImageUrl = res.data?.data?.image_url || res.data?.image_url || res.data?.data?.user?.image_url;
      setAvatarPreview(newImageUrl || URL.createObjectURL(file));
      setMessage({ type: 'success', text: 'تم تحديث الصورة الشخصية بنجاح' });
    } catch {
      setMessage({ type: 'error', text: 'فشل رفع الصورة الشخصية' });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // حذف الصورة (DELETE /profile/image)
  const handleRemoveImage = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setDeletingImage(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.delete(`${BASE_URL}/profile/image`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      setAvatarPreview(null);
      
      const currentAuthUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      currentAuthUser.image_url = null;
      localStorage.setItem('auth_user', JSON.stringify(currentAuthUser));

      setMessage({ type: 'success', text: 'تم حذف الصورة الشخصية بنجاح' });
    } catch {
      setMessage({ type: 'error', text: 'فشل حذف الصورة الشخصية' });
    } finally {
      setDeletingImage(false);
    }
  };

  // 2. تحديث بيانات المريض
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('auth_token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/profile`,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          birth_date: formatDateToYMD(formData.birth_date),
          gender: formData.gender === 'أنثى' ? 'female' : 'male',
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const updatedUser = res.data?.data?.user || res.data?.user || res.data?.data || res.data;

      if (updatedUser) {
        const currentAuthUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const newAuthUser = { ...currentAuthUser, ...updatedUser };
        localStorage.setItem('auth_user', JSON.stringify(newAuthUser));

        let formattedGender = updatedUser.gender || 'female';
        if (formattedGender === 'female') formattedGender = 'أنثى';
        if (formattedGender === 'male') formattedGender = 'ذكر';

        setFormData(prev => ({
          ...prev,
          name: updatedUser.name || prev.name,
          phone: updatedUser.phone || prev.phone,
          address: updatedUser.address || prev.address,
          birth_date: formatDateToYMD(updatedUser.birth_date || prev.birth_date),
          gender: formattedGender,
        }));
      }

      setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
    } catch (err) {
      if (err.response?.status === 422) {
        const errorsObj = err.response.data?.errors;
        let errorMessage = err.response.data?.message || 'البيانات المدخلة غير صالحة';

        if (errorsObj && typeof errorsObj === 'object') {
          const firstErrorArray = Object.values(errorsObj)[0];
          if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
            errorMessage = firstErrorArray[0];
          }
        }

        setMessage({ type: 'error', text: errorMessage });
      } else if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
      } else {
        setMessage({ type: 'error', text: 'فشل حفظ التغييرات، حاول مرة أخرى.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D5C7AD1A] text-[#4C2325] font-['Tajawal'] text-[16px] px-[16px]">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D5C7AD1A] font-['Tajawal'] text-right" dir="rtl">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-[#E5E7EB] h-[64px] md:h-[72px] px-[16px] sm:px-[24px] md:px-[64px] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-[12px]">
          <img src="/Logo.svg" alt="NADARA" className="h-[28px] sm:h-[32px] md:h-[36px] w-auto" />
        </div>

        <nav className="hidden lg:flex items-center gap-[24px] xl:gap-[32px] text-[#4A5568] text-[15px] xl:text-[16px] font-[400]">
          <a href="#" className="hover:text-[#4C2325] transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-[#4C2325] transition-colors">خدماتنا</a>
          <Link 
            to="/book-appointment" 
            className="flex items-center gap-[6px] hover:text-[#4C2325] transition-colors cursor-pointer"
          >
            <span>حجوزاتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </Link>
          <a href="#" className="flex items-center gap-[6px] hover:text-[#4C2325] transition-colors">
            <span>استشاراتي</span>
            <span className="w-[18px] h-[18px] rounded-full bg-[#E5D7D8] text-[#4C2325] text-[10px] font-bold flex items-center justify-center">1</span>
          </a>
        </nav>

        <div className="flex items-center gap-[8px] cursor-pointer">
          <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#EEEEEE] flex items-center justify-center text-[#718096] overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="User" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#4C2325]" />
            )}
          </div>
          <span className="text-[13px] sm:text-[14px] text-[#212121] font-[500] truncate max-w-[100px] sm:max-w-[150px]">
            {formData.name || 'المريض'}
          </span>
          <FiChevronDown className="w-[16px] h-[16px] text-[#718096]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[900px] mx-auto pt-[24px] sm:pt-[32px] md:pt-[40px] pb-[40px] sm:pb-[60px] px-[16px] sm:px-[24px] flex flex-col gap-[16px] sm:gap-[24px]">
        
        <div className="w-full text-right">
          <span className="text-[12px] font-[400] text-[#4C2325] block leading-[16px] mb-[4px]">
            لوحة المريض
          </span>
          <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-[700] text-[#4C2325] leading-[32px] sm:leading-[36px] md:leading-[40px] tracking-[-0.64px]">
            ملفي الشخصي
          </h1>
        </div>

        <div className="w-full bg-white rounded-[16px] sm:rounded-[24px] border border-[#E5E7EB] shadow-sm p-[20px] sm:p-[32px] md:p-[40px]">
          
          {message.text && (
            <div className={`mb-[20px] sm:mb-[24px] p-[10px] sm:p-[12px] rounded-[10px] text-center text-[13px] sm:text-[14px] ${
              message.type === 'error' ? 'bg-[#FFF5F5] text-[#E53E3E] border border-[#FEB2B2]' : 'bg-[#F0FFF4] text-[#38A169] border border-[#9AE6B4]'
            }`}>
              {message.text}
            </div>
          )}

          {/* Avatar Section */}
          <div className="w-full flex flex-col items-center justify-center mb-[24px] sm:mb-[32px]">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="relative w-[88px] h-[88px] sm:w-[96px] sm:h-[96px]">
              <div className="w-full h-full rounded-full bg-[#EEEEEE] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] text-[#A0AEC0]" />
                )}
              </div>
              
              {/* زر التغيير - أسفل اليسار */}
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                disabled={uploadingImage || deletingImage}
                className="absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] w-[28px] h-[28px] bg-white border border-[#E2E8F0] rounded-full shadow-md flex items-center justify-center text-[#4C2325] hover:bg-[#F7FAFC] transition-all cursor-pointer disabled:opacity-50"
                title="تغيير الصورة"
              >
                <FiCamera className="w-[14px] h-[14px] text-[#4C2325]" />
              </button>

              {/* زر الحذف - أعلى اليمين (يظهر فقط عند وجود صورة) */}
              {avatarPreview && (
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  disabled={uploadingImage || deletingImage}
                  className="absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] w-[28px] h-[28px] bg-white border border-[#E2E8F0] rounded-full shadow-md flex items-center justify-center text-[#E53E3E] hover:bg-[#FFF5F5] transition-all cursor-pointer disabled:opacity-50"
                  title="حذف الصورة"
                >
                  <FiTrash2 className="w-[13px] h-[13px] text-[#E53E3E]" />
                </button>
              )}
            </div>

            {(uploadingImage || deletingImage) && (
              <span className="text-[12px] text-[#718096] mt-[8px]">
                {uploadingImage ? 'جاري رفع الصورة...' : 'جاري الحذف...'}
              </span>
            )}
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="space-y-[20px] sm:space-y-[24px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[24px]">
              
              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="سارة أحمد"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] sm:text-[16px] font-[400] text-[#212121] placeholder-[#A0AEC0] focus:outline-none focus:border-[#4C2325]"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  الجنس
                </label>
                <div className="relative w-full">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] sm:text-[16px] font-[400] text-[#212121] focus:outline-none focus:border-[#4C2325] appearance-none cursor-pointer"
                  >
                    <option value="أنثى">أنثى</option>
                    <option value="ذكر">ذكر</option>
                  </select>
                  <FiChevronDown className="absolute left-[14px] sm:left-[16px] top-[14px] sm:top-[16px] w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#A0AEC0] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] rounded-[10px] sm:rounded-[12px] border border-[#EDF2F7] bg-[#F7FAFC] text-[14px] sm:text-[16px] font-[400] text-[#718096] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  رقم الجوال
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="0599123456"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] sm:text-[16px] font-[400] text-[#212121] placeholder-[#A0AEC0] focus:outline-none focus:border-[#4C2325]"
                />
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  تاريخ الميلاد
                </label>
                <div className="relative w-full">
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] pl-[36px] sm:pl-[40px] rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] sm:text-[16px] font-[400] text-[#212121] focus:outline-none focus:border-[#4C2325]"
                  />
                  <FiCalendar className="absolute left-[14px] sm:left-[16px] top-[14px] sm:top-[16px] w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#A0AEC0] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] sm:text-[14px] font-[600] text-[#4C2325] mb-[6px] sm:mb-[8px] leading-[20px]">
                  العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="غزة - الرمال - شارع عمر المختار"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-[44px] sm:h-[48px] px-[14px] sm:px-[16px] rounded-[10px] sm:rounded-[12px] border border-[#E2E8F0] bg-white text-[14px] sm:text-[16px] font-[400] text-[#212121] placeholder-[#A0AEC0] focus:outline-none focus:border-[#4C2325]"
                />
              </div>

            </div>

            <div className="pt-[12px] sm:pt-[16px] flex justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-[171.63px] h-[44px] sm:h-[48px] bg-[#4C2325] hover:bg-[#381A1B] text-white rounded-[10px] sm:rounded-[12px] text-[13px] sm:text-[14px] font-[600] transition-all duration-200 disabled:opacity-50 shadow-sm flex items-center justify-center cursor-pointer"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}