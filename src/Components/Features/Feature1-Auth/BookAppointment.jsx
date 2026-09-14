import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import { Alert, EmptyState, ErrorState, Skeleton, Spinner } from '../../Common/Feedback';
import { useAsync } from '../../../hooks/useAsync';
import { appointments, catalog, doctors } from '../../../services/api-client';
import { BOOKING_RULES, CLINIC } from '../../../config/clinic';
import {
  addDays,
  formatDateLong,
  formatDuration,
  formatPrice,
  formatSlotTime,
  formatWeekday,
  initials,
  parseWallTime,
  todayInClinic,
} from '../../../utils/format';

const PERIODS = [
  { key: 'morning', label: 'الفترة الصباحية', test: (hour) => hour < 12 },
  { key: 'afternoon', label: 'فترة الظهيرة', test: (hour) => hour >= 12 && hour < 16 },
  { key: 'evening', label: 'الفترة المسائية', test: (hour) => hour >= 16 },
];

const DAY_STRIP_LENGTH = 14;

const toTime = (iso) => new Date(iso).getTime();

/**
 * الفترات تُرجع بطول جدول الطبيب (30 دقيقة مثلاً) بينما مدة الخدمة قد تكون أطول.
 * بداية الموعد صالحة فقط إذا كانت كل الفترات التي يغطيها متاحة ومتصلة،
 * وإلا سيرفض الخادم الحجز بـ 409 بعد أن يختاره المريض.
 */
const markBookableSlots = (slots, durationMinutes) => {
  const now = Date.now();
  const durationMs = (durationMinutes || 0) * 60_000;

  return slots.map((slot, index) => {
    const start = toTime(slot.start_at);
    if (!slot.available || start <= now) return { ...slot, bookable: false };

    const end = start + durationMs;
    let coveredUntil = toTime(slot.end_at);

    for (let next = index + 1; coveredUntil < end && next < slots.length; next += 1) {
      const candidate = slots[next];
      if (toTime(candidate.start_at) !== coveredUntil || !candidate.available) break;
      coveredUntil = toTime(candidate.end_at);
    }

    return { ...slot, bookable: coveredUntil >= end };
  });
};

const StepCard = ({ number, title, done, children, disabled }) => (
  <section
    aria-disabled={disabled || undefined}
    className={`rounded-[16px] border border-[#E5E7EB] bg-white p-[18px] shadow-sm transition-opacity sm:p-[24px] ${
      disabled ? 'pointer-events-none opacity-50' : ''
    }`}
  >
    <h2 className="mb-[16px] flex items-center gap-[10px] text-[16px] font-[700] text-[#4C2325] sm:text-[17px]">
      <span
        className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[13px] ${
          done ? 'bg-[#4C2325] text-white' : 'bg-[#D5C7AD33] text-[#4C2325]'
        }`}
      >
        {done ? <FiCheck className="h-[15px] w-[15px]" aria-hidden="true" /> : number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const Avatar = ({ name, imageUrl, size = 'h-[44px] w-[44px]' }) =>
  imageUrl ? (
    <img src={imageUrl} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-[#4C2325] text-[14px] font-[600] text-white`}
    >
      {initials(name) || <FiUser />}
    </span>
  );

const SummaryRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-[12px]">
    <dt className="shrink-0 text-[#718096]">{label}</dt>
    <dd className="text-left font-[600] text-[#212121]">{value || '—'}</dd>
  </div>
);

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const today = todayInClinic();
  const lastDay = addDays(today, BOOKING_RULES.maxDaysAhead);

  const [serviceId, setServiceId] = useState(() => Number(searchParams.get('service_id')) || null);
  const [doctorId, setDoctorId] = useState(() => Number(searchParams.get('doctor_id')) || null);
  const [date, setDate] = useState(today);
  const [startAt, setStartAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [conflictNotice, setConflictNotice] = useState('');

  // نحفظ الاختيار في الرابط حتى لا يضيع عند تحديث الصفحة أو مشاركتها
  const syncUrl = (nextServiceId, nextDoctorId) => {
    const params = new URLSearchParams();
    if (nextServiceId) params.set('service_id', nextServiceId);
    if (nextDoctorId) params.set('doctor_id', nextDoctorId);
    setSearchParams(params, { replace: true });
  };

  /* ------------------------------ البيانات ------------------------------ */

  const servicesQuery = useAsync((signal) => catalog.services({ perPage: 100, signal }), []);
  const bookableServices = useMemo(
    () => (servicesQuery.data?.data ?? []).filter((service) => (service.bookable_doctors_count ?? 0) > 0),
    [servicesQuery.data]
  );
  const selectedService = bookableServices.find((service) => service.id === serviceId) ?? null;

  const doctorsQuery = useAsync(
    (signal) => (serviceId ? doctors.list({ serviceId, signal }) : Promise.resolve(null)),
    [serviceId]
  );
  const serviceDoctors = useMemo(
    () =>
      (doctorsQuery.data?.data ?? [])
        .filter((doctor) => doctor.accepts_appointments !== false)
        .map((doctor) => ({
          ...doctor,
          offering: doctor.services?.find((service) => service.id === serviceId) ?? null,
        }))
        .filter((doctor) => doctor.offering),
    [doctorsQuery.data, serviceId]
  );
  const selectedDoctor = serviceDoctors.find((doctor) => doctor.id === doctorId) ?? null;

  const slotsQuery = useAsync(
    (signal) => (selectedDoctor && date ? doctors.availability(selectedDoctor.id, date, { signal }) : Promise.resolve(null)),
    [selectedDoctor?.id, date]
  );
  const slots = useMemo(
    () => markBookableSlots(slotsQuery.data ?? [], selectedDoctor?.offering?.duration_minutes),
    [slotsQuery.data, selectedDoctor]
  );
  const selectedSlot = slots.find((slot) => slot.start_at === startAt && slot.bookable) ?? null;

  const days = useMemo(
    () => Array.from({ length: DAY_STRIP_LENGTH }, (_, index) => addDays(today, index)),
    [today]
  );

  /* ------------------------------ الأحداث ------------------------------ */

  const chooseService = (id) => {
    setServiceId(id);
    setDoctorId(null);
    setStartAt('');
    setError('');
    syncUrl(id, null);
  };

  const chooseDoctor = (id) => {
    setDoctorId(id);
    setStartAt('');
    setError('');
    syncUrl(serviceId, id);
  };

  const chooseDate = (value) => {
    if (!value || value < today || value > lastDay) return;
    setDate(value);
    setStartAt('');
    setError('');
    setConflictNotice('');
  };

  const handleSubmit = async () => {
    if (!selectedService) return setError('يرجى اختيار الخدمة أولاً.');
    if (!selectedDoctor) return setError('يرجى اختيار الطبيب المعالج.');
    if (!selectedSlot) return setError('يرجى اختيار وقت متاح للموعد.');

    setError('');
    setConflictNotice('');
    setSubmitting(true);

    try {
      const appointment = await appointments.create({
        doctorId: selectedDoctor.id,
        serviceId: selectedService.id,
        startAt: selectedSlot.start_at,
      });
      navigate(`/appointments/${appointment.id}/payment`);
    } catch (err) {
      if (err.status === 409) {
        // سبقنا مريض آخر: التصحيح الوحيد المفيد هو تحديث الفترات
        setStartAt('');
        setConflictNotice(err.message);
        slotsQuery.reload();
      } else {
        setError(err.firstError?.() ?? err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------ العرض ------------------------------ */

  const renderServices = () => {
    if (servicesQuery.loading && !servicesQuery.data) {
      return (
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-[68px]" />
          ))}
        </div>
      );
    }
    if (servicesQuery.error) return <ErrorState error={servicesQuery.error} onRetry={servicesQuery.reload} />;
    if (!bookableServices.length) {
      return <EmptyState title="لا توجد خدمات متاحة للحجز حالياً" description="تواصل مع العيادة لمعرفة المواعيد القادمة." />;
    }

    return (
      <div role="radiogroup" aria-label="الخدمة" className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
        {bookableServices.map((service) => {
          const active = service.id === serviceId;
          return (
            <button
              key={service.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => chooseService(service.id)}
              className={`flex cursor-pointer flex-col items-start gap-[4px] rounded-[12px] border p-[12px] text-right transition-all ${
                active ? 'border-[#4C2325] bg-[#FDFBF7] ring-1 ring-[#4C2325]' : 'border-[#E2E8F0] hover:border-[#CBD5E0]'
              }`}
            >
              <span className="text-[14px] font-[700] text-[#212121]">{service.name}</span>
              <span className="text-[12px] text-[#718096]">
                {service.category?.name ? `${service.category.name} · ` : ''}
                {service.starting_price ? `يبدأ من ${formatPrice(service.starting_price)}` : 'السعر حسب الطبيب'}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderDoctors = () => {
    if (!serviceId) return <p className="text-[13px] text-[#718096]">اختر الخدمة أولاً لعرض الأطباء الذين يقدّمونها.</p>;
    if (doctorsQuery.loading) {
      return (
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-[76px]" />
          ))}
        </div>
      );
    }
    if (doctorsQuery.error) return <ErrorState error={doctorsQuery.error} onRetry={doctorsQuery.reload} />;
    if (!serviceDoctors.length) {
      return <EmptyState icon={FiUser} title="لا يوجد طبيب متاح لهذه الخدمة حالياً" description="جرّب خدمة أخرى أو عُد لاحقاً." />;
    }

    return (
      <div role="radiogroup" aria-label="الطبيب" className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
        {serviceDoctors.map((doctor) => {
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
              <Avatar name={doctor.name} imageUrl={doctor.image_url} />
              <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                <span className="truncate text-[14px] font-[700] text-[#212121]">{doctor.name}</span>
                {doctor.specialty && <span className="truncate text-[12px] text-[#718096]">{doctor.specialty}</span>}
                <span className="flex flex-wrap items-center gap-x-[10px] text-[12px] text-[#4C2325]">
                  <span className="font-[700]">{formatPrice(doctor.offering.price)}</span>
                  <span className="flex items-center gap-[3px]">
                    <FiClock className="h-[12px] w-[12px]" aria-hidden="true" />
                    {formatDuration(doctor.offering.duration_minutes)}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderSlots = () => {
    if (slotsQuery.loading) {
      return (
        <div className="grid grid-cols-3 gap-[8px] sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, key) => (
            <Skeleton key={key} className="h-[40px]" />
          ))}
        </div>
      );
    }
    if (slotsQuery.error) return <ErrorState error={slotsQuery.error} onRetry={slotsQuery.reload} />;
    if (!slots.length) {
      return (
        <EmptyState
          icon={FiCalendar}
          title="الطبيب لا يداوم في هذا اليوم"
          description="اختر يوماً آخر من الأيام أعلاه."
        />
      );
    }
    if (!slots.some((slot) => slot.bookable)) {
      return (
        <EmptyState
          icon={FiCalendar}
          title="لا توجد أوقات متاحة في هذا اليوم"
          description="كل الفترات محجوزة أو انقضى وقتها، جرّب يوماً آخر."
        />
      );
    }

    return (
      <div className="flex flex-col gap-[16px]">
        {PERIODS.map((period) => {
          const periodSlots = slots.filter((slot) => period.test(parseWallTime(slot.start_at)?.hour ?? 0));
          if (!periodSlots.length) return null;

          return (
            <fieldset key={period.key}>
              <legend className="mb-[8px] text-[13px] font-[600] text-[#6B5E5F]">{period.label}</legend>
              <div className="grid grid-cols-3 gap-[8px] sm:grid-cols-4">
                {periodSlots.map((slot) => {
                  const active = slot.start_at === startAt;
                  return (
                    <button
                      key={slot.start_at}
                      type="button"
                      disabled={!slot.bookable}
                      aria-pressed={active}
                      onClick={() => {
                        setStartAt(slot.start_at);
                        setError('');
                        setConflictNotice('');
                      }}
                      className={`h-[40px] rounded-[8px] border text-[13px] font-[500] transition-all ${
                        !slot.bookable
                          ? 'cursor-not-allowed border-transparent bg-[#F1F5F9] text-[#94A3B8] line-through'
                          : active
                            ? 'cursor-pointer border-[#4C2325] bg-[#4C2325] text-white'
                            : 'cursor-pointer border-[#E2E8F0] bg-white text-[#4C2325] hover:border-[#4C2325]'
                      }`}
                    >
                      {formatSlotTime(slot.start_at)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        <p className="text-[12px] text-[#94A3B8]">
          الأوقات بتوقيت العيادة. الأوقات المشطوبة محجوزة أو لا تكفي لمدة الخدمة.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-right font-['Tajawal']" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-[1100px] px-[16px] pb-[60px] pt-[24px] sm:px-[24px] sm:pt-[32px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-[16px] flex cursor-pointer items-center gap-[6px] text-[14px] font-[500] text-[#4C2325] transition-all hover:opacity-80"
        >
          <FiArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
          <span>رجوع</span>
        </button>

        <h1 className="mb-[8px] text-center text-[24px] font-[700] text-[#4C2325] sm:text-[28px]">حجز موعد جديد</h1>
        <p className="mb-[24px] text-center text-[14px] text-[#6B5E5F]">
          بعد الحجز يُثبَّت الموعد باسمك مؤقتاً حتى ترفع إيصال الدفع.
        </p>

        <div className="grid grid-cols-1 items-start gap-[20px] lg:grid-cols-12 lg:gap-[24px]">
          <div className="flex flex-col gap-[16px] lg:col-span-8">
            <StepCard number="1" title="اختر الخدمة" done={Boolean(selectedService)}>
              {renderServices()}
            </StepCard>

            <StepCard number="2" title="اختر الطبيب" done={Boolean(selectedDoctor)} disabled={!selectedService}>
              {renderDoctors()}
            </StepCard>

            <StepCard number="3" title="اختر اليوم والوقت" done={Boolean(selectedSlot)} disabled={!selectedDoctor}>
              <div className="mb-[16px] flex flex-col gap-[10px]">
                <div className="-mx-[4px] flex snap-x gap-[8px] overflow-x-auto px-[4px] pb-[6px]">
                  {days.map((day) => {
                    const active = day === date;
                    const [, , dayNumber] = day.split('-');
                    const weekday = formatWeekday(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={active}
                        aria-label={formatDateLong(day)}
                        onClick={() => chooseDate(day)}
                        className={`flex h-[64px] w-[62px] shrink-0 cursor-pointer snap-start flex-col items-center justify-center rounded-[12px] border transition-all ${
                          active ? 'border-[#4C2325] bg-[#4C2325] text-white' : 'border-[#E2E8F0] bg-white text-[#4C2325] hover:border-[#4C2325]'
                        }`}
                      >
                        <span className="text-[11px]">{day === today ? 'اليوم' : weekday}</span>
                        <span className="text-[18px] font-[700] leading-[24px]">{Number(dayNumber)}</span>
                      </button>
                    );
                  })}
                </div>

                <label className="flex flex-wrap items-center gap-[10px] text-[13px] text-[#6B5E5F]">
                  <span>أو اختر تاريخاً آخر:</span>
                  <input
                    type="date"
                    min={today}
                    max={lastDay}
                    value={date}
                    onChange={(event) => chooseDate(event.target.value)}
                    className="h-[40px] rounded-[10px] border border-[#E2E8F0] bg-white px-[12px] text-[14px] text-[#212121] focus:border-[#4C2325] focus:outline-none"
                  />
                </label>
                <p className="text-[13px] font-[600] text-[#4C2325]">{formatDateLong(date)}</p>
              </div>

              {conflictNotice && (
                <Alert type="warning" className="mb-[12px]">
                  {conflictNotice}
                </Alert>
              )}

              {selectedDoctor && renderSlots()}
            </StepCard>
          </div>

          <aside className="flex flex-col gap-[16px] rounded-[16px] border border-[#E5E7EB] bg-white p-[20px] shadow-sm sm:p-[24px] lg:sticky lg:top-[96px] lg:col-span-4">
            <h2 className="border-b border-[#E2E8F0] pb-[12px] text-[16px] font-[700] text-[#4C2325]">ملخص الحجز</h2>

            <dl className="flex flex-col gap-[12px] text-[13px] sm:text-[14px]">
              <SummaryRow label="الخدمة" value={selectedService?.name} />
              <SummaryRow label="الطبيب" value={selectedDoctor?.name} />
              <SummaryRow label="المدة" value={formatDuration(selectedDoctor?.offering?.duration_minutes)} />
              <SummaryRow label="التاريخ" value={selectedSlot ? formatDateLong(date) : ''} />
              <SummaryRow label="الوقت" value={selectedSlot ? formatSlotTime(selectedSlot.start_at) : ''} />
            </dl>

            <div className="border-t border-[#E2E8F0] pt-[16px]">
              <div className="mb-[16px] flex items-center justify-between">
                <span className="text-[14px] text-[#718096]">رسوم الموعد</span>
                <span className="text-[20px] font-[700] text-[#4C2325]">
                  {selectedDoctor ? formatPrice(selectedDoctor.offering.price) : '—'}
                </span>
              </div>

              <Alert type="error" className="mb-[12px]">
                {error}
              </Alert>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#4C2325] text-[15px] font-[600] text-white shadow-sm transition-all hover:bg-[#381A1B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Spinner className="h-[18px] w-[18px]" label="جاري الحجز" /> : null}
                <span>{submitting ? 'جاري تثبيت الموعد...' : 'تثبيت الموعد والمتابعة للدفع'}</span>
              </button>

              <p className="mt-[12px] text-[12px] leading-[20px] text-[#94A3B8]">
                يمكنك إلغاء الموعد مجاناً قبل {BOOKING_RULES.cancellationWindowHours} ساعة من وقته. الأوقات بتوقيت {CLINIC.name}.
              </p>
              <Link to="/dashboard" className="mt-[8px] inline-block text-[13px] font-[600] text-[#4C2325] hover:underline">
                عرض مواعيدي السابقة
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
