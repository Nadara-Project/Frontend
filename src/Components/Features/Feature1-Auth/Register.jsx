import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';       
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

// قائمة الأدوار
const roles = [
  { key: 'patient', label: 'مريض' },
  { key: 'doctor', label: 'طبيب' },
  { key: 'admin', label: 'ادمن' }
];

// --- 1. شريط مبدل الأدوار (Role Switcher) ---
const RoleSwitcher = ({ activeRole, setActiveRole }) => (
  <div className="flex items-center gap-[4px] p-[4px] bg-[#4C2325]/10 rounded-[8px] w-full h-[44px]">
    {roles.map(role => (
      <button 
        key={role.key}
        type="button"
        onClick={() => setActiveRole(role.key)}
        className={`flex-1 text-center h-full rounded-[6px] text-[14px] font-medium transition-all cursor-pointer ${
          activeRole === role.key 
          ? 'bg-white text-[#4C2325] shadow-sm font-bold' 
          : 'text-[#4C2325]/70 hover:text-[#4C2325]'
        }`}
      >
        {role.label}
      </button>
    ))}
  </div>
);

// --- 2. كارت التنبيه الخاص بالطبيب والأدمن ---
const AuthAlert = ({ title, subtitle }) => (
  <div className="flex flex-col items-center max-w-[448px] w-full text-center px-[24px] pt-[32px] pb-[24px] mx-auto">
    <div className="w-[80px] h-[80px] bg-[#4C2325]/10 rounded-full flex items-center justify-center mb-[24px]">
      <FiAlertCircle className="w-[40px] h-[40px] text-[#4C2325]" />
    </div>

    <div className="flex flex-col items-center gap-[12px] w-full max-w-[320px] mb-[24px]">
      <h2 className="font-['Tajawal'] font-medium text-[20px] leading-[32px] text-[#2B2527] text-center">
        {title}
      </h2>
      <p className="font-['Tajawal'] font-normal text-[16px] leading-[24px] text-[#4C2325]/80 text-center">
        {subtitle}
      </p>
    </div>

    <Link 
      to="/login"
      className="bg-[#4C2325] text-white w-[176px] h-[52px] rounded-[6px] shadow-sm font-['Tajawal'] font-medium text-[16px] flex items-center justify-center hover:bg-[#36181A] transition-colors"
    >
      تسجيل الدخول
    </Link>
  </div>
);

// --- 3. مكون حقل الإدخال الموحد ---
const AuthInput = ({ label, name, icon: Icon, type = "text", error, onIconClick, ...props }) => (
  <div className="flex flex-col gap-[8px] w-full text-right">
    <label className="text-[14px] font-medium text-[#2B2527]">{label}</label>
    
    <div className="relative flex items-center w-full">
      <input 
        type={type} 
        name={name}
        {...props} 
        className={`w-full h-[53px] pt-[15px] pb-[14px] px-[16px] ${Icon ? 'pl-[45px]' : ''} border rounded-[8px] bg-white text-[14px] text-[#2B2527] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 transition-all ${
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
            : "border-[#9E9E9E] focus:border-[#4C2325] focus:ring-[#4C2325]"
        }`} 
      />
      {Icon && (
        <button
          type="button"
          onClick={onIconClick} 
          className="absolute left-[16px] text-[#9CA3AF] hover:text-[#4C2325] cursor-pointer transition-colors"
        >
          <Icon size={20} />
        </button>
      )}
    </div>
    
    {error && (
      <span className="text-red-500 text-[12px] font-normal">
        {error}
      </span>
    )}
  </div>
);

