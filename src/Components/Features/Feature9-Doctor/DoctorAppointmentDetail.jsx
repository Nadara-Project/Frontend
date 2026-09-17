import { Link, useParams } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { Alert, ErrorState, PageLoader, StatusBadge } from '../../Common/Feedback';
import PaymentReviewActions from '../../Common/PaymentReviewActions';
import { useAsync } from '../../../hooks/useAsync';
import { appointments } from '../../../services/api-client';
import { appointmentDisplayStatus } from '../../../utils/status';
import { formatAppointmentDateTime, formatDuration, formatPrice, formatTimestamp, parseWallTime } from '../../../utils/format';

const panel = 'rounded-[14px] border border-[#E9E2DA] bg-white';

const Row = ({ Icon, label, value, href }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-[10px]">
      <Icon className="mt-[4px] h-[15px] w-[15px] shrink-0 text-[#B3A69A]" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-[12.5px] text-[#8A7F80]">{label}</dt>
        <dd className="text-[14.5px] font-[600] text-[#2B2527]">
          {href ? (
            <a href={href} dir="ltr" className="hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
};

/** تفاصيل موعد واحد كما يراها الطبيب، مع مراجعة إيصال الدفع. */
const DoctorAppointmentDetail = () => {
  const { id } = useParams();
  const query = useAsync((signal) => appointments.get(id, { signal }), [id]);
  const appointment = query.data;

  if (query.loading && !appointment) return <PageLoader label="جاري تحميل الموعد..." />;
  if (query.error && !appointment) {
    return (
      <ErrorState
        title={[403, 404].includes(query.error.status) ? 'الموعد غير موجود' : undefined}
        error={query.error}
        onRetry={query.reload}
      />
    );
  }
  if (!appointment) return null;

  const { label, tone } = appointmentDisplayStatus(appointment);
  const durationMinutes = Math.round((new Date(appointment.end_at) - new Date(appointment.start_at)) / 60000);
  const wall = parseWallTime(appointment.start_at);

  return (
    <div className="flex flex-col gap-[16px]">
      <Link to="/doctor" className="inline-flex items-center gap-[6px] text-[14px] font-[500] text-[#4C2325] hover:opacity-80">
        <FiArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
        جدولي
      </Link>

      <section className={`${panel} p-[18px] sm:p-[24px]`}>
        <div className="mb-[16px] flex flex-wrap items-start justify-between gap-[10px]">
          <div>
            <h1 className="text-[21px] font-[800] leading-[30px] sm:text-[24px]">{appointment.service?.name}</h1>
            <p className="mt-[2px] text-[14px] text-[#6B5E5F]">{formatAppointmentDateTime(appointment.start_at)}</p>
          </div>
          <StatusBadge label={label} tone={tone} />
        </div>

        <dl className="grid grid-cols-1 gap-[14px] rounded-[12px] bg-[#FBF9F6] p-[16px] sm:grid-cols-2">
          <Row Icon={FiUser} label="المريض" value={appointment.patient?.name} />
          <Row Icon={FiPhone} label="الهاتف" value={appointment.patient?.phone} href={appointment.patient?.phone ? `tel:${appointment.patient.phone.replace(/\s+/g, '')}` : undefined} />
          <Row Icon={FiMail} label="البريد" value={appointment.patient?.email} href={appointment.patient?.email ? `mailto:${appointment.patient.email}` : undefined} />
          <Row Icon={FiClock} label="المدة" value={formatDuration(durationMinutes)} />
          <Row Icon={FiCalendar} label="تاريخ الحجز" value={formatTimestamp(appointment.created_at)} />
          <Row Icon={FiUser} label="العمر والجنس" value={appointment.patient?.age ? `${appointment.patient.age} سنة · ${appointment.patient.gender === 'female' ? 'أنثى' : 'ذكر'}` : undefined} />
        </dl>

        {appointment.status === 'cancelled' && (
          <Alert type="warning" className="mt-[14px]">
            ألغى المريض هذا الموعد{appointment.cancellation_reason ? `: ${appointment.cancellation_reason}` : '.'}
            {appointment.refund_required ? ' الدفعة مؤكدة ويلزم ترتيب استرداد.' : ''}
          </Alert>
        )}

        {appointment.status === 'expired' && (
          <Alert type="warning" className="mt-[14px]">انتهت مهلة الدفع ولم يصل إيصال، فتحرّر الوقت تلقائياً.</Alert>
        )}
      </section>

      <section className={`${panel} p-[18px] sm:p-[24px]`} aria-labelledby="payment-title">
        <h2 id="payment-title" className="mb-[12px] text-[16px] font-[800]">
          الدفع
        </h2>
        <p className="mb-[12px] text-[13.5px] text-[#6B5E5F]">
          قيمة الموعد {formatPrice(appointment.price)}. تأكيد الإيصال يحوّل الموعد إلى «مؤكد» مباشرة.
        </p>
        <PaymentReviewActions
          payment={appointment.payment}
          receiptLoader={() => appointments.receiptFile(appointment.id)}
          onReviewed={() => query.reload()}
        />
      </section>

      {wall && (
        <p className="text-[13px] text-[#8A7F80]">كل الأوقات بتوقيت العيادة.</p>
      )}
    </div>
  );
};

export default DoctorAppointmentDetail;
