import { Spinner } from './Feedback';

/**
 * مفتاح تشغيل/إيقاف بدور switch للقارئات الصوتية.
 * في RTL يبدأ المقبض من اليمين (مطفأ) وينتقل لليسار عند التشغيل.
 */
const ToggleSwitch = ({ checked, onChange, label, disabled = false, busy = false, size = 'md', id }) => {
  const dims =
    size === 'sm'
      ? { track: 'h-[22px] w-[40px]', knob: 'h-[16px] w-[16px]', shift: '-translate-x-[18px]' }
      : { track: 'h-[26px] w-[46px]', knob: 'h-[20px] w-[20px]', shift: '-translate-x-[20px]' };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={busy || undefined}
      disabled={disabled || busy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${dims.track} ${
        checked ? 'bg-[#2F7D5B]' : 'bg-[#D9D0C6]'
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-white text-[#4C2325] shadow-sm transition-transform duration-200 ${dims.knob} ${
          checked ? dims.shift : 'translate-x-0'
        }`}
      >
        {busy && <Spinner className="h-[10px] w-[10px]" label="جاري التحديث" />}
      </span>
    </button>
  );
};

export default ToggleSwitch;