// --- 4. نموذج تسجيل المريض ---
const PatientForm = ({ 
  formData, 
  handleInputChange, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword,
  errors,
  setErrors
}) => {

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    // فحص رقم الهاتف عند الإرسال
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يتكون من 10 أرقام بالضبط";
    }

    // فحص كلمة المرور عند الإرسال
    if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    // فحص التطابق عند الإرسال
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("تم الإرسال بنجاح:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full">
      <AuthInput 
        name="name"
        label="الاسم كامل" 
        placeholder="مثال: محمد علي أحمد" 
        value={formData.name} 
        onChange={handleInputChange} 
        required 
      />

      <AuthInput 
        name="email"
        label="البريد الالكتروني" 
        placeholder="example@gmail.com" 
        type="email" 
        dir="ltr" 
        value={formData.email} 
        onChange={handleInputChange} 
        required 
      />

      {/* حقل رقم الهاتف مع شرط 10 أرقام */}
      <AuthInput 
        name="phone"
        label="رقم الهاتف" 
        placeholder="0591234567" 
        dir="ltr"
        maxLength={10}
        value={formData.phone} 
        onChange={handleInputChange} 
        error={errors.phone}
        required 
      />

      {/* حقل كلمة المرور */}
      <AuthInput 
        name="password"
        label="كلمة المرور" 
        type={showPassword ? "text" : "password"}
        placeholder="**********" 
        icon={showPassword ? FiEyeOff : FiEye} 
        value={formData.password} 
        onChange={handleInputChange} 
        onIconClick={() => setShowPassword(!showPassword)} 
        error={errors.password}
        required 
      />

      {/* حقل تأكيد كلمة المرور */}
      <AuthInput 
        name="confirmPassword"
        label="تأكيد كلمة المرور" 
        type={showConfirmPassword ? "text" : "password"} 
        placeholder="**********" 
        icon={showConfirmPassword ? FiEyeOff : FiEye} 
        value={formData.confirmPassword} 
        onChange={handleInputChange} 
        onIconClick={() => setShowConfirmPassword(!showConfirmPassword)} 
        error={errors.confirmPassword}
        required 
      />

      {/* خيار تذكرني + نسيت كلمة المرور */}
      <div className="flex items-center justify-between w-full text-[14px] text-[#2B2527]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input 
            type="checkbox" 
            name="rememberMe"
            checked={formData.rememberMe} 
            onChange={handleInputChange} 
            className="w-4 h-4 rounded border-gray-300 accent-[#4C2325] focus:ring-[#4C2325] cursor-pointer" 
          />
          <span>تذكرني</span>
        </label>

        <Link 
          to="/forgot-password" 
          className="text-[#4C2325] font-medium hover:underline transition-all"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      <button
        type="submit"
        className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-['Tajawal'] font-medium text-[14px] leading-[20px] tracking-[0.14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
      >
        <span>إنشاء حساب</span>
      </button>
    </form>
  );
};

// --- 5. المكون الرئيسي ---
const Register = () => {
  const [activeRole, setActiveRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      updatedValue = updatedValue.replace(/\D/g, ''); 
    }

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: updatedValue };

      if (name === 'phone') {
        if (updatedValue.length > 0 && updatedValue.length !== 10) {
          setErrors(prevErr => ({ ...prevErr, phone: "رقم الهاتف يجب أن يتكون من 10 أرقام" }));
        } else {
          setErrors(prevErr => ({ ...prevErr, phone: "" }));
        }
      }

      if (name === 'password') {
        if (updatedValue.length > 0 && updatedValue.length < 8) {
          setErrors(prevErr => ({ ...prevErr, password: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }));
        } else {
          setErrors(prevErr => ({ ...prevErr, password: "" }));
        }

        if (updatedForm.confirmPassword && updatedValue !== updatedForm.confirmPassword) {
          setErrors(prevErr => ({ ...prevErr, confirmPassword: "كلمة المرور غير متطابقة" }));
        } else {
          setErrors(prevErr => ({ ...prevErr, confirmPassword: "" }));
        }
      }

      if (name === 'confirmPassword') {
        if (updatedValue !== updatedForm.password) {
          setErrors(prevErr => ({ ...prevErr, confirmPassword: "كلمة المرور غير متطابقة" }));
        } else {
          setErrors(prevErr => ({ ...prevErr, confirmPassword: "" }));
        }
      }

      return updatedForm;
    });
  };

  const renderActiveContent = () => {
    switch (activeRole) {
      case 'doctor':
        return (
          <AuthAlert 
            title="حسابات الطبيب تنشئها إدارة العيادة" 
            subtitle="لا يمكن التسجيل الذاتي لهذا النوع من الحسابات حفاظاً على خصوصية بيانات المرضى، تواصل مع الإدارة للحصول على بيانات الدخول." 
          />
        );
      case 'admin':
        return (
          <AuthAlert 
            title="حسابات الأدمن تنشئها إدارة العيادة" 
            subtitle="لا يمكن التسجيل الذاتي لهذا النوع من الحسابات حفاظاً على خصوصية بيانات المرضى، تواصل مع الإدارة للحصول على بيانات الدخول." 
          />
        );
      default:
        return (
          <PatientForm 
            formData={formData}
            handleInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            errors={errors}
            setErrors={setErrors}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">
        
        <Header 
          title="إنشاء حساب" 
          subtitle="مرحباً بك في نضارة للجلدية والتجميل" 
        />

        <div className="flex flex-col items-center pt-[16px] px-[24px] pb-[24px] gap-[16px] w-full">
          <RoleSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />

          <div className="w-full">
            {renderActiveContent()}
          </div>
        </div>

        {/* الفوتر السفلي   */}
        <div className="w-full h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex items-center justify-center gap-1 font-tajawal text-center mt-auto">
          <span className="font-normal text-[14px] leading-[24px] text-[#4C2325]">
            لديك حساب؟
          </span>
          
          <Link 
            to="/login" 
            className="font-bold text-[14px] leading-[20px] tracking-[0.14px] text-[#4C2325] hover:underline mr-1"
          >
            تسجيل دخول
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;