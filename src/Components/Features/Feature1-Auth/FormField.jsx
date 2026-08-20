import { useId, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * حقل إدخال موحّد لنماذج المصادقة: تسمية ظاهرة، رسالة خطأ مرتبطة بالحقل
 * عبر aria-describedby، وزر إظهار/إخفاء لحقول كلمة المرور.
 */
const FormField = ({ label, error, hint, type = 'text', field, ...inputProps }) => {
    const id = useId();
    const [isVisible, setIsVisible] = useState(false);

    const isPassword = type === 'password';
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined;

    return (
        <div className="flex flex-col gap-1 text-right">
            <label htmlFor={id} className="text-[14px] font-medium text-[#2B2527]">
                {label}
            </label>

            <div className="relative flex items-center w-full">
                <input
                    {...field}
                    {...inputProps}
                    id={id}
                    type={isPassword && isVisible ? 'text' : type}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={describedBy}
                    className={`
                        w-full
                        h-[53px]
                        px-[16px]
                        ${isPassword ? 'pl-[45px]' : ''}
                        rounded-[8px]
                        border
                        text-[14px]
                        transition-colors
                        focus:outline-none
                        ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[#9E9E9E] focus:border-[#4C2325]'}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsVisible((visible) => !visible)}
                        aria-label={isVisible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        className="absolute left-[16px] cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#4C2325]"
                    >
                        {isVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                )}
            </div>

            {hint && !error && (
                <span id={hintId} className="text-[12px] leading-[16px] text-[#4C2325]/60">
                    {hint}
                </span>
            )}

            {error && (
                <span id={errorId} role="alert" className="text-[12px] leading-[16px] text-red-600">
                    {error}
                </span>
            )}
        </div>
    );
};

export default FormField;
