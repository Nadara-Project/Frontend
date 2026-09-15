import { useState } from 'react';
import Modal from './Modal';
import { Alert, Spinner } from './Feedback';

/**
 * تأكيد إجراء لا رجعة فيه. onConfirm يرجع Promise؛ عند فشله تبقى النافذة مفتوحة
 * وتعرض رسالة الخطأ بدل أن تُغلق وكأن شيئاً لم يحدث.
 */
const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel = 'تأكيد',
  cancelLabel = 'تراجع',
  tone = 'danger',
  onConfirm,
  onClose,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err?.message ?? 'تعذّر تنفيذ الإجراء.');
      setBusy(false);
    }
  };

  const confirmClass =
    tone === 'danger' ? 'bg-[#B91C1C] hover:bg-[#991B1B]' : 'bg-[#4C2325] hover:bg-[#381A1B]';

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissible={!busy}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            className={`inline-flex h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[10px] px-[18px] text-[14px] font-[600] text-white disabled:opacity-60 ${confirmClass}`}
          >
            {busy && <Spinner className="h-[16px] w-[16px]" />}
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E2E8F0] px-[18px] text-[14px] font-[600] text-[#4C2325] hover:border-[#4C2325] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-[12px] text-[14px] leading-[24px] text-[#4C2325]">
        {children}
        <Alert>{error}</Alert>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
