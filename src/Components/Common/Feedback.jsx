import { FiAlertCircle, FiCheckCircle, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { TONE_CLASSES, TONE_DOTS } from '../../utils/status';

const ALERT_STYLES = {
  error: { box: 'bg-[#FFF5F5] border-[#FEB2B2] text-[#C53030]', Icon: FiAlertCircle, role: 'alert' },
  success: { box: 'bg-[#F0FFF4] border-[#9AE6B4] text-[#2F855A]', Icon: FiCheckCircle, role: 'status' },
  info: { box: 'bg-[#D5C7AD]/20 border-[#D5C7AD] text-[#4C2325]', Icon: FiInfo, role: 'status' },
  warning: { box: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]', Icon: FiAlertCircle, role: 'status' },
};

/** رسالة تنبيه موحّدة الشكل لكل الصفحات. */
export const Alert = ({ type = 'error', children, action, className = '' }) => {
  if (!children) return null;
  const { box, Icon, role } = ALERT_STYLES[type];

  return (
    <div
      role={role}
      className={`flex items-start gap-[10px] rounded-[12px] border p-[12px] sm:p-[14px] text-[13px] sm:text-[14px] font-[500] leading-[22px] ${box} ${className}`}
    >
      <Icon className="mt-[2px] h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  );
};

export const Spinner = ({ className = 'h-[20px] w-[20px]', label = 'جاري التحميل' }) => (
  <span
    role="status"
    aria-label={label}
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
  />
);

export const PageLoader = ({ label = 'جاري التحميل...' }) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-[12px] text-[#4C2325]">
    <Spinner className="h-[32px] w-[32px]" label={label} />
    <span className="text-[14px] text-[#6B5E5F]">{label}</span>
  </div>
);

/** حالة خطأ في تحميل صفحة كاملة، مع زر إعادة المحاولة. */
export const ErrorState = ({ error, onRetry, title = 'تعذّر تحميل البيانات' }) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-[12px] px-[16px] text-center">
    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
      <FiAlertCircle className="h-[26px] w-[26px]" aria-hidden="true" />
    </div>
    <h2 className="text-[18px] font-[700] text-[#2B2527]">{title}</h2>
    {error?.message && <p className="max-w-[420px] text-[14px] text-[#6B5E5F]">{error.message}</p>}
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-[4px] inline-flex h-[42px] cursor-pointer items-center gap-[8px] rounded-[10px] border border-[#4C2325] px-[18px] text-[14px] font-[600] text-[#4C2325] transition-colors hover:bg-[#4C2325] hover:text-white"
      >
        <FiRefreshCw className="h-[16px] w-[16px]" aria-hidden="true" />
        إعادة المحاولة
      </button>
    )}
  </div>
);

export const EmptyState = ({ icon: Icon = FiInfo, title, description, action }) => (
  <div className="flex w-full flex-col items-center justify-center gap-[10px] rounded-[16px] border border-dashed border-[#D5C7AD] bg-white px-[20px] py-[40px] text-center">
    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#D5C7AD33] text-[#4C2325]">
      <Icon className="h-[24px] w-[24px]" aria-hidden="true" />
    </div>
    <h3 className="text-[17px] font-[700] text-[#2B2527]">{title}</h3>
    {description && <p className="max-w-[420px] text-[14px] leading-[22px] text-[#6B5E5F]">{description}</p>}
    {action && <div className="mt-[6px]">{action}</div>}
  </div>
);

export const StatusBadge = ({ label, tone = 'neutral', className = '' }) => (
  <span
    className={`inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border px-[10px] py-[3px] text-[12px] font-[600] ${TONE_CLASSES[tone]} ${className}`}
  >
    <span className={`h-[6px] w-[6px] rounded-full ${TONE_DOTS[tone]}`} aria-hidden="true" />
    {label}
  </span>
);

export const Skeleton = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-[8px] bg-[#EFE9E1] ${className}`} />
);
