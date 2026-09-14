import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/** ترقيم صفحات مبني على meta القادم من Laravel (current_page / last_page). */
const Pagination = ({ meta, onChange, disabled = false }) => {
  const current = meta?.current_page ?? 1;
  const last = meta?.last_page ?? 1;
  if (last <= 1) return null;

  const buttonClass =
    'flex h-[40px] cursor-pointer items-center gap-[4px] rounded-[10px] border border-[#E2E8F0] bg-white px-[14px] text-[13px] font-[600] text-[#4C2325] transition-colors hover:border-[#4C2325] disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="ترقيم الصفحات" className="flex items-center justify-center gap-[12px] pt-[8px]">
      <button type="button" className={buttonClass} disabled={disabled || current <= 1} onClick={() => onChange(current - 1)}>
        <FiChevronRight className="h-[16px] w-[16px]" aria-hidden="true" />
        السابق
      </button>
      <span className="text-[13px] text-[#6B5E5F]" aria-live="polite">
        صفحة {current} من {last}
      </span>
      <button type="button" className={buttonClass} disabled={disabled || current >= last} onClick={() => onChange(current + 1)}>
        التالي
        <FiChevronLeft className="h-[16px] w-[16px]" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
