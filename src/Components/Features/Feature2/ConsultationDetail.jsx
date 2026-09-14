import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowRight, FiLock, FiRefreshCw, FiSend } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import { Alert, ErrorState, PageLoader, Skeleton, Spinner, StatusBadge } from '../../Common/Feedback';
import { useAsync } from '../../../hooks/useAsync';
import { useAuth } from '../../../hooks/useAuth';
import { usePrivateFile } from '../../../hooks/usePrivateFile';
import { consultations } from '../../../services/api-client';
import { canPayConsultation, consultationDisplayStatus, PAYMENT_STATUS } from '../../../utils/status';
import { formatPrice, formatTimestamp } from '../../../utils/format';

const AUTO_REFRESH_MS = 30_000;

/** صورة سريرية على قرص خاص: تُجلب بالتوكن وتُعرض من رابط محلي مؤقت. */
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
      <img src={url} alt="صورة مرفقة بالحالة" className="aspect-square w-full object-cover transition-transform hover:scale-105" />
    </a>
  );
};

const MessageBubble = ({ message, mine }) => (
  <li className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
    <div
      className={`max-w-[85%] rounded-[16px] px-[14px] py-[10px] sm:max-w-[75%] ${
        mine ? 'rounded-tr-[4px] bg-[#4C2325] text-white' : 'rounded-tl-[4px] border border-[#E9E2DA] bg-[#FDFBF7] text-[#2B2527]'
      }`}
    >
      <p className={`mb-[4px] text-[12px] font-[700] ${mine ? 'text-white/80' : 'text-[#4C2325]'}`}>
        {mine ? 'أنت' : message.sender?.name ?? 'الطبيب'}
      </p>
      <p className="whitespace-pre-wrap break-words text-[14px] leading-[24px]">{message.message}</p>
      <p className={`mt-[4px] text-[11px] ${mine ? 'text-white/60' : 'text-[#94A3B8]'}`}>{formatTimestamp(message.created_at)}</p>
    </div>
  </li>
);

const ConsultationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const query = useAsync((signal) => consultations.get(id, { signal }), [id]);
  const consultation = query.data;

  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const threadEndRef = useRef(null);

  const isOpenThread = ['awaiting_reply', 'replied'].includes(consultation?.status);
  const { reload } = query;

  // تحديث دوري أثناء انتظار رد الطبيب، دون أن يضطر المريض لتحديث الصفحة
  useEffect(() => {
    if (consultation?.status !== 'awaiting_reply') return undefined;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') reload();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [consultation?.status, reload]);

  const messageCount = consultation?.messages?.length ?? 0;
  useEffect(() => {
    if (messageCount) threadEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messageCount]);

  const sendReply = async (event) => {
    event.preventDefault();
    if (reply.trim().length < 2) {
      setSendError('اكتب رسالة من حرفين على الأقل.');
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

  const renderBody = () => {
    if (query.loading && !consultation) return <PageLoader />;
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
    const payment = consultation.payment;
    const paymentStatus = PAYMENT_STATUS[payment?.status];
    const messages = consultation.messages ?? [];

    return (
      <div className="flex flex-col gap-[16px]">
        {/* الرأس */}
        <section className="rounded-[16px] border border-[#E9E2DA] bg-white p-[18px] sm:p-[24px]">
          <div className="mb-[12px] flex flex-wrap items-start justify-between gap-[10px]">
            <div>
              <h1 className="text-[20px] font-[700] text-[#2B2527] sm:text-[22px]">
                استشارة مع {consultation.doctor?.name ?? 'الطبيب'}
              </h1>
              <p className="mt-[2px] text-[13px] text-[#94A3B8]">
                أُرسلت {formatTimestamp(consultation.submitted_at ?? consultation.created_at)}
                {consultation.replied_at ? ` · آخر رد ${formatTimestamp(consultation.replied_at)}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-[8px]">
              <StatusBadge label={label} tone={tone} />
              <button
                type="button"
                onClick={query.reload}
                disabled={query.loading}
                aria-label="تحديث"
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full text-[#4C2325] hover:bg-[#D5C7AD33] disabled:opacity-50"
              >
                <FiRefreshCw className={`h-[16px] w-[16px] ${query.loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <h2 className="mb-[6px] text-[13px] font-[700] text-[#6B5E5F]">وصف الحالة</h2>
          <p className="whitespace-pre-wrap rounded-[12px] bg-[#FDFBF7] p-[14px] text-[14px] leading-[24px] text-[#2B2527]">
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

        {/* الدفع */}
        <section className="flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-[#E9E2DA] bg-white p-[16px] sm:p-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h2 className="text-[14px] font-[700] text-[#2B2527]">الدفع</h2>
            <p className="flex flex-wrap items-center gap-[8px] text-[13px] text-[#6B5E5F]">
              <span className="font-[700] text-[#4C2325]">{formatPrice(consultation.price)}</span>
              {paymentStatus ? <StatusBadge label={paymentStatus.label} tone={paymentStatus.tone} /> : <span>لم يُرفع إيصال بعد</span>}
              {payment?.receipt_number && (
                <span dir="ltr" className="font-mono text-[12px]">
                  {payment.receipt_number}
                </span>
              )}
            </p>
            {payment?.status === 'rejected' && payment.rejection_reason && (
              <p className="text-[13px] text-[#B91C1C]">سبب الرفض: {payment.rejection_reason}</p>
            )}
          </div>
          {canPayConsultation(consultation) && (
            <Link
              to={`/consultations/${consultation.id}/payment`}
              className="inline-flex h-[40px] items-center rounded-[10px] bg-[#4C2325] px-[16px] text-[13px] font-[600] text-white hover:bg-[#381A1B]"
            >
              {payment?.status === 'rejected' ? 'رفع إيصال جديد' : 'رفع إيصال الدفع'}
            </Link>
          )}
        </section>

        {/* المحادثة */}
        <section className="rounded-[16px] border border-[#E9E2DA] bg-white p-[16px] sm:p-[20px]" aria-labelledby="thread-title">
          <h2 id="thread-title" className="mb-[14px] text-[15px] font-[700] text-[#2B2527]">
            المحادثة مع الطبيب
          </h2>

          {consultation.status === 'pending_payment' ? (
            <div className="flex flex-col items-center gap-[8px] rounded-[12px] bg-[#F8FAFC] px-[16px] py-[28px] text-center">
              <FiLock className="h-[22px] w-[22px] text-[#94A3B8]" aria-hidden="true" />
              <p className="text-[14px] text-[#6B5E5F]">
                {payment?.status === 'submitted'
                  ? 'إيصالك قيد المراجعة. ستُفتح المحادثة ويبدأ الطبيب بمراجعة حالتك فور تأكيد الدفع.'
                  : 'تُفتح المحادثة بعد رفع إيصال الدفع وتأكيده.'}
              </p>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <p className="rounded-[12px] bg-[#F8FAFC] px-[16px] py-[24px] text-center text-[14px] text-[#6B5E5F]">
                  الطبيب يراجع حالتك الآن، وسيظهر رده هنا خلال 24 ساعة.
                </p>
              ) : (
                <ul className="flex max-h-[520px] flex-col gap-[10px] overflow-y-auto pe-[4px]" aria-live="polite">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} mine={message.sender_id === user?.id} />
                  ))}
                  <li ref={threadEndRef} aria-hidden="true" />
                </ul>
              )}

              {isOpenThread && (
                <form onSubmit={sendReply} className="mt-[16px] flex flex-col gap-[8px] border-t border-[#F1F5F9] pt-[14px]">
                  <label htmlFor="consultation-reply" className="text-[13px] font-[600] text-[#2B2527]">
                    {messages.length ? 'رسالة متابعة' : 'أضف معلومة للطبيب'}
                  </label>
                  <textarea
                    id="consultation-reply"
                    rows={3}
                    maxLength={5000}
                    value={reply}
                    onChange={(event) => {
                      setReply(event.target.value);
                      setSendError('');
                    }}
                    placeholder="اكتب رسالتك للطبيب..."
                    className="w-full resize-y rounded-[10px] border border-[#E2E8F0] p-[12px] text-[14px] leading-[22px] focus:border-[#4C2325] focus:outline-none"
                  />
                  <Alert>{sendError}</Alert>
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-[8px] self-end rounded-[10px] bg-[#4C2325] px-[18px] text-[14px] font-[600] text-white hover:bg-[#381A1B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? <Spinner className="h-[16px] w-[16px]" /> : <FiSend className="h-[15px] w-[15px] -scale-x-100" aria-hidden="true" />}
                    إرسال
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4F0] text-right font-['Tajawal']" dir="rtl">
      <Header />
      <main className="mx-auto w-full max-w-[860px] px-[16px] pb-[60px] pt-[24px] sm:px-[24px] sm:pt-[32px]">
        <Link
          to="/dashboard/consultations"
          className="mb-[16px] inline-flex items-center gap-[6px] text-[14px] font-[500] text-[#4C2325] hover:opacity-80"
        >
          <FiArrowRight className="h-[16px] w-[16px]" aria-hidden="true" />
          استشاراتي
        </Link>
        {renderBody()}
      </main>
    </div>
  );
};

export default ConsultationDetail;
