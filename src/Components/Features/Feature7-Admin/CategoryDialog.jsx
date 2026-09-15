import { useState } from 'react';
import Modal from '../../Common/Modal';
import { Alert, Spinner } from '../../Common/Feedback';
import { admin } from '../../../services/api-client';
import { inputClass, primaryButtonClass, secondaryButtonClass } from './adminStyles';

/**
 * إضافة تصنيف أو إعادة تسميته. تُستخدم من صفحة التصنيفات،
 * ومن نموذج الخدمة لإضافة تصنيف دون مغادرة النموذج.
 */
const CategoryDialog = ({ open, category, onClose, onSaved }) => {
  const isEdit = Boolean(category);
  const [name, setName] = useState(category?.name ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('اسم التصنيف مطلوب.');
      return;
    }
    if (trimmed.length > 255) {
      setError('اسم التصنيف يجب ألا يتجاوز 255 حرفاً.');
      return;
    }
    if (isEdit && trimmed === category.name) {
      onClose();
      return;
    }

    setBusy(true);
    setError('');
    try {
      const saved = isEdit
        ? await admin.categories.update(category.id, { name: trimmed })
        : await admin.categories.create({ name: trimmed });
      onSaved(saved);
    } catch (err) {
      setError(err.fieldError?.('name') ?? err.message);
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      dismissible={!busy}
      title={isEdit ? 'إعادة تسمية التصنيف' : 'تصنيف جديد'}
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-[14px]">
        <label htmlFor="category-name" className="flex flex-col gap-[6px]">
          <span className="text-[13px] font-[600] text-[#2B2527]">اسم التصنيف</span>
          <input
            id="category-name"
            autoFocus
            maxLength={255}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
            placeholder="مثال: علاجات الليزر"
            aria-invalid={Boolean(error)}
            className={inputClass(error)}
          />
        </label>
        {isEdit && category.services_count > 0 && (
          <p className="text-[13px] text-[#6B5E5F]">سيظهر الاسم الجديد على {category.services_count} خدمة في الكتالوج.</p>
        )}
        <Alert>{error}</Alert>
        <div className="flex flex-col-reverse gap-[10px] sm:flex-row">
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busy && <Spinner className="h-[16px] w-[16px]" />}
            {isEdit ? 'حفظ الاسم' : 'إضافة التصنيف'}
          </button>
          <button type="button" onClick={onClose} disabled={busy} className={secondaryButtonClass}>
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryDialog;
