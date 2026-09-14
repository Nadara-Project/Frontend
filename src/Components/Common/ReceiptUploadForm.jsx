import { useEffect, useId, useState } from 'react';
import { FiFileText, FiUploadCloud, FiX } from 'react-icons/fi';
import { Alert, Spinner } from './Feedback';
import { PAYMENT_METHODS, UPLOAD_LIMITS } from '../../config/clinic';
import { formatFileSize } from '../../utils/format';

const { receipt: RULES } = UPLOAD_LIMITS;

/**
 * نموذج رفع إيصال الدفع، مشترك بين الموعد والاستشارة.
 * يتحقق من الصيغة والحجم محلياً بنفس قيود الباك إند قبل إرسال أي طلب.
 *
 * onSubmit({ file, method, reference }) يجب أن ترجع Promise وترمي ApiError عند الفشل.
 */
const ReceiptUploadForm = ({ amount, onSubmit, disabled = false, submitLabel = 'إرسال إيصال الدفع' }) => {
  const fileInputId = useId();
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) return undefined;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [file]);

  const acceptFile = (candidate) => {
    if (!candidate) return;
    if (!RULES.types.includes(candidate.type)) {
      setErrors((prev) => ({ ...prev, receipt: `صيغة الملف غير مدعومة، الصيغ المسموحة: ${RULES.typesLabel}.` }));
      return;
    }
    if (candidate.size > RULES.maxBytes) {
      setErrors((prev) => ({ ...prev, receipt: `حجم الملف أكبر من ${RULES.maxLabel}، يرجى رفع ملف أصغر.` }));
      return;
    }
    setFile(candidate);
    setErrors((prev) => ({ ...prev, receipt: '', form: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!method) nextErrors.method = 'يرجى اختيار طريقة الدفع التي استخدمتها.';
    if (!file) nextErrors.receipt = 'يرجى إرفاق صورة أو ملف الإيصال.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit({ file, method, reference });
    } catch (error) {
      setErrors({
        receipt: error.fieldError?.('receipt') ?? '',
        method: error.fieldError?.('method') ?? '',
        reference: error.fieldError?.('reference') ?? '',
        form: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || disabled;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[20px]">
      {amount && (
        <div className="flex items-center justify-between px-[4px]">
          <span className="text-[14px] font-[600] text-[#718096]">المبلغ المطلوب تحويله:</span>
          <span className="text-[22px] font-[800] text-[#4C2325]">{amount}</span>
        </div>
      )}

      {/* طرق الدفع */}
      <fieldset>
        <legend className="mb-[10px] block text-[13px] font-[700] text-[#212121]">
          طريقة الدفع <span className="text-[#E53E3E]">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
          {PAYMENT_METHODS.map((option) => {
            const active = method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-[10px] rounded-[12px] border p-[14px] transition-all ${
                  active ? 'border-[#4C2325] bg-[#FDFBF7] ring-1 ring-[#4C2325]' : 'border-[#E2E8F0] bg-[#FAFAFA] hover:border-[#CBD5E0]'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={option.value}
                  checked={active}
                  onChange={() => {
                    setMethod(option.value);
                    setErrors((prev) => ({ ...prev, method: '' }));
                  }}
                  className="mt-[3px] accent-[#4C2325]"
                />
                <span className="flex flex-col">
                  <span className="text-[13px] font-[700] text-[#212121]">{option.label}</span>
                  <span className="text-[12px] text-[#718096]">
                    {option.detailLabel}:{' '}
                    <span dir="ltr" className="font-[600] text-[#4C2325]">
                      {option.detail}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.method && (
          <p role="alert" className="mt-[6px] text-[12px] text-[#E53E3E]">
            {errors.method}
          </p>
        )}
      </fieldset>

      {/* رقم العملية */}
      <div>
        <label htmlFor={`${fileInputId}-reference`} className="mb-[8px] block text-[13px] font-[700] text-[#212121]">
          رقم العملية أو الحوالة (اختياري)
        </label>
        <input
          id={`${fileInputId}-reference`}
          type="text"
          dir="ltr"
          maxLength={100}
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="TRX-123456"
          className="h-[46px] w-full rounded-[10px] border border-[#E2E8F0] bg-white px-[14px] text-right text-[14px] text-[#212121] placeholder-[#A0AEC0] focus:border-[#4C2325] focus:outline-none"
        />
        {errors.reference ? (
          <p role="alert" className="mt-[6px] text-[12px] text-[#E53E3E]">
            {errors.reference}
          </p>
        ) : (
          <p className="mt-[6px] text-[12px] text-[#94A3B8]">يسرّع مطابقة الدفعة من قبل فريق العيادة.</p>
        )}
      </div>

      {/* الإيصال */}
      <div>
        <span className="mb-[10px] block text-[13px] font-[700] text-[#212121]">
          إيصال الدفع <span className="text-[#E53E3E]">*</span>
        </span>

        {file ? (
          <div className="flex items-center gap-[12px] rounded-[14px] border border-[#4C2325] bg-[#FDFBF7] p-[12px]">
            {previewUrl ? (
              <img src={previewUrl} alt="معاينة الإيصال" className="h-[64px] w-[64px] shrink-0 rounded-[10px] object-cover" />
            ) : (
              <span className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#4C2325]">
                <FiFileText className="h-[28px] w-[28px]" aria-hidden="true" />
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13px] font-[600] text-[#2B2527]" dir="ltr">
                {file.name}
              </span>
              <span className="text-[12px] text-[#94A3B8]">{formatFileSize(file.size)}</span>
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={isBusy}
              aria-label="إزالة الملف"
              className="flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full text-[#E53E3E] hover:bg-[#FFF5F5] disabled:opacity-50"
            >
              <FiX className="h-[18px] w-[18px]" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={fileInputId}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              acceptFile(event.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[14px] border-2 border-dashed p-[28px] text-center transition-all ${
              errors.receipt
                ? 'border-[#FEB2B2] bg-[#FFF5F5]'
                : isDragging
                  ? 'border-[#4C2325] bg-[#FDFBF7]'
                  : 'border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <FiUploadCloud className="h-[32px] w-[32px] text-[#94A3B8]" aria-hidden="true" />
            <span className="text-[13px] font-[600] text-[#475569]">اضغط لاختيار الإيصال أو اسحبه وأفلته هنا</span>
            <span className="text-[11px] text-[#94A3B8]">
              صيغ مدعومة: {RULES.typesLabel} (الحد الأقصى {RULES.maxLabel})
            </span>
          </label>
        )}

        <input
          id={fileInputId}
          type="file"
          accept={RULES.accept}
          className="sr-only"
          onChange={(event) => {
            acceptFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />

        {errors.receipt && (
          <p role="alert" className="mt-[6px] text-[12px] text-[#E53E3E]">
            {errors.receipt}
          </p>
        )}
      </div>

      {errors.form && !errors.receipt && !errors.method && !errors.reference && <Alert>{errors.form}</Alert>}

      <button
        type="submit"
        disabled={isBusy}
        className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#4C2325] text-[14px] font-[600] text-white shadow-sm transition-all hover:bg-[#381A1B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Spinner className="h-[18px] w-[18px]" label="جاري الرفع" />}
        {submitting ? 'جاري رفع الإيصال...' : submitLabel}
      </button>
    </form>
  );
};

export default ReceiptUploadForm;
