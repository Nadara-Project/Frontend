import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiFileText, FiMapPin, FiXCircle } from 'react-icons/fi';
import { Alert, EmptyState, ErrorState, Skeleton, Spinner, StatusBadge } from '../../Common/Feedback';
import Modal from '../../Common/Modal';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { useCountdown } from '../../../hooks/useCountdown';
import { openPrivateFile } from '../../../hooks/usePrivateFile';
import { appointments } from '../../../services/api-client';
import { BOOKING_RULES, CLINIC } from '../../../config/clinic';
import { appointmentDisplayStatus, CLOSED_APPOINTMENT_STATUSES } from '../../../utils/status';
import {
  formatCountdown,
  formatDateLong,
  formatPrice,
  formatSlotTime,
  formatWeekday,
  hoursUntil,
  parseWallTime,
} from '../../../utils/format';

const FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'pending_payment', label: 'بانتظار الدفع' },
  { value: 'awaiting_review', label: 'قيد المراجعة' },
  { value: 'approved', label: 'مؤكدة' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'cancelled', label: 'ملغاة' },
];

const MONTH_FORMAT = new Intl.DateTimeFormat('ar', { month: 'short', timeZone: 'UTC' });

const DateBlock = ({ startAt }) => {
  const wall = parseWallTime(startAt);
  if (!wall) return null;
  const [year, month, day] = wall.ymd.split('-').map(Number);
  return (
    <div className="flex h-[72px] w-[64px] shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#D5C7AD33] text-[#4C2325]">
      <span className="text-[11px]">{formatWeekday(wall.ymd)}</span>
      <span className="text-[22px] font-[800] leading-[26px]">{day}</span>
      <span className="text-[11px]">{MONTH_FORMAT.format(new Date(Date.UTC(year, month - 1, day)))}</span>
    </div>
  );
};

const HoldNotice = ({ appointment }) => {
  const seconds = useCountdown(appointment.hold_expires_at);
  if (seconds === null) return null;

  return seconds > 0 ? (
    <p className="flex items-center gap-[6px] text-[13px] text-[#B45309]" aria-live="polite">
      <FiClock className="h-[14px] w-[14px] shrink-0" aria-hidden="true" />
      ارفع الإيصال خلال{' '}
      <span dir="ltr" className="font-[700]">
        {formatCountdown(seconds)}
      </span>{' '}
      قبل تحرير الموعد
    </p>
  ) : (
    <p className="text-[13px] text-[#B91C1C]">انتهت مهلة الدفع، سيُحرَّر الموعد تلقائياً.</p>
  );
};

