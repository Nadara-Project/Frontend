import { Link } from 'react-router-dom';
import { FiCheck, FiClock, FiSlash, FiX } from 'react-icons/fi';

// ألوان كل حالة: مؤكد (أخضر) / قيد المراجعة (كهرماني) / مرفوض (أحمر) / مغلق (رمادي)
const TONES = {
  success: {
    circle: 'bg-[#D1FAE5] text-[#10B981]',
    pill: 'bg-[#ECFDF5] border-[#A7F3D0]',
    dot: 'bg-[#10B981]',
    Icon: FiCheck,
  },
  pending: {
    circle: 'bg-[#FEF3C7] text-[#D97706]',
    pill: 'bg-[#FFFBEB] border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
    Icon: FiClock,
  },
  danger: {
    circle: 'bg-[#FEE2E2] text-[#DC2626]',
    pill: 'bg-[#FEF2F2] border-[#FECACA]',
    dot: 'bg-[#EF4444]',
    Icon: FiX,
  },
  neutral: {
    circle: 'bg-[#F1F5F9] text-[#64748B]',
    pill: 'bg-[#F8FAFC] border-[#E2E8F0]',
    dot: 'bg-[#94A3B8]',
    Icon: FiSlash,
  },
};

/**
 * بطاقة حالة الطلب (تصميم فيجما "تم الدفع").
 * نفس البطاقة تُستخدم للموعد والاستشارة بكل حالاتهما.
 *
 * action: { label, to } لرابط، أو { label, onClick } لزر.
 */
const RequestStatusCard = ({
  tone = 'pending',
  title,
  subtitle,
  statusLabel,
  reference,
  referenceLabel = 'رقم الإيصال',
  detailsTitle,
  details = [],
  footer,
  action,
  secondaryAction,
}) => {
  const { circle, pill, dot, Icon } = TONES[tone] ?? TONES.pending;

  const actionClass = 'text-[13px] font-[700] text-[#4C2325] hover:underline cursor-pointer';
  const renderAction = (item, className) =>
    item.to ? (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    ) : (
      <button type="button" onClick={item.onClick} className={className}>
        {item.label}
      </button>
    );

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center rounded-[24px] bg-white px-[20px] py-[32px] text-center shadow-[0px_4px_24px_0px_#0000000A] sm:px-[40px] sm:py-[40px]">
      <div className={`mb-[16px] flex h-[64px] w-[64px] items-center justify-center rounded-full ${circle}`}>
        <Icon className="h-[34px] w-[34px]" strokeWidth={2.5} aria-hidden="true" />
      </div>

      <h1 className="mb-[6px] text-[22px] font-[700] leading-[32px] text-[#2B2527] sm:text-[24px]">{title}</h1>
      {subtitle && (
        <p className="mb-[20px] max-w-[440px] text-[13px] leading-[22px] text-[#6B5E5F] sm:text-[14px]">{subtitle}</p>
      )}

      {/* الحالة ورقم الطلب */}
      <div
        className={`mb-[24px] inline-flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[4px] rounded-full border px-[16px] py-[6px] text-[12px] ${pill}`}
      >
        <span className="flex items-center gap-[6px] font-[700] text-[#2B2527]">
          <span className={`h-[7px] w-[7px] rounded-full ${dot}`} aria-hidden="true" />
          الحالة: {statusLabel}
        </span>
        {reference && (
          <>
            <span className="text-[#CBD5E1]" aria-hidden="true">
              |
            </span>
            <span className="text-[#475569]">
              {referenceLabel}:{' '}
              <span dir="ltr" className="font-mono font-[600]">
                {reference}
              </span>
            </span>
          </>
        )}
      </div>

      {details.length > 0 && (
        <div className="w-full rounded-[16px] bg-[#F6F3EF] p-[16px] text-right sm:p-[20px]">
          {detailsTitle && (
            <h2 className="mb-[14px] border-b border-[#E9E2DA] pb-[10px] text-[13px] font-[700] text-[#2B2527]">
              {detailsTitle}
            </h2>
          )}

          <dl className="grid grid-cols-1 gap-x-[24px] gap-y-[14px] sm:grid-cols-2">
            {details
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label} className="flex flex-col gap-[2px]">
                  <dt className="text-[12px] text-[#8A7F80]">{item.label}</dt>
                  <dd className="text-[14px] font-[700] text-[#2B2527]">{item.value}</dd>
                </div>
              ))}
          </dl>

          {footer && (
            <div className="mt-[16px] flex flex-wrap items-center justify-between gap-[8px] border-t border-[#E9E2DA] pt-[12px] text-[13px]">
              <span className="text-[#8A7F80]">{footer.label}</span>
              <span className="font-[700] text-[#2B2527]">{footer.value}</span>
            </div>
          )}
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="mt-[24px] flex flex-wrap items-center justify-center gap-x-[24px] gap-y-[10px]">
          {action &&
            renderAction(
              action,
              'inline-flex h-[44px] items-center justify-center rounded-[10px] bg-[#4C2325] px-[20px] text-[14px] font-[600] text-white transition-colors hover:bg-[#381A1B] cursor-pointer'
            )}
          {secondaryAction && renderAction(secondaryAction, actionClass)}
        </div>
      )}
    </div>
  );
};

export default RequestStatusCard;
