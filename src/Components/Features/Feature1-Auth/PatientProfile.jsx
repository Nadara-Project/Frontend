import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiCamera, FiLogOut, FiTrash2, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Alert, ErrorState, PageLoader, Spinner } from '../../Common/Feedback';
import Modal from '../../Common/Modal';
import { auth, profile } from '../../../services/api-client';
import { UPLOAD_LIMITS } from '../../../config/clinic';
import { todayInClinic } from '../../../utils/format';

const { image: IMAGE_RULES } = UPLOAD_LIMITS;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

const schema = yup.object({
  name: yup.string().trim().required('الاسم مطلوب').min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(255),
  phone: yup
    .string()
    .trim()
    .required('رقم الهاتف مطلوب')
    .matches(PHONE_PATTERN, 'رقم الهاتف غير صحيح'),
  birth_date: yup
    .string()
    .required('تاريخ الميلاد مطلوب')
    .test('past', 'تاريخ الميلاد يجب أن يكون قبل اليوم', (value) => !value || value < todayInClinic()),
  gender: yup.string().oneOf(['male', 'female'], 'الرجاء اختيار الجنس').required('الجنس مطلوب'),
});

const inputClass = (hasError) =>
  `h-[46px] w-full rounded-[12px] border bg-white px-[14px] text-[15px] text-[#212121] placeholder-[#A0AEC0] focus:outline-none ${
    hasError ? 'border-[#E53E3E]' : 'border-[#E2E8F0] focus:border-[#4C2325]'
  }`;

const Field = ({ id, label, error, children }) => (
  <div className="flex flex-col gap-[6px]">
    <label htmlFor={id} className="text-[13px] font-[600] text-[#4C2325] sm:text-[14px]">
      {label}
    </label>
    {children}
    {error && (
      <span role="alert" className="text-[12px] text-[#E53E3E]">
        {error}
      </span>
    )}
  </div>
);

