import { useState } from 'react';
import { FiCheck, FiFileText, FiX } from 'react-icons/fi';
import { Alert, Spinner, StatusBadge } from './Feedback';
import Modal from './Modal';
import { openPrivateFile } from '../../hooks/usePrivateFile';
import { payments } from '../../services/api-client';
import { PAYMENT_STATUS } from '../../utils/status';
import { formatPrice } from '../../utils/format';

/**
 * مراجعة إيصال الدفع من الطاقم: عرض الإيصال، تأكيده، أو رفضه بسبب.
 * التأكيد هو ما يحوّل الموعد إلى «مؤكد» ويفتح الاستشارة للطبيب.
 *
 * receiptLoader: دالة ترجع Promise<Blob> للإيصال، أو null إن لم يُرفع بعد.
 * onReviewed(payment): تُستدعى بالدفعة المحدّثة بعد نجاح العملية.
 */
const PaymentReviewActions = ({ payment, receiptLoader, onReviewed }) => {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  if (!payment) {
    return <p className="text-[13.5px] text-[#8A7F80]">لم يُرفع إيصال دفع بعد.</p>;
  }

  const status = PAYMENT_STATUS[payment.status];
  const awaitingReview = payment.status === 'submitted';

  const viewReceipt = async () => {
    setError('');
    setBusy('receipt');
    try {
      await openPrivateFile(receiptLoader);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const verify = async () => {
    setError('');
    setBusy('verify');
    try {
      onReviewed(await payments.verify(payment.id));
    } catch (err) {
      setError(err.firstError?.() ?? err.message);
    } finally {
      setBusy('');
    }
  };

  const reject = async () => {
    if (reason.trim().length < 3) {
      setError('اكتب سبب الرفض ليظهر للمريض.');
      return;
    }
    setError('');
    setBusy('reject');
    try {
      const updated = await payments.reject(payment.id, reason);
      setRejectOpen(false);
      setReason('');
      onReviewed(updated);
    } catch (err) {
      setError(err.firstError?.() ?? err.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-wrap items-center gap-[10px] text-[14px]">
        <span className="font-[700] text-[#4C2325]">{formatPrice(payment.amount)}</span>
        {status && <StatusBadge label={status.label} tone={status.tone} />}
        {payment.receipt_number && (
          <span dir="ltr" className="font-mono text-[12.5px] text-[#6B5E5F]">
            {payment.receipt_number}
          </span>
        )}
      </div>

      {payment.status === 'rejected' && payment.rejection_reason && (
        <p className="text-[13.5px] text-[#B91C1C]">سبب الرفض: {payment.rejection_reason}</p>
      )}

      <div className="flex flex-wrap gap-[10px]">
        {payment.has_receipt && receiptLoader && (
          <button
            type="button"
            onClick={viewReceipt}
            disabled={Boolean(busy)}
            className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[10px] border border-[#D9CFC4] bg-white px-[14px] text-[13.5px] font-[600] text-[#4C2325] hover:border-[#4C2325] disabled:opacity-60"
          >
            {busy === 'receipt' ? <Spinner className="h-[15px] w-[15px]" /> : <FiFileText className="h-[15px] w-[15px]" aria-hidden="true" />}
            عرض الإيصال
          </button>
        )}

        {awaitingReview && (
          <>
            <button
              type="button"
              onClick={verify}
              disabled={Boolean(busy)}
              className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[10px] bg-[#2F7D5B] px-[16px] text-[13.5px] font-[600] text-white hover:bg-[#276A4D] disabled:opacity-60"
            >
              {busy === 'verify' ? <Spinner className="h-[15px] w-[15px]" /> : <FiCheck className="h-[16px] w-[16px]" aria-hidden="true" />}
              تأكيد الدفع
            </button>
            <button
              type="button"
              onClick={() => setRejectOpen(true)}
              disabled={Boolean(busy)}
              className="inline-flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[10px] border border-[#FECACA] px-[16px] text-[13.5px] font-[600] text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-60"
            >
              <FiX className="h-[16px] w-[16px]" aria-hidden="true" />
              رفض الإيصال
            </button>
          </>
        )}
      </div>

      {!rejectOpen && <Alert>{error}</Alert>}

      <Modal
        open={rejectOpen}
        onClose={busy ? undefined : () => setRejectOpen(false)}
        dismissible={!busy}
        title="رفض إيصال الدفع"
        footer={
          <>
            <button
              type="button"
              onClick={reject}
              disabled={Boolean(busy)}
              className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#B91C1C] px-[18px] text-[14px] font-[600] text-white hover:bg-[#991B1B] disabled:opacity-60"
            >
              {busy === 'reject' && <Spinner className="h-[16px] w-[16px]" />}
              رفض الإيصال
            </button>
            <button
              type="button"
              onClick={() => setRejectOpen(false)}
              disabled={Boolean(busy)}
              className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E2E8F0] px-[18px] text-[14px] font-[600] text-[#4C2325]"
            >
              تراجع
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-[12px]">
          <p className="text-[14px] leading-[24px] text-[#4C2325]">
            السبب يظهر للمريض، ويعود الطلب إليه ليرفع إيصالاً صحيحاً بمهلة جديدة.
          </p>
          <label className="flex flex-col gap-[6px]">
            <span className="text-[13px] font-[600] text-[#2B2527]">سبب الرفض</span>
            <textarea
              rows={3}
              maxLength={500}
              value={reason}
              autoFocus
              onChange={(event) => {
                setReason(event.target.value);
                setError('');
              }}
              placeholder="مثال: صورة الإيصال غير واضحة، أو المبلغ المحوّل لا يطابق قيمة الخدمة."
              className="w-full resize-none rounded-[10px] border border-[#E2E8F0] p-[12px] text-[14px] focus:border-[#4C2325] focus:outline-none"
            />
          </label>
          <Alert>{error}</Alert>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentReviewActions;
