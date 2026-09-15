import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiImage, FiPackage, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import AdminPageHeader from './AdminPageHeader';
import { iconButtonClass, inputClass, panelClass, primaryButtonClass, secondaryButtonClass } from './adminStyles';
import { Alert, EmptyState, ErrorState, Skeleton } from '../../Common/Feedback';
import ConfirmDialog from '../../Common/ConfirmDialog';
import Pagination from '../../Common/Pagination';
import ToggleSwitch from '../../Common/ToggleSwitch';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { admin } from '../../../services/api-client';
import { formatPrice } from '../../../utils/format';

const STATUS_FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'active', label: 'مفعّلة' },
  { value: 'inactive', label: 'معطّلة' },
];

const PER_PAGE = 15;

const ServiceThumb = ({ service }) =>
  service.image_url ? (
    <img src={service.image_url} alt="" loading="lazy" className="h-[48px] w-[48px] shrink-0 rounded-[10px] object-cover" />
  ) : (
    <span
      className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[10px] bg-[#F1ECE6] text-[#B3A69A]"
      title="بدون صورة"
    >
      <FiImage className="h-[18px] w-[18px]" aria-hidden="true" />
    </span>
  );

const StatusText = ({ active }) => (
  <span className={`text-[13px] font-[600] ${active ? 'text-[#2F7D5B]' : 'text-[#8A7F80]'}`}>
    {active ? 'ظاهرة في الكتالوج' : 'مخفية'}
  </span>
);

/** إدارة خدمات المنصة (US-007، US-008): بحث وفلترة، تفعيل وتعطيل، تعديل وحذف. */
const AdminServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // الفلاتر محفوظة في الرابط: تبقى بعد التحديث، وتفتح من صفحة التصنيفات مفلترة مباشرة
  const categoryId = searchParams.get('category_id') ?? '';
  const status = searchParams.get('status') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const debouncedSearch = useDebouncedValue(search.trim());

  const [notice, setNotice] = useState(location.state?.notice ?? '');
  const [actionError, setActionError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // رسالة النجاح القادمة من نموذج الخدمة تُعرض مرة واحدة ولا تعود مع تحديث الصفحة
  useEffect(() => {
    if (location.state?.notice) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location, navigate]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || (key === 'page' && value === 1)) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next, { replace: true });
  };

  // نطبّق البحث على الرابط فقط عندما تتغير قيمته فعلاً بعد التأخير،
  // حتى لا تعيد قيمة قديمة معلّقة كتابة الفلاتر بعد مسحها
  const appliedSearch = useRef(debouncedSearch);
  useEffect(() => {
    if (appliedSearch.current === debouncedSearch) return;
    appliedSearch.current = debouncedSearch;
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (debouncedSearch) next.set('q', debouncedSearch);
        else next.delete('q');
        next.delete('page');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const categoriesQuery = useAsync((signal) => admin.categories.list({ perPage: 100, signal }), []);
  const categories = categoriesQuery.data?.data ?? [];

  const servicesQuery = useAsync(
    (signal) =>
      admin.services.list({
        q: searchParams.get('q') ?? undefined,
        categoryId: categoryId || undefined,
        isActive: status === '' ? undefined : status === 'active',
        page,
        perPage: PER_PAGE,
        signal,
      }),
    [searchParams.toString()]
  );
  const services = servicesQuery.data?.data ?? [];
  const total = servicesQuery.data?.meta?.total;
  const hasFilters = Boolean(searchParams.get('q') || categoryId || status);

  const toggle = async (service) => {
    setActionError('');
    setNotice('');
    setTogglingId(service.id);
    try {
      const updated = await admin.services.toggleActive(service.id);
      servicesQuery.setData((previous) => ({
        ...previous,
        data: previous.data.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      }));
      setNotice(updated.is_active ? `تم تفعيل "${updated.name}" وصارت ظاهرة في الكتالوج.` : `تم تعطيل "${updated.name}" وأُخفيت من الكتالوج.`);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    await admin.services.remove(deleting.id);
    const removedName = deleting.name;
    setDeleting(null);
    setNotice(`تم حذف "${removedName}".`);
    // إن حُذف آخر عنصر في الصفحة نرجع للصفحة السابقة
    if (services.length === 1 && page > 1) updateParams({ page: page - 1 });
    else servicesQuery.reload();
  };

  const clearFilters = () => {
    setSearch('');
    appliedSearch.current = '';
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const renderRowActions = (service) => (
    <div className="flex items-center gap-[2px]">
      <Link to={`/admin/services/${service.id}/edit`} className={iconButtonClass} aria-label={`تعديل ${service.name}`} title="تعديل">
        <FiEdit2 className="h-[16px] w-[16px]" />
      </Link>
      <button
        type="button"
        onClick={() => setDeleting(service)}
        className={`${iconButtonClass} hover:!bg-[#FEF2F2] hover:!text-[#B91C1C]`}
        aria-label={`حذف ${service.name}`}
        title="حذف"
      >
        <FiTrash2 className="h-[16px] w-[16px]" />
      </button>
    </div>
  );

  const renderList = () => {
    if (servicesQuery.loading && !servicesQuery.data) {
      return (
        <div className="flex flex-col gap-[1px] p-[12px]">
          {Array.from({ length: 6 }, (_, key) => (
            <Skeleton key={key} className="my-[6px] h-[52px]" />
          ))}
        </div>
      );
    }
    if (servicesQuery.error) return <ErrorState error={servicesQuery.error} onRetry={servicesQuery.reload} />;
    if (!services.length) {
      return (
        <div className="p-[16px]">
          <EmptyState
            icon={hasFilters ? FiSearch : FiPackage}
            title={hasFilters ? 'لا توجد خدمات مطابقة للفلاتر' : 'لا توجد خدمات بعد'}
            description={hasFilters ? 'جرّب كلمة بحث أخرى أو امسح الفلاتر.' : 'أضف أول خدمة لتظهر للمرضى في الكتالوج.'}
            action={
              hasFilters ? (
                <button type="button" onClick={clearFilters} className={secondaryButtonClass}>
                  مسح الفلاتر
                </button>
              ) : (
                <Link to="/admin/services/new" className={primaryButtonClass}>
                  <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
                  إضافة خدمة
                </Link>
              )
            }
          />
        </div>
      );
    }

    return (
      <div className={`transition-opacity ${servicesQuery.loading ? 'opacity-60' : ''}`}>
        {/* جدول للشاشات المتوسطة فما فوق */}
        <table className="hidden w-full border-collapse md:table">
          <thead>
            <tr className="border-b border-[#EFE9E2] text-[12.5px] font-[700] text-[#6B5E5F]">
              <th scope="col" className="px-[16px] py-[12px] text-right">الخدمة</th>
              <th scope="col" className="px-[16px] py-[12px] text-right">التصنيف</th>
              <th scope="col" className="px-[16px] py-[12px] text-right">السعر الإرشادي</th>
              <th scope="col" className="px-[16px] py-[12px] text-right">الحالة</th>
              <th scope="col" className="w-[96px] px-[16px] py-[12px]">
                <span className="sr-only">إجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-[#F3EEE8] last:border-0 hover:bg-[#FBF9F6]">
                <td className="px-[16px] py-[12px]">
                  <div className="flex items-center gap-[12px]">
                    <ServiceThumb service={service} />
                    <div className="min-w-0">
                      <Link to={`/admin/services/${service.id}/edit`} className="font-[700] text-[#2B2527] hover:text-[#4C2325] hover:underline">
                        {service.name}
                      </Link>
                      {service.description && <p className="line-clamp-1 max-w-[360px] text-[13px] text-[#8A7F80]">{service.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-[16px] py-[12px] text-[14px] text-[#4C2325]">{service.category?.name ?? '—'}</td>
                <td className="px-[16px] py-[12px] text-[14px] font-[600] tabular-nums">{formatPrice(service.price)}</td>
                <td className="px-[16px] py-[12px]">
                  <div className="flex items-center gap-[10px]">
                    <ToggleSwitch
                      checked={service.is_active}
                      busy={togglingId === service.id}
                      onChange={() => toggle(service)}
                      label={`${service.is_active ? 'تعطيل' : 'تفعيل'} ${service.name}`}
                      size="sm"
                    />
                    <StatusText active={service.is_active} />
                  </div>
                </td>
                <td className="px-[16px] py-[12px]">{renderRowActions(service)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* بطاقات للموبايل */}
        <ul className="divide-y divide-[#F3EEE8] md:hidden">
          {services.map((service) => (
            <li key={service.id} className="flex flex-col gap-[10px] p-[14px]">
              <div className="flex items-start gap-[12px]">
                <ServiceThumb service={service} />
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/services/${service.id}/edit`} className="font-[700] text-[#2B2527]">
                    {service.name}
                  </Link>
                  <p className="text-[13px] text-[#8A7F80]">
                    {service.category?.name ?? '—'} · <span className="tabular-nums">{formatPrice(service.price)}</span>
                  </p>
                </div>
                {renderRowActions(service)}
              </div>
              <div className="flex items-center gap-[10px]">
                <ToggleSwitch
                  checked={service.is_active}
                  busy={togglingId === service.id}
                  onChange={() => toggle(service)}
                  label={`${service.is_active ? 'تعطيل' : 'تفعيل'} ${service.name}`}
                  size="sm"
                />
                <StatusText active={service.is_active} />
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-[#F3EEE8] px-[16px] py-[12px]">
          <Pagination meta={servicesQuery.data?.meta} onChange={(next) => updateParams({ page: next })} disabled={servicesQuery.loading} />
        </div>
      </div>
    );
  };

  return (
    <>
      <AdminPageHeader
        title="الخدمات"
        description="الخدمات المعطّلة تختفي من الكتالوج ومن الحجز الجديد، والمواعيد السابقة لا تتأثر."
        actions={
          <Link to="/admin/services/new" className={primaryButtonClass}>
            <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
            خدمة جديدة
          </Link>
        }
      />

      <div className="flex flex-col gap-[14px]">
        <Alert type="success">{notice}</Alert>
        <Alert>{actionError}</Alert>

        <div className={`${panelClass} flex flex-col gap-[12px] p-[12px] lg:flex-row lg:items-center`}>
          <div className="relative flex-1">
            <label htmlFor="admin-services-search" className="sr-only">
              ابحث باسم الخدمة
            </label>
            <FiSearch className="pointer-events-none absolute right-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#8A7F80]" aria-hidden="true" />
            <input
              id="admin-services-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث باسم الخدمة..."
              className={`${inputClass(false)} pr-[36px]`}
            />
          </div>

          <label htmlFor="admin-services-category" className="sr-only">
            التصنيف
          </label>
          <select
            id="admin-services-category"
            value={categoryId}
            onChange={(event) => updateParams({ category_id: event.target.value, page: 1 })}
            className={`${inputClass(false)} cursor-pointer lg:w-[220px]`}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div role="group" aria-label="حالة الخدمة" className="flex rounded-[10px] bg-[#F1ECE6] p-[3px]">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value || 'all'}
                type="button"
                aria-pressed={status === filter.value}
                onClick={() => updateParams({ status: filter.value, page: 1 })}
                className={`h-[38px] flex-1 cursor-pointer whitespace-nowrap rounded-[8px] px-[14px] text-[14px] transition-colors lg:flex-none ${
                  status === filter.value ? 'bg-white font-[700] text-[#4C2325] shadow-sm' : 'font-[500] text-[#6B5E5F] hover:text-[#4C2325]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`${panelClass} overflow-hidden`}>
          {total !== undefined && services.length > 0 && (
            <div className="flex items-center justify-between border-b border-[#EFE9E2] px-[16px] py-[10px] text-[13px] text-[#6B5E5F]">
              <span>
                <span className="tabular-nums font-[700] text-[#2B2527]">{total}</span> خدمة
              </span>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="cursor-pointer font-[600] text-[#4C2325] hover:underline">
                  مسح الفلاتر
                </button>
              )}
            </div>
          )}
          {renderList()}
        </div>
      </div>

      <ConfirmDialog
        key={deleting?.id ?? 'none'}
        open={Boolean(deleting)}
        title="حذف الخدمة"
        confirmLabel="حذف الخدمة"
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting && (
          <>
            <p>
              هل تريد حذف <strong>{deleting.name}</strong>؟ ستختفي من الكتالوج ولن يمكن حجزها، ولا يمكن استرجاعها من اللوحة.
            </p>
            <p className="text-[13px] text-[#6B5E5F]">
              المواعيد السابقة المرتبطة بها تبقى محفوظة. إن كنت تريد إخفاءها مؤقتاً فقط، استخدم التعطيل بدل الحذف.
            </p>
          </>
        )}
      </ConfirmDialog>
    </>
  );
};

export default AdminServices;
