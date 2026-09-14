import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight, FiClock } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import RequestStatusCard from '../../Common/RequestStatusCard';
import ReceiptUploadForm from '../../Common/ReceiptUploadForm';
import { Alert, ErrorState, PageLoader, StatusBadge } from '../../Common/Feedback';
import { useAsync } from '../../../hooks/useAsync';
import { useCountdown } from '../../../hooks/useCountdown';
import { appointments, consultations } from '../../../services/api-client';
import { CLINIC } from '../../../config/clinic';
import {
  appointmentDisplayStatus,
  canPayAppointment,
  canPayConsultation,
  consultationDisplayStatus,
} from '../../../utils/status';
import {
  formatAppointmentDateTime,
  formatCountdown,
  formatDuration,
  formatPrice,
  formatTimestamp,
  pluralizeImages,
} from '../../../utils/format';

const durationBetween = (startIso, endIso) => {
  const minutes = Math.round((new Date(endIso) - new Date(startIso)) / 60000);
  return Number.isFinite(minutes) ? formatDuration(minutes) : '';
};

/** إعدادات كل نوع طلب: من أين يُجلب، وكيف يُلخَّص، ومتى يُسمح بالدفع. */
const KINDS = {
  appointment: {
    api: appointments,
    notFound: 'الموعد غير موجود',
    pageTitle: 'إتمام حجز الموعد',
    canPay: canPayAppointment,
    displayStatus: appointmentDisplayStatus,
    summary: (item) => [
      { label: 'الخدمة', value: item.service?.name },
      { label: 'الطبيب', value: item.doctor?.name },
      { label: 'الموعد', value: formatAppointmentDateTime(item.start_at) },
      { label: 'المدة', value: durationBetween(item.start_at, item.end_at) },
    ],
  },
  consultation: {
    api: consultations,
    notFound: 'الاستشارة غير موجودة',
    pageTitle: 'إتمام طلب الاستشارة',
    canPay: canPayConsultation,
    displayStatus: consultationDisplayStatus,
    summary: (item) => [
      { label: 'الطبيب', value: item.doctor?.name },
      { label: 'تاريخ الطلب', value: formatTimestamp(item.submitted_at ?? item.created_at) },
      { label: 'الصور المرفقة', value: pluralizeImages(item.attachments?.length ?? 0) },
      { label: 'الرد المتوقع', value: 'خلال 24 ساعة من تأكيد الدفع' },
    ],
  },
};

/** بطاقة الحالة لطلب لا ينتظر الدفع (قيد المراجعة، مؤكد، منتهي...). */
const statusCardFor = (kind, item) => {
  const { label, tone } = KINDS[kind].displayStatus(item);
  const isAppointment = kind === 'appointment';
  const listPath = isAppointment ? '/dashboard' : '/dashboard/consultations';

  const base = {
    statusLabel: label,
    reference: item.payment?.receipt_number,
    details: [
      ...KINDS[kind].summary(item),
      { label: isAppointment ? 'رسوم الموعد' : 'رسوم الاستشارة', value: formatPrice(item.price) },
    ],
    detailsTitle: isAppointment ? 'تفاصيل الزيارة:' : 'تفاصيل الاستشارة:',
    footer: isAppointment ? { label: 'موقع العيادة:', value: CLINIC.shortAddress } : undefined,
    action: isAppointment
      ? { label: 'عرض مواعيدي', to: listPath }
      : { label: 'فتح الاستشارة', to: `/consultations/${item.id}` },
    secondaryAction: { label: 'العودة إلى الرئيسية', to: '/' },
  };

  if (item.payment?.status === 'submitted') {
    return {
      ...base,
      tone: 'pending',
      title: 'تم استلام إيصال الدفع',
      subtitle: isAppointment
        ? 'طلبك قيد المراجعة، وسيؤكد فريق العيادة موعدك بعد مطابقة الإيصال.'
        : 'بعد مطابقة الإيصال، سيراجع الطبيب حالتك ويرسل لك الرد داخل حسابك.',
    };
  }

  if (!isAppointment && item.status === 'replied') {
    return { ...base, tone: 'success', title: 'وصل رد الطبيب', subtitle: 'افتح الاستشارة لقراءة الرد ومتابعة المحادثة.' };
  }

  if (tone === 'success' || tone === 'brand' || item.status === 'awaiting_reply') {
    return {
      ...base,
      tone: 'success',
      title: isAppointment ? (item.status === 'completed' ? 'تمت الزيارة' : 'موعدك مؤكد') : 'تم تأكيد الدفع',
      subtitle: isAppointment
        ? item.status === 'completed'
          ? undefined
          : 'تم التحقق من الدفع وتأكيد موعدك. نراك في العيادة!'
        : 'الطبيب يراجع حالتك الآن، وستصلك الإجابة داخل صفحة الاستشارة.',
    };
  }

  if (tone === 'danger') {
    return { ...base, tone: 'danger', title: 'تم رفض الطلب', subtitle: item.rejection_reason || undefined };
  }

  return {
    ...base,
    tone: 'neutral',
    title: item.status === 'expired' ? 'انتهت مهلة الدفع' : 'هذا الطلب مغلق',
    subtitle:
      item.status === 'expired'
        ? 'لم يصل الإيصال خلال المهلة فتم تحرير الموعد. يمكنك حجز موعد جديد في أي وقت.'
        : undefined,
    action: item.status === 'expired' ? { label: 'حجز موعد جديد', to: '/book-appointment' } : base.action,
  };
};

