import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiExternalLink, FiLayers, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import AdminPageHeader from './AdminPageHeader';
import CategoryDialog from './CategoryDialog';
import { iconButtonClass, inputClass, panelClass, primaryButtonClass } from './adminStyles';
import { Alert, EmptyState, ErrorState, Skeleton } from '../../Common/Feedback';
import ConfirmDialog from '../../Common/ConfirmDialog';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { admin } from '../../../services/api-client';
import { formatTimestamp } from '../../../utils/format';

const PER_PAGE = 20;

const servicesLabel = (count) => {
  if (!count) return 'لا توجد خدمات';
  if (count === 1) return 'خدمة واحدة';
  if (count === 2) return 'خدمتان';
  return count <= 10 ? `${count} خدمات` : `${count} خدمة`;
};

/** تصنيفات الكتالوج (US-008): إضافة، إعادة تسمية، وحذف آمن لا يمسح الخدمات. */
const AdminCategories = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const [dialog, setDialog] = useState(null); // { category?: object }
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');

  const query = useAsync(
    (signal) => admin.categories.list({ q: debouncedSearch, page, perPage: PER_PAGE, signal }),
    [debouncedSearch, page]
  );
  const categories = query.data?.data ?? [];

  const handleSaved = (saved, wasEdit) => {
    setDialog(null);
    setNotice(wasEdit ? `تمت إعادة التسمية إلى "${saved.name}".` : `تمت إضافة تصنيف "${saved.name}".`);
    if (wasEdit) {
      query.setData((previous) => ({
        ...previous,
        data: previous.data.map((item) => (item.id === saved.id ? { ...item, name: saved.name } : item)),
      }));
    } else {
      query.reload();
    }
  };

  const confirmDelete = async () => {
    await admin.categories.remove(deleting.id);
    const name = deleting.name;
    setDeleting(null);
    setNotice(`تم حذف تصنيف "${name}".`);
    if (categories.length === 1 && page > 1) setPage(page - 1);
    else query.reload();
  };

  const renderActions = (category) => {
    const hasServices = category.services_count > 0;
    return (
      <div className="flex items-center gap-[2px]">
        {hasServices && (
          <Link
            to={`/admin/services?category_id=${category.id}`}
            className={iconButtonClass}
            aria-label={`عرض خدمات ${category.name}`}
            title="عرض الخدمات"
          >
            <FiExternalLink className="h-[16px] w-[16px]" />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setDialog({ category })}
          className={iconButtonClass}
          aria-label={`إعادة تسمية ${category.name}`}
          title="إعادة تسمية"
        >
          <FiEdit2 className="h-[16px] w-[16px]" />
        </button>
        <button
          type="button"
          onClick={() => setDeleting(category)}
          disabled={hasServices}
          className={`${iconButtonClass} enabled:hover:!bg-[#FEF2F2] enabled:hover:!text-[#B91C1C]`}
          aria-label={hasServices ? `لا يمكن حذف ${category.name} لأنه يحتوي خدمات` : `حذف ${category.name}`}
          title={hasServices ? 'انقل خدماته أو احذفها أولاً' : 'حذف'}
        >
          <FiTrash2 className="h-[16px] w-[16px]" />
        </button>
      </div>
    );
  };

  const renderBody = () => {
    if (query.loading && !query.data) {
      return (
        <div className="p-[12px]">
          {Array.from({ length: 5 }, (_, key) => (
            <Skeleton key={key} className="my-[8px] h-[44px]" />
          ))}
        </div>
      );
    }
    if (query.error) return <ErrorState error={query.error} onRetry={query.reload} />;
    if (!categories.length) {
      return (
        <div className="p-[16px]">
          <EmptyState
            icon={debouncedSearch ? FiSearch : FiLayers}
            title={debouncedSearch ? `لا توجد تصنيفات باسم "${debouncedSearch}"` : 'لا توجد تصنيفات بعد'}
            description={debouncedSearch ? undefined : 'التصنيفات تنظّم الخدمات في الكتالوج، مثل: علاجات الليزر، العناية التجميلية.'}
            action={
              !debouncedSearch && (
                <button type="button" onClick={() => setDialog({})} className={primaryButtonClass}>
                  <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
                  إضافة تصنيف
                </button>
              )
            }
          />
        </div>
      );
    }

    return (
      <div className={`transition-opacity ${query.loading ? 'opacity-60' : ''}`}>
        <ul className="divide-y divide-[#F3EEE8]">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#FBF9F6]">
              <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#F1ECE6] text-[#4C2325]">
                <FiLayers className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-[700] text-[#2B2527]">{category.name}</p>
                <p className="text-[13px] text-[#8A7F80]">
                  {category.services_count > 0 ? (
                    <Link to={`/admin/services?category_id=${category.id}`} className="hover:text-[#4C2325] hover:underline">
                      {servicesLabel(category.services_count)}
                    </Link>
                  ) : (
                    <span className="text-[#B45309]">{servicesLabel(0)}</span>
                  )}
                  <span className="hidden sm:inline"> · أُضيف {formatTimestamp(category.created_at, { withTime: false })}</span>
                </p>
              </div>
              {renderActions(category)}
            </li>
          ))}
        </ul>
        <div className="border-t border-[#F3EEE8] px-[16px] py-[12px]">
          <Pagination meta={query.data?.meta} onChange={setPage} disabled={query.loading} />
        </div>
      </div>
    );
  };

  return (
    <>
      <AdminPageHeader
        title="التصنيفات"
        description="لا يمكن حذف تصنيف ما زال يحتوي خدمات، حتى لا تبقى خدمة بلا تصنيف."
        actions={
          <button type="button" onClick={() => setDialog({})} className={primaryButtonClass}>
            <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
            تصنيف جديد
          </button>
        }
      />

      <div className="flex flex-col gap-[14px]">
        <Alert type="success">{notice}</Alert>

        <div className={`${panelClass} p-[12px]`}>
          <div className="relative">
            <label htmlFor="admin-categories-search" className="sr-only">
              ابحث باسم التصنيف
            </label>
            <FiSearch className="pointer-events-none absolute right-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#8A7F80]" aria-hidden="true" />
            <input
              id="admin-categories-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="ابحث باسم التصنيف..."
              className={`${inputClass(false)} pr-[36px]`}
            />
          </div>
        </div>

        <div className={`${panelClass} overflow-hidden`}>{renderBody()}</div>
      </div>

      <CategoryDialog
        key={dialog ? `dialog-${dialog.category?.id ?? 'new'}` : 'closed'}
        open={Boolean(dialog)}
        category={dialog?.category}
        onClose={() => setDialog(null)}
        onSaved={(saved) => handleSaved(saved, Boolean(dialog?.category))}
      />

      <ConfirmDialog
        key={deleting?.id ?? 'none'}
        open={Boolean(deleting)}
        title="حذف التصنيف"
        confirmLabel="حذف التصنيف"
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting && (
          <p>
            هل تريد حذف تصنيف <strong>{deleting.name}</strong>؟ التصنيف فارغ، فلن تتأثر أي خدمة.
          </p>
        )}
      </ConfirmDialog>
    </>
  );
};

export default AdminCategories;