const AppointmentCard = ({ appointment, onCancel }) => {
  const { label, tone } = appointmentDisplayStatus(appointment);
  const [receiptError, setReceiptError] = useState('');
  const [openingReceipt, setOpeningReceipt] = useState(false);

  const isClosed = CLOSED_APPOINTMENT_STATUSES.includes(appointment.status);
  const hoursLeft = hoursUntil(appointment.start_at);
  const withinWindow = hoursLeft !== null && hoursLeft < BOOKING_RULES.cancellationWindowHours;
  const wall = parseWallTime(appointment.start_at);

  const viewReceipt = async () => {
    setReceiptError('');
    setOpeningReceipt(true);
    try {
      await openPrivateFile(() => appointments.receiptFile(appointment.id));
    } catch (error) {
      setReceiptError(error.message);
    } finally {
      setOpeningReceipt(false);
    }
  };

  return (
    <article className="flex flex-col gap-[14px] rounded-[16px] border border-[#E9E2DA] bg-white p-[16px] shadow-[0px_1px_2px_0px_#0000000D] sm:p-[20px]">
      <div className="flex items-start gap-[14px]">
        <DateBlock startAt={appointment.start_at} />

        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <div className="flex flex-wrap items-start justify-between gap-[8px]">
            <h3 className="text-[16px] font-[700] text-[#2B2527]">{appointment.service?.name ?? 'موعد'}</h3>
            <StatusBadge label={label} tone={tone} />
          </div>
          <p className="text-[13px] text-[#6B5E5F]">{appointment.doctor?.name}</p>
          <p className="flex flex-wrap items-center gap-x-[14px] gap-y-[2px] text-[13px] text-[#4C2325]">
            <span className="flex items-center gap-[4px]">
              <FiCalendar className="h-[13px] w-[13px]" aria-hidden="true" />
              {wall ? formatDateLong(wall.ymd) : ''}
            </span>
            <span className="flex items-center gap-[4px]">
              <FiClock className="h-[13px] w-[13px]" aria-hidden="true" />
              {formatSlotTime(appointment.start_at)}
            </span>
            <span className="font-[700]">{formatPrice(appointment.price)}</span>
          </p>
        </div>
      </div>

      {/* تفاصيل بحسب الحالة */}
      {appointment.status === 'pending_payment' && (
        <div className="flex flex-col gap-[6px] rounded-[12px] bg-[#FFFBEB] p-[12px]">
          {appointment.payment?.status === 'rejected' && (
            <p className="text-[13px] font-[600] text-[#B91C1C]">
              تم رفض الإيصال السابق{appointment.rejection_reason ? `: ${appointment.rejection_reason}` : '.'}
            </p>
          )}
          <HoldNotice appointment={appointment} />
        </div>
      )}

      {appointment.status === 'approved' && (
        <p className="flex items-center gap-[6px] text-[13px] text-[#047857]">
          <FiMapPin className="h-[14px] w-[14px] shrink-0" aria-hidden="true" />
          موعدك مؤكد في {CLINIC.shortAddress}. يرجى الحضور قبل الموعد بـ 10 دقائق.
        </p>
      )}

      {appointment.status === 'rejected' && appointment.rejection_reason && (
        <p className="text-[13px] text-[#B91C1C]">سبب الرفض: {appointment.rejection_reason}</p>
      )}

      {appointment.status === 'cancelled' && (
        <div className="flex flex-col gap-[2px] text-[13px] text-[#6B5E5F]">
          {appointment.cancellation_reason && <p>سبب الإلغاء: {appointment.cancellation_reason}</p>}
          {appointment.refund_required && (
            <p className="font-[600] text-[#047857]">تم التحقق من دفعتك مسبقاً، وسيتواصل معك فريق العيادة لاسترداد المبلغ.</p>
          )}
        </div>
      )}

      {receiptError && <Alert>{receiptError}</Alert>}

      {/* الإجراءات */}
      <div className="flex flex-wrap items-center gap-[10px] border-t border-[#F1F5F9] pt-[12px]">
        {appointment.status === 'pending_payment' && (
          <Link
            to={`/appointments/${appointment.id}/payment`}
            className="inline-flex h-[38px] items-center rounded-[10px] bg-[#4C2325] px-[14px] text-[13px] font-[600] text-white hover:bg-[#381A1B]"
          >
            رفع إيصال الدفع
          </Link>
        )}

        {appointment.payment?.has_receipt && (
          <button
            type="button"
            onClick={viewReceipt}
            disabled={openingReceipt}
            className="inline-flex h-[38px] cursor-pointer items-center gap-[6px] rounded-[10px] border border-[#E2E8F0] px-[14px] text-[13px] font-[600] text-[#4C2325] hover:border-[#4C2325] disabled:opacity-60"
          >
            {openingReceipt ? <Spinner className="h-[14px] w-[14px]" /> : <FiFileText className="h-[14px] w-[14px]" aria-hidden="true" />}
            عرض الإيصال
            {appointment.payment.receipt_number && (
              <span dir="ltr" className="font-mono text-[12px] text-[#6B5E5F]">
                {appointment.payment.receipt_number}
              </span>
            )}
          </button>
        )}

        {!isClosed && (
          <div className="ms-auto flex items-center gap-[8px]">
            {withinWindow && (
              <span className="text-[12px] text-[#94A3B8]">
                الإلغاء متاح حتى {BOOKING_RULES.cancellationWindowHours} ساعة قبل الموعد
              </span>
            )}
            <button
              type="button"
              onClick={() => onCancel(appointment)}
              disabled={withinWindow}
              className="inline-flex h-[38px] cursor-pointer items-center gap-[6px] rounded-[10px] px-[12px] text-[13px] font-[600] text-[#B91C1C] hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <FiXCircle className="h-[14px] w-[14px]" aria-hidden="true" />
              إلغاء الموعد
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

const CancelDialog = ({ appointment, onClose, onCancelled }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const confirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const updated = await appointments.cancel(appointment.id, reason);
      onCancelled({ ...appointment, ...updated });
    } catch (err) {
      setError(err.firstError?.() ?? err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={submitting ? undefined : onClose}
      dismissible={!submitting}
      title="إلغاء الموعد"
      footer={
        <>
          <button
            type="button"
            onClick={confirm}
            disabled={submitting}
            className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#B91C1C] px-[18px] text-[14px] font-[600] text-white hover:bg-[#991B1B] disabled:opacity-60"
          >
            {submitting && <Spinner className="h-[16px] w-[16px]" />}
            تأكيد الإلغاء
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E2E8F0] px-[18px] text-[14px] font-[600] text-[#4C2325] hover:border-[#4C2325] disabled:opacity-60"
          >
            تراجع
          </button>
        </>
      }
    >
      {appointment && (
        <div className="flex flex-col gap-[14px]">
          <p className="text-[14px] leading-[24px] text-[#4C2325]">
            هل تريد إلغاء موعد <strong>{appointment.service?.name}</strong> مع {appointment.doctor?.name} يوم{' '}
            {formatDateLong(parseWallTime(appointment.start_at)?.ymd)} الساعة {formatSlotTime(appointment.start_at)}؟
          </p>
          {appointment.payment?.status === 'verified' && (
            <Alert type="info">دفعتك مؤكدة، وسيتواصل معك فريق العيادة لاسترداد المبلغ بعد الإلغاء.</Alert>
          )}
          <label className="flex flex-col gap-[6px]">
            <span className="text-[13px] font-[600] text-[#2B2527]">سبب الإلغاء (اختياري)</span>
            <textarea
              rows={3}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="يساعدنا على تحسين الخدمة"
              className="w-full resize-none rounded-[10px] border border-[#E2E8F0] p-[12px] text-[14px] focus:border-[#4C2325] focus:outline-none"
            />
          </label>
          <Alert>{error}</Alert>
        </div>
      )}
    </Modal>
  );
};

const MyAppointments = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [cancelling, setCancelling] = useState(null);
  const [notice, setNotice] = useState('');

  const query = useAsync((signal) => appointments.list({ status, page, signal }), [status, page]);
  const items = query.data?.data ?? [];

  const changeFilter = (value) => {
    setStatus(value);
    setPage(1);
    setNotice('');
  };

  const handleCancelled = (updated) => {
    query.setData((previous) => ({
      ...previous,
      data: previous.data.map((item) => (item.id === updated.id ? updated : item)),
    }));
    setCancelling(null);
    setNotice('تم إلغاء الموعد وتحرير الوقت.');
  };

  return (
    <section className="flex flex-col gap-[16px]" aria-labelledby="appointments-title">
      <h2 id="appointments-title" className="sr-only">
        مواعيدي
      </h2>

      <div className="-mx-[4px] flex gap-[8px] overflow-x-auto px-[4px] pb-[4px]">
        {FILTERS.map((filter) => (
          <button
            key={filter.value || 'all'}
            type="button"
            aria-pressed={status === filter.value}
            onClick={() => changeFilter(filter.value)}
            className={`h-[36px] shrink-0 cursor-pointer whitespace-nowrap rounded-full px-[16px] text-[13px] font-[500] transition-colors ${
              status === filter.value ? 'bg-[#4C2325] text-white' : 'bg-white text-[#6B5E5F] hover:bg-[#EAE4DC]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Alert type="success">{notice}</Alert>

      {query.loading && !query.data ? (
        <div className="flex flex-col gap-[12px]">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-[150px] rounded-[16px]" />
          ))}
        </div>
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={query.reload} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title={status ? 'لا توجد مواعيد بهذه الحالة' : 'لا توجد لديك مواعيد بعد'}
          description={status ? 'جرّب اختيار حالة أخرى.' : 'احجز موعدك الأول واختر الطبيب والوقت المناسب لك.'}
          action={
            !status && (
              <Link
                to="/book-appointment"
                className="inline-flex h-[42px] items-center rounded-[10px] bg-[#4C2325] px-[18px] text-[14px] font-[600] text-white hover:bg-[#381A1B]"
              >
                احجز موعداً
              </Link>
            )
          }
        />
      ) : (
        <div className={`flex flex-col gap-[12px] transition-opacity ${query.loading ? 'opacity-60' : ''}`}>
          {items.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={setCancelling} />
          ))}
          <Pagination meta={query.data?.meta} onChange={setPage} disabled={query.loading} />
        </div>
      )}

      <CancelDialog
        key={cancelling?.id ?? 'closed'}
        appointment={cancelling}
        onClose={() => setCancelling(null)}
        onCancelled={handleCancelled}
      />
    </section>
  );
};

export default MyAppointments;
