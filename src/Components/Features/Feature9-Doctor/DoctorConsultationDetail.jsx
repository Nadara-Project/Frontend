import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowRight, FiLock, FiPhone, FiSend, FiUser } from 'react-icons/fi';
import { Alert, ErrorState, PageLoader, Skeleton, Spinner, StatusBadge } from '../../Common/Feedback';
import PaymentReviewActions from '../../Common/PaymentReviewActions';
import { useAsync } from '../../../hooks/useAsync';
import { useAuth } from '../../../hooks/useAuth';
import { usePrivateFile } from '../../../hooks/usePrivateFile';
import { consultations } from '../../../services/api-client';
import { consultationDisplayStatus } from '../../../utils/status';
import { formatPrice, formatTimestamp } from '../../../utils/format';

const panel = 'rounded-[14px] border border-[#E9E2DA] bg-white';

/** صورة الحالة: ملف خاص يُجلب بالتوكن ثم يُعرض من رابط محلي مؤقت. */
const AttachmentThumb = ({ consultationId, attachment }) => {
  const { url, loading, error } = usePrivateFile(
    () => consultations.attachmentFile(consultationId, attachment.id),
    `${consultationId}-${attachment.id}`
  );

  if (loading) return <Skeleton className="aspect-square rounded-[10px]" />;
  if (error || !url) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[10px] border border-dashed border-[#E2E8F0] p-[6px] text-center text-[11px] text-[#94A3B8]">
        تعذّر تحميل الصورة
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[10px] border border-[#E2E8F0]">
      <img src={url} alt="صورة أرسلها المريض" className="aspect-square w-full object-cover transition-transform hover:scale-105" />
    </a>
  );
};

const MessageBubble = ({ message, mine }) => (
  <li className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
    <div
      className={`max-w-[85%] rounded-[16px] px-[14px] py-[10px] sm:max-w-[72%] ${
        mine ? 'rounded-tr-[4px] bg-[#4C2325] text-white' : 'rounded-tl-[4px] border border-[#E9E2DA] bg-[#FDFBF7] text-[#2B2527]'
      }`}
    >
      <p className={`mb-[4px] text-[12px] font-[700] ${mine ? 'text-white/80' : 'text-[#4C2325]'}`}>
        {mine ? 'أنت' : message.sender?.name ?? 'المريض'}
      </p>
      <p className="whitespace-pre-wrap break-words text-[14px] leading-[24px]">{message.message}</p>
      <p className={`mt-[4px] text-[11px] ${mine ? 'text-white/60' : 'text-[#94A3B8]'}`}>{formatTimestamp(message.created_at)}</p>
    </div>
  </li>
);

/** قراءة الاستشارة والرد عليها (US-018، US-019)، مع تأكيد الدفعة عند الحاجة. */
const DoctorConsultationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const query = useAsync((signal) => consultations.get(id, { signal }), [id]);
  const consultation = query.data;

  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const threadEndRef = useRef(null);

  const messageCount = consultation?.messages?.length ?? 0;
  useEffect(() => {
    if (messageCount) threadEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messageCount]);

  const sendReply = async (event) => {
    event.preventDefault();
    if (reply.trim().length < 2) {
      setSendError('اكتب رداً من حرفين على الأقل.');
      return;
    }

    setSending(true);
    setSendError('');
    try {
      const updated = await consultations.sendMessage(id, reply);
      query.setData((previous) => ({ ...previous, ...updated, messages: updated.messages ?? previous.messages }));
      setReply('');
    } catch (error) {
      setSendError(error.fieldError?.('message') ?? error.message);
    } finally {
      setSending(false);
    }
  };

  if (query.loading && !consultation) return <PageLoader label="جاري تحميل الاستشارة..." />;
  if (query.error && !consultation) {
    return (
      <ErrorState
        title={[403, 404].includes(query.error.status) ? 'الاستشارة غير موجودة' : undefined}
        error={query.error}
        onRetry={query.reload}
      />
    );
  }
  if (!consultation) return null;

  const { label, tone } = consultationDisplayStatus(consultation);
  const paid = consultation.payment?.status === 'verified';
  const messages = consultation.messages ?? [];
  const patient = consultation.patient;

  return (
    <div className="flex flex-col gap-[16px]">
      <Link to="/doctor/consultations" className="inline-flex items-center gap-[6px] text-[14px] font-[500] text-[#4C2325] hover:opacity-80">
        <FiArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
        الاستشارات
      </Link>

      <section className={`${panel} p-[18px] sm:p-[24px]`}>
        <div className="mb-[14px] flex flex-wrap items-start justify-between gap-[10px]">
          <div className="min-w-0">
            <h1 className="text-[21px] font-[800] leading-[30px] sm:text-[24px]">{patient?.name ?? 'مريض'}</h1>
            <p className="mt-[2px] flex flex-wrap items-center gap-x-[12px] gap-y-[2px] text-[13.5px] text-[#6B5E5F]">
              <span>أُرسلت {formatTimestamp(consultation.submitted_at ?? consultation.created_at)}</span>
              {patient?.age ? (
                <span className="flex items-center gap-[4px]">
                  <FiUser className="h-[13px] w-[13px]" aria-hidden="true" />
                  {patient.age} سنة · {patient.gender === 'female' ? 'أنثى' : 'ذكر'}
                </span>
              ) : null}
              {patient?.phone && (
                <a href={`tel:${patient.phone.replace(/\s+/g, '')}`} dir="ltr" className="flex items-center gap-[4px] hover:underline">
                  <FiPhone className="h-[13px] w-[13px]" aria-hidden="true" />
                  {patient.phone}
                </a>
              )}
            </p>
          </div>
          <StatusBadge label={label} tone={tone} />
        </div>

        <h2 className="mb-[6px] text-[13px] font-[700] text-[#6B5E5F]">وصف الحالة</h2>
        <p className="whitespace-pre-wrap rounded-[12px] bg-[#FBF9F6] p-[14px] text-[14.5px] leading-[26px] text-[#2B2527]">
          {consultation.symptoms}
        </p>

        {consultation.attachments?.length > 0 && (
          <>
            <h2 className="mb-[8px] mt-[16px] text-[13px] font-[700] text-[#6B5E5F]">الصور المرفقة</h2>
            <div className="grid grid-cols-3 gap-[10px] sm:grid-cols-5">
              {consultation.attachments.map((attachment) => (
                <AttachmentThumb key={attachment.id} consultationId={consultation.id} attachment={attachment} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className={`${panel} p-[18px] sm:p-[24px]`} aria-labelledby="consult-payment-title">
        <h2 id="consult-payment-title" className="mb-[12px] text-[16px] font-[800]">
          الدفع
        </h2>
        <p className="mb-[12px] text-[13.5px] text-[#6B5E5F]">
          قيمة الاستشارة {formatPrice(consultation.price)}. لا تُفتح المحادثة قبل تأكيد الدفع.
        </p>
        <PaymentReviewActions payment={consultation.payment} onReviewed={() => query.reload()} />
      </section>

      <section className={`${panel} p-[16px] sm:p-[20px]`} aria-labelledby="consult-thread-title">
        <h2 id="consult-thread-title" className="mb-[14px] text-[16px] font-[800]">
          الرد على المريض
        </h2>

        {!paid ? (
          <div className="flex flex-col items-center gap-[8px] rounded-[12px] bg-[#F8FAFC] px-[16px] py-[28px] text-center">
            <FiLock className="h-[22px] w-[22px] text-[#94A3B8]" aria-hidden="true" />
            <p className="text-[14px] text-[#6B5E5F]">
              {consultation.payment?.status === 'submitted'
                ? 'وصل الإيصال وينتظر التأكيد. أكّد الدفع أعلاه لتبدأ المحادثة.'
                : 'لم يُؤكَّد الدفع بعد، فالمحادثة مغلقة.'}
            </p>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <p className="rounded-[12px] bg-[#F8FAFC] px-[16px] py-[22px] text-center text-[14px] text-[#6B5E5F]">
                لا توجد رسائل بعد. ردّك الأول يصل للمريض في حسابه.
              </p>
            ) : (
              <ul className="flex max-h-[520px] flex-col gap-[10px] overflow-y-auto pe-[4px]" aria-live="polite">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} mine={message.sender_id === user?.id} />
                ))}
                <li ref={threadEndRef} aria-hidden="true" />
              </ul>
            )}

            <form onSubmit={sendReply} className="mt-[16px] flex flex-col gap-[8px] border-t border-[#F1ECE6] pt-[14px]">
              <label htmlFor="doctor-reply" className="text-[13px] font-[600] text-[#2B2527]">
                {messages.length ? 'رسالة متابعة' : 'خطة العلاج أو الرد'}
              </label>
              <textarea
                id="doctor-reply"
                rows={4}
                maxLength={5000}
                value={reply}
                onChange={(event) => {
                  setReply(event.target.value);
                  setSendError('');
                }}
                placeholder="اكتب التشخيص المبدئي وخطة العلاج..."
                className="w-full resize-y rounded-[10px] border border-[#E2E8F0] p-[12px] text-[14.5px] leading-[24px] focus:border-[#4C2325] focus:outline-none"
              />
              <Alert>{sendError}</Alert>
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] self-end rounded-[10px] bg-[#4C2325] px-[20px] text-[14px] font-[600] text-white hover:bg-[#381A1B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Spinner className="h-[16px] w-[16px]" /> : <FiSend className="h-[15px] w-[15px] -scale-x-100" aria-hidden="true" />}
                إرسال الرد
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default DoctorConsultationDetail;
