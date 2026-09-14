import { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * نافذة حوار مبنية على عنصر <dialog> الأصلي:
 * يحبس التركيز داخلها ويُغلق بزر Escape دون مكتبات إضافية.
 */
const Modal = ({ open, onClose, title, children, footer, dismissible = true }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault();
    if (dismissible) onClose?.();
  };

  const handleBackdropClick = (event) => {
    if (dismissible && event.target === dialogRef.current) onClose?.();
  };

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-32px)] max-w-[480px] rounded-[20px] bg-white p-0 text-right font-['Tajawal'] shadow-xl backdrop:bg-black/40"
    >
      {open && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-[12px] border-b border-[#F1F5F9] px-[20px] py-[16px]">
            <h2 id="modal-title" className="text-[17px] font-[700] text-[#2B2527]">
              {title}
            </h2>
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full text-[#6B5E5F] hover:bg-[#F4F2EE]"
              >
                <FiX className="h-[20px] w-[20px]" />
              </button>
            )}
          </div>
          <div className="px-[20px] py-[18px]">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-[10px] border-t border-[#F1F5F9] px-[20px] py-[14px] sm:flex-row sm:justify-start">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
};

export default Modal;
