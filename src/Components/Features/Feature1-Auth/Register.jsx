import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MainHeader from '../../../Layouts/Header'; // الناف بار العام للموقع
import Header from './Header'; // رأسية النموذج الداخلية
import FormField from './FormField';
import { auth } from '../../../services/api-client';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('الاسم مطلوب')
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: yup
    .string()
    .trim()
    .required('البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  phone: yup
    .string()
    .trim()
    .required('رقم الهاتف مطلوب')
    .matches(/^[0-9+\s-]{9,15}$/, 'رقم الهاتف غير صحيح'),
  password: yup
    .string()
    .required('كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: yup
    .string()
    .required('تأكيد كلمة المرور مطلوب')
    .oneOf([yup.ref('password')], 'كلمتا المرور غير متطابقتين'),
});

// ربط أسماء حقول الخادم بأسماء حقول النموذج لعرض أخطاء 422 في مكانها الصحيح.
const serverFieldMap = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  password: 'password',
  password_confirmation: 'confirmPassword',
};

const Register = () => {
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    setFormError('');

    try {
      await auth.register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error.status === 422) {
        Object.entries(error.errors).forEach(([serverField, messages]) => {
          const field = serverFieldMap[serverField];
          if (field) setError(field, { type: 'server', message: messages[0] });
        });
        setFormError(error.message || 'يرجى مراجعة البيانات المدخلة.');
      } else {
        setFormError(error.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir="rtl">

      {/* 1. الناف بار العام للموقع يظهر في الأعلى */}
      <MainHeader />

      {/* 2. محتوى صفحة إنشاء الحساب في المنتصف */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] w-full max-w-[446px] shadow-sm flex flex-col overflow-hidden">

          <Header
            title="إنشاء حساب"
            subtitle="مرحباً بك في نضارة للجلدية والتجميل"
          />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[16px] p-[24px]">
            {formError && (
              <div
                role="alert"
                className="p-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-[13px] text-center"
              >
                {formError}
              </div>
            )}

            <FormField
              label="الاسم"
              placeholder="الاسم الكامل"
              autoComplete="name"
              field={register('name')}
              error={errors.name?.message}
            />

            <FormField
              label="البريد الالكتروني"
              type="email"
              dir="ltr"
              placeholder="example@gmail.com"
              autoComplete="email"
              field={register('email')}
              error={errors.email?.message}
            />

            <FormField
              label="رقم الهاتف"
              type="tel"
              dir="ltr"
              inputMode="tel"
              placeholder="0599123456"
              autoComplete="tel"
              field={register('phone')}
              error={errors.phone?.message}
            />

            <FormField
              label="كلمة المرور"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              hint="8 أحرف على الأقل"
              field={register('password')}
              error={errors.password?.message}
            />

            <FormField
              label="تأكيد كلمة المرور"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              field={register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] bg-[#4C2325] hover:bg-[#36181A] text-white font-medium rounded-[8px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="w-full h-[57px] py-[16px] px-[24px] bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex items-center justify-center gap-1 text-center">
            <span className="text-[14px] text-[#4C2325]">لديك حساب بالفعل؟</span>
            <Link to="/login" className="font-bold text-[14px] text-[#4C2325] hover:underline mr-1">
              تسجيل الدخول
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
