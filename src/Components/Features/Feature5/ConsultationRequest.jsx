import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiLock, FiUser, FiX } from 'react-icons/fi';
import { LuImagePlus } from 'react-icons/lu';
import Header from '../../../Layouts/Header';
import { Alert, EmptyState, ErrorState, Skeleton, Spinner } from '../../Common/Feedback';
import { useAsync } from '../../../hooks/useAsync';
import { consultations, doctors } from '../../../services/api-client';
import { BOOKING_RULES, UPLOAD_LIMITS } from '../../../config/clinic';
import { formatPrice, initials } from '../../../utils/format';

const { image: IMAGE_RULES, consultationPhotos: MAX_IMAGES } = UPLOAD_LIMITS;
const { minSymptomsLength: MIN_SYMPTOMS, maxSymptomsLength: MAX_SYMPTOMS } = BOOKING_RULES;

const fieldBorder = (hasError) => (hasError ? 'border-[#E53E3E]' : 'border-[#E2E8F0] focus:border-[#4C2325]');

/**
 * طلب استشارة جلدية عن بعد (تصميم فيجما "استشارة-1").
 * المريض يختار الطبيب والخدمة، يصف حالته ويرفق صوراً، ثم ينتقل لرفع إيصال الدفع.
 * الطبيب لا يقرأ الأعراض قبل أن يتحقق الطاقم من الدفع.
 */
