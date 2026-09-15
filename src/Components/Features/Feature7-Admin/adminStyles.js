// أنماط مشتركة لأزرار وحقول لوحة الإدارة، حتى تبقى الشاشات متطابقة.

export const primaryButtonClass =
  'inline-flex h-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] bg-[#4C2325] px-[16px] text-[14px] font-[600] text-white transition-colors hover:bg-[#381A1B] disabled:cursor-not-allowed disabled:opacity-60';

export const secondaryButtonClass =
  'inline-flex h-[42px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border border-[#D9CFC4] bg-white px-[16px] text-[14px] font-[600] text-[#4C2325] transition-colors hover:border-[#4C2325] disabled:cursor-not-allowed disabled:opacity-60';

export const iconButtonClass =
  'inline-flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[8px] text-[#6B5E5F] transition-colors hover:bg-[#F1ECE6] hover:text-[#4C2325] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

export const inputClass = (hasError) =>
  `h-[44px] w-full rounded-[10px] border bg-white px-[12px] text-[15px] text-[#2B2527] placeholder-[#A0AEC0] focus:outline-none ${
    hasError ? 'border-[#E53E3E]' : 'border-[#E2E8F0] focus:border-[#4C2325]'
  }`;

export const panelClass = 'rounded-[14px] border border-[#E9E2DA] bg-white';