/** الملف الشخصي للمريض (US-006): البيانات الأساسية والصورة وأمان الحساب. */
export default function PatientProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loadState, setLoadState] = useState({ loading: true, error: null, user: null });
  const [reloadToken, setReloadToken] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageBusy, setImageBusy] = useState('');
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', birth_date: '', gender: '' },
  });

  const fillForm = (user) =>
    reset({
      name: user.name ?? '',
      phone: user.phone ?? '',
      birth_date: user.birth_date ?? '',
      gender: user.gender ?? '',
    });

  useEffect(() => {
    let active = true;
    profile.get().then(
      (user) => {
        if (!active) return;
        setLoadState({ loading: false, error: null, user });
        fillForm(user);
      },
      (error) => active && setLoadState({ loading: false, error, user: null })
    );
    return () => {
      active = false;
    };
    // fillForm يعتمد على reset الثابت من react-hook-form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  const user = loadState.user;

  const onSubmit = async (values) => {
    setMessage({ type: '', text: '' });
    try {
      const updated = await profile.update({
        name: values.name.trim(),
        phone: values.phone.trim(),
        birth_date: values.birth_date,
        gender: values.gender,
      });
      setLoadState((state) => ({ ...state, user: updated }));
      fillForm(updated);
      setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح.' });
    } catch (error) {
      if (error.status === 422) {
        Object.keys(values).forEach((field) => {
          const fieldMessage = error.fieldError(field);
          if (fieldMessage) setError(field, { type: 'server', message: fieldMessage });
        });
      }
      setMessage({ type: 'error', text: error.status === 422 ? 'يرجى مراجعة الحقول المظللة.' : error.message });
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!IMAGE_RULES.types.includes(file.type)) {
      setMessage({ type: 'error', text: `صيغة الصورة غير مدعومة، الصيغ المسموحة: ${IMAGE_RULES.typesLabel}.` });
      return;
    }
    if (file.size > IMAGE_RULES.maxBytes) {
      setMessage({ type: 'error', text: `حجم الصورة أكبر من ${IMAGE_RULES.maxLabel}.` });
      return;
    }

    setImageBusy('upload');
    setMessage({ type: '', text: '' });
    try {
      const updated = await profile.uploadImage(file);
      setLoadState((state) => ({ ...state, user: { ...state.user, ...updated } }));
      setMessage({ type: 'success', text: 'تم تحديث الصورة الشخصية.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.fieldError?.('image') ?? error.message });
    } finally {
      setImageBusy('');
    }
  };

  const handleRemoveImage = async () => {
    setImageBusy('remove');
    setMessage({ type: '', text: '' });
    try {
      const updated = await profile.removeImage();
      setLoadState((state) => ({ ...state, user: { ...state.user, ...updated } }));
      setMessage({ type: 'success', text: 'تم حذف الصورة الشخصية.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setImageBusy('');
    }
  };

  const handleLogoutAll = async () => {
    setLoggingOutAll(true);
    try {
      await auth.logoutAll();
    } catch {
      // الجلسة المحلية تُمسح في كل الأحوال
    }
    navigate('/login', {
      replace: true,
      state: { notice: 'تم تسجيل الخروج من جميع الأجهزة. سجّل الدخول من جديد للمتابعة.' },
    });
  };

  if (loadState.loading) return <PageLoader label="جاري تحميل بياناتك..." />;
  if (loadState.error) {
    return (
      <ErrorState
        error={loadState.error}
        onRetry={() => {
          setLoadState({ loading: true, error: null, user: null });
          setReloadToken((token) => token + 1);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[16px] border border-[#E5E7EB] bg-white p-[20px] shadow-sm sm:rounded-[24px] sm:p-[32px]">
        <Alert type={message.type || 'info'} className="mb-[20px]">
          {message.text}
        </Alert>

        {/* الصورة */}
        <div className="mb-[28px] flex flex-col items-center justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept={IMAGE_RULES.accept}
            className="hidden"
          />

          <div className="relative h-[96px] w-[96px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#EEEEEE] shadow-sm">
              {user?.image_url ? (
                <img src={user.image_url} alt="الصورة الشخصية" className="h-full w-full object-cover" />
              ) : (
                <FiUser className="h-[44px] w-[44px] text-[#A0AEC0]" aria-hidden="true" />
              )}
              {imageBusy && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70 text-[#4C2325]">
                  <Spinner className="h-[24px] w-[24px]" />
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={Boolean(imageBusy)}
              aria-label="تغيير الصورة"
              title="تغيير الصورة"
              className="absolute bottom-0 left-0 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#4C2325] shadow-md transition-all hover:bg-[#F7FAFC] disabled:opacity-50"
            >
              <FiCamera className="h-[15px] w-[15px]" />
            </button>

            {user?.image_url && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={Boolean(imageBusy)}
                aria-label="حذف الصورة"
                title="حذف الصورة"
                className="absolute right-0 top-0 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#E53E3E] shadow-md transition-all hover:bg-[#FFF5F5] disabled:opacity-50"
              >
                <FiTrash2 className="h-[14px] w-[14px]" />
              </button>
            )}
          </div>
          <span className="mt-[10px] text-[12px] text-[#94A3B8]">
            {IMAGE_RULES.typesLabel} حتى {IMAGE_RULES.maxLabel}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 md:gap-[22px]">
            <Field id="profile-name" label="الاسم الكامل" error={errors.name?.message}>
              <input id="profile-name" autoComplete="name" {...register('name')} className={inputClass(errors.name)} />
            </Field>

            <Field id="profile-gender" label="الجنس" error={errors.gender?.message}>
              <select id="profile-gender" {...register('gender')} className={`${inputClass(errors.gender)} cursor-pointer`}>
                <option value="">اختر الجنس</option>
                <option value="female">أنثى</option>
                <option value="male">ذكر</option>
              </select>
            </Field>

            <Field id="profile-email" label="البريد الإلكتروني">
              <input
                id="profile-email"
                type="email"
                dir="ltr"
                value={user?.email ?? ''}
                disabled
                className="h-[46px] w-full cursor-not-allowed rounded-[12px] border border-[#EDF2F7] bg-[#F7FAFC] px-[14px] text-right text-[15px] text-[#718096]"
              />
            </Field>

            <Field id="profile-phone" label="رقم الجوال" error={errors.phone?.message}>
              <input
                id="profile-phone"
                type="tel"
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0599123456"
                {...register('phone')}
                className={`${inputClass(errors.phone)} text-right`}
              />
            </Field>

            <Field id="profile-birth-date" label="تاريخ الميلاد" error={errors.birth_date?.message}>
              <input
                id="profile-birth-date"
                type="date"
                max={todayInClinic()}
                {...register('birth_date')}
                className={inputClass(errors.birth_date)}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse items-stretch gap-[10px] pt-[8px] sm:flex-row sm:items-center sm:justify-start">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex h-[46px] cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#4C2325] px-[28px] text-[14px] font-[600] text-white shadow-sm transition-all hover:bg-[#381A1B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Spinner className="h-[16px] w-[16px]" />}
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            {isDirty && !isSubmitting && (
              <button
                type="button"
                onClick={() => fillForm(user)}
                className="h-[46px] cursor-pointer rounded-[12px] px-[18px] text-[14px] font-[600] text-[#6B5E5F] hover:bg-[#F4F2EE]"
              >
                تجاهل التعديلات
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-[12px] rounded-[16px] border border-[#E5E7EB] bg-white p-[20px] sm:flex-row sm:items-center sm:justify-between sm:p-[24px]">
        <div>
          <h2 className="text-[15px] font-[700] text-[#2B2527]">أمان الحساب</h2>
          <p className="text-[13px] text-[#6B5E5F]">إذا سجّلت الدخول من جهاز لا تملكه، سجّل الخروج من كل الأجهزة.</p>
        </div>
        <button
          type="button"
          onClick={() => setLogoutAllOpen(true)}
          className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border border-[#FECACA] px-[16px] text-[14px] font-[600] text-[#B91C1C] hover:bg-[#FEF2F2]"
        >
          <FiLogOut className="h-[15px] w-[15px]" aria-hidden="true" />
          الخروج من كل الأجهزة
        </button>
      </section>

      <Modal
        open={logoutAllOpen}
        onClose={() => setLogoutAllOpen(false)}
        dismissible={!loggingOutAll}
        title="الخروج من كل الأجهزة"
        footer={
          <>
            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={loggingOutAll}
              className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#B91C1C] px-[18px] text-[14px] font-[600] text-white hover:bg-[#991B1B] disabled:opacity-60"
            >
              {loggingOutAll && <Spinner className="h-[16px] w-[16px]" />}
              تأكيد الخروج
            </button>
            <button
              type="button"
              onClick={() => setLogoutAllOpen(false)}
              disabled={loggingOutAll}
              className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E2E8F0] px-[18px] text-[14px] font-[600] text-[#4C2325]"
            >
              تراجع
            </button>
          </>
        }
      >
        <p className="text-[14px] leading-[24px] text-[#4C2325]">
          سيتم إنهاء جلستك على كل الأجهزة بما فيها هذا الجهاز، وستحتاج لتسجيل الدخول من جديد.
        </p>
      </Modal>
    </div>
  );
}