export default function ConsultationRequest() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState([]); // [{ id, file, url }]
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const doctorsQuery = useAsync((signal) => doctors.list({ onlineConsultations: true, signal }), []);
  const onlineDoctors = useMemo(
    () => (doctorsQuery.data?.data ?? []).filter((doctor) => doctor.services?.length),
    [doctorsQuery.data]
  );
  const selectedDoctor = onlineDoctors.find((doctor) => doctor.id === doctorId) ?? null;
  const selectedService = selectedDoctor?.services.find((service) => service.id === serviceId) ?? null;

  // اختيار تلقائي عندما يوجد خيار واحد فقط، لتوفير نقرة بلا معنى
  useEffect(() => {
    if (!doctorId && onlineDoctors.length === 1) setDoctorId(onlineDoctors[0].id);
  }, [doctorId, onlineDoctors]);

  useEffect(() => {
    if (selectedDoctor && !serviceId && selectedDoctor.services.length === 1) {
      setServiceId(selectedDoctor.services[0].id);
    }
  }, [selectedDoctor, serviceId]);

  // روابط معاينة الصور تُحرَّر من الذاكرة عند مغادرة الصفحة
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url)), []);

  const clearError = (key) => setErrors((prev) => ({ ...prev, [key]: '', form: '' }));

  const addImages = (fileList) => {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;

    const accepted = [];
    let imageError = '';

    for (const file of files) {
      if (images.length + accepted.length >= MAX_IMAGES) {
        imageError = `يمكنك إرفاق ${MAX_IMAGES} صور كحد أقصى.`;
        break;
      }
      if (!IMAGE_RULES.types.includes(file.type)) {
        imageError = `صيغة الصورة "${file.name}" غير مدعومة، الصيغ المسموحة: ${IMAGE_RULES.typesLabel}.`;
        continue;
      }
      if (file.size > IMAGE_RULES.maxBytes) {
        imageError = `حجم الصورة "${file.name}" أكبر من ${IMAGE_RULES.maxLabel}.`;
        continue;
      }
      accepted.push({ id: crypto.randomUUID?.() ?? `${file.name}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) });
    }

    setImages((prev) => [...prev, ...accepted]);
    setErrors((prev) => ({ ...prev, photos: imageError }));
  };

  const removeImage = (id) => {
    const target = images.find((image) => image.id === id);
    if (target) URL.revokeObjectURL(target.url);
    setImages((prev) => prev.filter((image) => image.id !== id));
    clearError('photos');
  };

  const chooseDoctor = (id) => {
    setDoctorId(id);
    setServiceId(null);
    clearError('doctor_id');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!selectedDoctor) nextErrors.doctor_id = 'يرجى اختيار الطبيب.';
    if (!selectedService) nextErrors.service_id = 'يرجى اختيار نوع الاستشارة.';
    if (symptoms.trim().length < MIN_SYMPTOMS) {
      nextErrors.symptoms = `يرجى كتابة وصف لا يقل عن ${MIN_SYMPTOMS} حرفاً.`;
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const consultation = await consultations.create({
        doctorId: selectedDoctor.id,
        serviceId: selectedService.id,
        symptoms,
        photos: images.map((image) => image.file),
      });
      navigate(`/consultations/${consultation.id}/payment`, { replace: true });
    } catch (error) {
      const photoError = Object.entries(error.errors ?? {}).find(([field]) => field.startsWith('photos'))?.[1]?.[0];
      setErrors({
        doctor_id: error.fieldError?.('doctor_id') ?? '',
        service_id: error.fieldError?.('service_id') ?? '',
        symptoms: error.fieldError?.('symptoms') ?? '',
        photos: photoError ?? '',
        form: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const symptomsLength = symptoms.trim().length;
  const hasFieldError = ['doctor_id', 'service_id', 'symptoms', 'photos'].some((key) => errors[key]);

  const renderDoctors = () => {
    if (doctorsQuery.loading && !doctorsQuery.data) {
      return (
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
          <Skeleton className="h-[64px]" />
          <Skeleton className="h-[64px]" />
        </div>
      );
    }
    if (doctorsQuery.error) return <ErrorState error={doctorsQuery.error} onRetry={doctorsQuery.reload} />;
    if (!onlineDoctors.length) {
      return (
        <EmptyState
          icon={FiUser}
          title="لا يوجد أطباء متاحون للاستشارة عن بعد حالياً"
          description="يمكنك حجز موعد في العيادة بدلاً من ذلك."
        />
      );
    }

    return (
      <div role="radiogroup" aria-label="الطبيب" className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
        {onlineDoctors.map((doctor) => {
          const active = doctor.id === doctorId;
          return (
            <button
              key={doctor.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => chooseDoctor(doctor.id)}
              className={`flex cursor-pointer items-center gap-[12px] rounded-[12px] border p-[12px] text-right transition-all ${
                active ? 'border-[#4C2325] bg-[#FDFBF7] ring-1 ring-[#4C2325]' : 'border-[#E2E8F0] hover:border-[#CBD5E0]'
              }`}
            >
              {doctor.image_url ? (
                <img src={doctor.image_url} alt="" className="h-[42px] w-[42px] shrink-0 rounded-full object-cover" />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#4C2325] text-[13px] font-[600] text-white"
                >
                  {initials(doctor.name)}
                </span>
              )}
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-[700] text-[#212121]">{doctor.name}</span>
                {doctor.specialty && <span className="truncate text-[12px] text-[#718096]">{doctor.specialty}</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-right font-['Tajawal']" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-[1100px] px-[16px] pb-[60px] pt-[24px] sm:px-[24px] sm:pt-[40px]">
        <div className="mb-[24px] flex flex-wrap items-center justify-between gap-[12px] sm:mb-[28px]">
          <h1 className="text-[26px] font-[700] leading-[40px] text-[#4C2325] sm:text-[32px]">استشارة جلدية</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-[6px] text-[14px] font-[600] text-[#4C2325] transition-opacity hover:opacity-80"
          >
            <span>رجوع</span>
            <FiArrowLeft className="h-[16px] w-[16px]" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 items-start gap-[20px] lg:grid-cols-12 lg:gap-[24px]">
          <section className="flex flex-col gap-[24px] rounded-[16px] bg-white p-[20px] sm:p-[28px] lg:col-span-8">
            <h2 className="border-b border-[#EEEEEE] pb-[16px] text-[18px] font-[500] text-[#2B2527]">تفاصيل الحالة</h2>

            {/* الطبيب */}
            <fieldset>
              <legend className="mb-[10px] block text-[13px] font-[600] text-[#2B2527]">
                الطبيب المعالج<span className="text-[#E53E3E]">*</span>
              </legend>
              {renderDoctors()}
              {errors.doctor_id && (
                <p role="alert" className="mt-[6px] text-[12px] text-[#E53E3E]">
                  {errors.doctor_id}
                </p>
              )}
            </fieldset>

            {/* نوع الاستشارة = خدمة يقدّمها الطبيب بسعره */}
            {selectedDoctor && (
              <fieldset>
                <legend className="mb-[10px] block text-[13px] font-[600] text-[#2B2527]">
                  نوع الاستشارة<span className="text-[#E53E3E]">*</span>
                </legend>
                <div role="radiogroup" aria-label="نوع الاستشارة" className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                  {selectedDoctor.services.map((service) => {
                    const active = service.id === serviceId;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setServiceId(service.id);
                          clearError('service_id');
                        }}
                        className={`flex cursor-pointer items-center justify-between gap-[10px] rounded-[12px] border p-[12px] text-right transition-all ${
                          active ? 'border-[#4C2325] bg-[#FDFBF7] ring-1 ring-[#4C2325]' : 'border-[#E2E8F0] hover:border-[#CBD5E0]'
                        }`}
                      >
                        <span className="text-[14px] font-[600] text-[#212121]">{service.name}</span>
                        <span className="shrink-0 text-[13px] font-[700] text-[#4C2325]">{formatPrice(service.price)}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.service_id && (
                  <p role="alert" className="mt-[6px] text-[12px] text-[#E53E3E]">
                    {errors.service_id}
                  </p>
                )}
              </fieldset>
            )}

            {/* وصف الحالة */}
            <div>
              <label htmlFor="consultation-symptoms" className="mb-[8px] block text-[13px] font-[600] text-[#2B2527]">
                وصف الحالة التفصيلي<span className="text-[#E53E3E]">*</span>
              </label>
              <textarea
                id="consultation-symptoms"
                rows={5}
                maxLength={MAX_SYMPTOMS}
                value={symptoms}
                onChange={(event) => {
                  setSymptoms(event.target.value);
                  clearError('symptoms');
                }}
                aria-invalid={Boolean(errors.symptoms)}
                aria-describedby="consultation-symptoms-hint"
                placeholder="يرجى وصف الأعراض، متى بدأت، وأي علاجات سابقة استخدمتها..."
                className={`w-full resize-y rounded-[10px] border bg-white p-[14px] text-[14px] leading-[24px] text-[#212121] placeholder-[#A0AEC0] focus:outline-none ${fieldBorder(errors.symptoms)}`}
              />
              <div id="consultation-symptoms-hint" className="mt-[6px] flex items-start justify-between gap-[12px] text-[12px]">
                {errors.symptoms ? (
                  <p role="alert" className="text-[#E53E3E]">
                    {errors.symptoms}
                  </p>
                ) : (
                  <p className="text-[#A0AEC0]">كلما كان الوصف دقيقاً، كان التشخيص أفضل.</p>
                )}
                <span
                  dir="ltr"
                  className={`shrink-0 ${symptomsLength < MIN_SYMPTOMS ? 'text-[#A0AEC0]' : 'text-[#2F855A]'}`}
                >
                  {symptomsLength}/{MIN_SYMPTOMS}+
                </span>
              </div>
            </div>

            {/* الصور */}
            <div>
              <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[8px]">
                <span className="text-[13px] font-[600] text-[#2B2527]">إرفاق صور للحالة (اختياري ولكن مفضّل)</span>
                <span className="rounded-full bg-[#EFE7DC] px-[10px] py-[3px] text-[11px] font-[500] text-[#6B5E5F]">
                  {images.length}/{MAX_IMAGES} صور
                </span>
              </div>

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    addImages(event.dataTransfer.files);
                  }}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[14px] border-2 border-dashed px-[16px] py-[28px] text-center transition-colors ${
                    isDragging ? 'border-[#4C2325] bg-[#FDFBF7]' : 'border-[#CBD5E1] hover:bg-[#FAFAF9]'
                  }`}
                >
                  <LuImagePlus className="h-[28px] w-[28px] text-[#4C2325]" aria-hidden="true" />
                  <span className="text-[13px] font-[600] text-[#2B2527]">اضغط هنا لرفع الصور أو قم بسحبها وإفلاتها</span>
                  <span className="text-[11px] text-[#94A3B8]">
                    صيغ مدعومة: {IMAGE_RULES.typesLabel}. الحد الأقصى للحجم: {IMAGE_RULES.maxLabel} لكل صورة.
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={IMAGE_RULES.accept}
                multiple
                onChange={(event) => {
                  addImages(event.target.files);
                  event.target.value = '';
                }}
                className="hidden"
              />

              {errors.photos && (
                <p role="alert" className="mt-[8px] text-[12px] text-[#E53E3E]">
                  {errors.photos}
                </p>
              )}

              {images.length > 0 && (
                <ul className="mt-[12px] grid grid-cols-3 gap-[10px] sm:grid-cols-5">
                  {images.map((image) => (
                    <li
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC]"
                    >
                      <img src={image.url} alt={image.file.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        disabled={submitting}
                        aria-label={`حذف الصورة ${image.file.name}`}
                        className="absolute left-[4px] top-[4px] flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#E53E3E] shadow-sm"
                      >
                        <FiX className="h-[14px] w-[14px]" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-[10px] flex items-center gap-[6px] text-[12px] text-[#94A3B8]">
                <FiLock className="h-[12px] w-[12px] shrink-0" aria-hidden="true" />
                الصور محفوظة بشكل خاص ولا يطّلع عليها إلا طبيبك.
              </p>
            </div>
          </section>

          {/* الشريط الجانبي */}
          <aside className="flex flex-col gap-[16px] lg:sticky lg:top-[96px] lg:col-span-4">
            <div className="flex items-start gap-[12px] rounded-[16px] border-t-[4px] border-[#D5C7AD] bg-white p-[20px]">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#EFE7DC] text-[#4C2325]">
                <FiClock className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-[4px] text-[15px] font-[700] text-[#2B2527]">الرد خلال 24 ساعة</h3>
                <p className="text-[13px] leading-[22px] text-[#6B5E5F]">
                  بعد تأكيد الدفع، يراجع الطبيب حالتك ويرسل لك الرد وخطة العلاج داخل حسابك.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] bg-white p-[20px]">
              <h3 className="mb-[14px] border-b border-[#EEEEEE] pb-[12px] text-[15px] font-[700] text-[#2B2527]">ملخص الطلب</h3>
              <dl className="mb-[16px] flex flex-col gap-[10px] text-[13px]">
                <div className="flex justify-between gap-[12px]">
                  <dt className="text-[#6B5E5F]">الطبيب</dt>
                  <dd className="text-left font-[600] text-[#2B2527]">{selectedDoctor?.name ?? '—'}</dd>
                </div>
                <div className="flex justify-between gap-[12px]">
                  <dt className="text-[#6B5E5F]">نوع الاستشارة</dt>
                  <dd className="text-left font-[600] text-[#2B2527]">{selectedService?.name ?? '—'}</dd>
                </div>
              </dl>
              <div className="mb-[20px] flex items-center justify-between">
                <span className="text-[14px] text-[#6B5E5F]">رسوم الاستشارة</span>
                <span className="text-[22px] font-[700] text-[#2B2527]">
                  {selectedService ? formatPrice(selectedService.price) : '—'}
                </span>
              </div>

              {errors.form && !hasFieldError && (
                <Alert className="mb-[12px]">{errors.form}</Alert>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#4C2325] text-[14px] font-[600] text-white transition-colors hover:bg-[#381A1B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Spinner className="h-[18px] w-[18px]" label="جاري الإرسال" />}
                <span>{submitting ? 'جاري إرسال الطلب...' : 'متابعة للدفع'}</span>
                {!submitting && <span aria-hidden="true">←</span>}
              </button>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