const HoldTimer = ({ seconds }) => (
  <div
    className={`flex items-center justify-between gap-[12px] rounded-[16px] border p-[16px] ${
      seconds > 0 ? 'border-[#FCD2D2] bg-[#FFF3F3]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
    }`}
  >
    <div className="text-[13px] leading-[1.8] text-[#718096]">
      <p className="mb-[2px] font-[700] text-[#4C2325]" aria-live="polite">
        {seconds > 0 ? (
          <>
            يرجى رفع إيصال الدفع خلال{' '}
            <span dir="ltr" className="inline-block font-bold text-[#E53E3E]">
              {formatCountdown(seconds)}
            </span>
          </>
        ) : (
          <span className="text-[#E53E3E]">انتهت مهلة الدفع</span>
        )}
      </p>
      <p>
        {seconds > 0
          ? 'الموعد محجوز مؤقتاً باسمك، وسيُحرَّر تلقائياً إذا انقضت المهلة دون إرفاق الإيصال.'
          : 'تم تحرير الموعد. احجز موعداً جديداً لتتمكن من الدفع.'}
      </p>
    </div>
    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444]">
      <FiClock className="h-[20px] w-[20px]" aria-hidden="true" />
    </div>
  </div>
);

/**
 * صفحة الدفع برفع الإيصال، مشتركة بين:
 * - الموعد: /appointments/:id/payment
 * - الاستشارة: /consultations/:id/payment
 *
 * تعتمد على المعرّف في الرابط وتجلب الطلب من الخادم، فتعمل بعد تحديث الصفحة
 * أو عند العودة إليها لاحقاً من "مواعيدي".
 */
export default function AppointmentPayment({ kind = 'appointment' }) {
  const { id } = useParams();
  const config = KINDS[kind];
  const isAppointment = kind === 'appointment';

  const query = useAsync((signal) => config.api.get(id, { signal }), [kind, id]);
  const item = query.data;

  const secondsLeft = useCountdown(isAppointment && item?.status === 'pending_payment' ? item.hold_expires_at : null);
  const holdExpired = secondsLeft === 0;

  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleUpload = async (payload) => {
    const updated = await config.api.uploadReceipt(id, payload);
    // رد الرفع لا يحمل كل العلاقات، فندمجه مع ما لدينا
    query.setData((previous) => ({ ...previous, ...updated }));
    setJustSubmitted(true);
  };

  const renderContent = () => {
    if (query.loading && !item) return <PageLoader />;
    if (query.error) {
      return (
        <ErrorState
          title={query.error.status === 404 || query.error.status === 403 ? config.notFound : undefined}
          error={query.error}
          onRetry={query.error.status >= 500 || query.error.status === 0 ? query.reload : undefined}
        />
      );
    }
    if (!item) return null;

    if (!config.canPay(item) || justSubmitted) {
      return <RequestStatusCard {...statusCardFor(kind, item)} />;
    }

    const { label, tone } = config.displayStatus(item);
    const wasRejected = item.payment?.status === 'rejected';
    const rejectedReason = item.payment?.rejection_reason || item.rejection_reason;

    return (
      <div className="flex flex-col gap-[20px]">
        {isAppointment && secondsLeft !== null && <HoldTimer seconds={secondsLeft} />}

        {wasRejected && (
          <Alert type="error">
            <p className="font-[700]">تم رفض الإيصال السابق.</p>
            {rejectedReason && <p>السبب: {rejectedReason}</p>}
            <p>يرجى رفع إيصال صحيح لإكمال الطلب.</p>
          </Alert>
        )}

        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-[20px] shadow-sm sm:p-[24px]">
          <div className="mb-[20px] flex flex-wrap items-center justify-between gap-[10px] border-b border-[#F1F5F9] pb-[16px]">
            <h1 className="text-[17px] font-[700] text-[#212121]">{config.pageTitle}</h1>
            <StatusBadge label={label} tone={tone} />
          </div>

          <dl className="mb-[24px] grid grid-cols-1 gap-[12px] rounded-[12px] border border-[#F3EFE6] bg-[#FDFBF7] p-[16px] sm:grid-cols-2">
            {config
              .summary(item)
              .filter((row) => row.value)
              .map((row) => (
                <div key={row.label}>
                  <dt className="mb-[2px] text-[12px] text-[#A0AEC0]">{row.label}</dt>
                  <dd className="text-[14px] font-[700] text-[#212121]">{row.value}</dd>
                </div>
              ))}
          </dl>

          {holdExpired ? (
            <div className="flex flex-col items-center gap-[12px] py-[12px] text-center">
              <FiAlertCircle className="h-[28px] w-[28px] text-[#E53E3E]" aria-hidden="true" />
              <p className="text-[14px] text-[#6B5E5F]">لم يعد بالإمكان رفع إيصال لهذا الموعد.</p>
              <Link
                to="/book-appointment"
                className="inline-flex h-[44px] items-center rounded-[10px] bg-[#4C2325] px-[20px] text-[14px] font-[600] text-white hover:bg-[#381A1B]"
              >
                حجز موعد جديد
              </Link>
            </div>
          ) : (
            <ReceiptUploadForm
              amount={formatPrice(item.price)}
              onSubmit={handleUpload}
              submitLabel={isAppointment ? 'تأكيد الموعد وإرسال الإيصال' : 'إرسال إيصال الدفع'}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-right font-['Tajawal']" dir="rtl">
      <Header />

      <main className="mx-auto w-full max-w-[720px] px-[16px] pb-[60px] pt-[24px] sm:pt-[32px]">
        <Link
          to={isAppointment ? '/dashboard' : '/dashboard/consultations'}
          className="mb-[16px] inline-flex items-center gap-[6px] text-[14px] font-[500] text-[#4C2325] hover:opacity-80"
        >
          <FiArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
          {isAppointment ? 'مواعيدي' : 'استشاراتي'}
        </Link>

        {renderContent()}
      </main>
    </div>
  );
}
