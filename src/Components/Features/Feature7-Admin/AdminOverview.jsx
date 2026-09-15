import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiEyeOff, FiLayers, FiPackage, FiPlus } from 'react-icons/fi';
import AdminPageHeader from './AdminPageHeader';
import { panelClass, primaryButtonClass, secondaryButtonClass } from './adminStyles';
import { Alert, ErrorState, Skeleton } from '../../Common/Feedback';
import ToggleSwitch from '../../Common/ToggleSwitch';
import { useAsync } from '../../../hooks/useAsync';
import { useAuth } from '../../../hooks/useAuth';
import { admin } from '../../../services/api-client';

const StatTile = ({ label, value, to, tone = 'default', loading }) => (
  <Link
    to={to}
    className={`${panelClass} group flex flex-col gap-[4px] p-[16px] transition-colors hover:border-[#4C2325]`}
  >
    <span className="text-[13px] font-[600] text-[#6B5E5F]">{label}</span>
    {loading ? (
      <Skeleton className="h-[36px] w-[64px]" />
    ) : (
      <span
        className={`text-[30px] font-[800] leading-[36px] tabular-nums ${
          tone === 'good' ? 'text-[#2F7D5B]' : tone === 'muted' ? 'text-[#8A7F80]' : 'text-[#2B2527]'
        }`}
      >
        {value}
      </span>
    )}
    <span className="flex items-center gap-[2px] text-[12.5px] font-[600] text-[#4C2325] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      عرض
      <FiChevronLeft className="h-[13px] w-[13px]" aria-hidden="true" />
    </span>
  </Link>
);

/** الصفحة الأولى للأدمن: أرقام الكتالوج، وما يحتاج انتباهاً (خدمات معطّلة، تصنيفات فارغة). */
const AdminOverview = () => {
  const { user } = useAuth();
  const [togglingId, setTogglingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');

  const statsQuery = useAsync((signal) => admin.stats({ signal }), []);
  const inactiveQuery = useAsync((signal) => admin.services.list({ isActive: false, perPage: 5, signal }), []);
  const categoriesQuery = useAsync((signal) => admin.categories.list({ perPage: 100, signal }), []);

  const stats = statsQuery.data;
  const inactive = inactiveQuery.data?.data ?? [];
  const emptyCategories = (categoriesQuery.data?.data ?? []).filter((category) => !category.services_count);

  const activate = async (service) => {
    setTogglingId(service.id);
    setActionError('');
    try {
      const updated = await admin.services.toggleActive(service.id);
      setNotice(`تم تفعيل "${updated.name}".`);
      inactiveQuery.reload();
      statsQuery.reload();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setTogglingId(null);
    }
  };

  const firstName = user?.name?.split(/\s+/)[0];

  return (
    <>
      <AdminPageHeader
        title={firstName ? `أهلاً، ${firstName}` : 'نظرة عامة'}
        description="ملخص كتالوج المنصة الذي يراه المرضى."
        actions={
          <>
            <Link to="/admin/services/new" className={primaryButtonClass}>
              <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
              خدمة جديدة
            </Link>
            <Link to="/admin/categories" className={secondaryButtonClass}>
              إدارة التصنيفات
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-[20px]">
        {statsQuery.error ? (
          <ErrorState error={statsQuery.error} onRetry={statsQuery.reload} />
        ) : (
          <div className="grid grid-cols-2 gap-[12px] lg:grid-cols-4">
            <StatTile label="كل الخدمات" value={stats?.services} to="/admin/services" loading={!stats} />
            <StatTile label="ظاهرة في الكتالوج" value={stats?.active} to="/admin/services?status=active" tone="good" loading={!stats} />
            <StatTile label="معطّلة" value={stats?.inactive} to="/admin/services?status=inactive" tone="muted" loading={!stats} />
            <StatTile label="التصنيفات" value={stats?.categories} to="/admin/categories" loading={!stats} />
          </div>
        )}

        <Alert type="success">{notice}</Alert>
        <Alert>{actionError}</Alert>

        <div className="grid grid-cols-1 items-start gap-[16px] lg:grid-cols-2">
          <section className={`${panelClass} overflow-hidden`} aria-labelledby="inactive-title">
            <div className="flex items-center justify-between gap-[10px] border-b border-[#EFE9E2] px-[16px] py-[12px]">
              <h2 id="inactive-title" className="flex items-center gap-[8px] text-[15px] font-[800]">
                <FiEyeOff className="h-[16px] w-[16px] text-[#8A7F80]" aria-hidden="true" />
                خدمات معطّلة
              </h2>
              {(inactiveQuery.data?.meta?.total ?? 0) > inactive.length && (
                <Link to="/admin/services?status=inactive" className="text-[13px] font-[600] text-[#4C2325] hover:underline">
                  عرض الكل ({inactiveQuery.data.meta.total})
                </Link>
              )}
            </div>
            {inactiveQuery.loading && !inactiveQuery.data ? (
              <div className="p-[12px]">
                <Skeleton className="my-[6px] h-[40px]" />
                <Skeleton className="my-[6px] h-[40px]" />
              </div>
            ) : inactiveQuery.error ? (
              <ErrorState error={inactiveQuery.error} onRetry={inactiveQuery.reload} />
            ) : inactive.length === 0 ? (
              <p className="px-[16px] py-[20px] text-[14px] text-[#6B5E5F]">كل الخدمات ظاهرة للمرضى.</p>
            ) : (
              <ul className="divide-y divide-[#F3EEE8]">
                {inactive.map((service) => (
                  <li key={service.id} className="flex items-center gap-[12px] px-[16px] py-[10px]">
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/services/${service.id}/edit`} className="block truncate font-[600] hover:underline">
                        {service.name}
                      </Link>
                      <p className="truncate text-[12.5px] text-[#8A7F80]">{service.category?.name}</p>
                    </div>
                    <ToggleSwitch
                      checked={false}
                      busy={togglingId === service.id}
                      onChange={() => activate(service)}
                      label={`تفعيل ${service.name}`}
                      size="sm"
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={`${panelClass} overflow-hidden`} aria-labelledby="empty-categories-title">
            <div className="border-b border-[#EFE9E2] px-[16px] py-[12px]">
              <h2 id="empty-categories-title" className="flex items-center gap-[8px] text-[15px] font-[800]">
                <FiLayers className="h-[16px] w-[16px] text-[#8A7F80]" aria-hidden="true" />
                تصنيفات بلا خدمات
              </h2>
            </div>
            {categoriesQuery.loading && !categoriesQuery.data ? (
              <div className="p-[12px]">
                <Skeleton className="my-[6px] h-[40px]" />
              </div>
            ) : categoriesQuery.error ? (
              <ErrorState error={categoriesQuery.error} onRetry={categoriesQuery.reload} />
            ) : emptyCategories.length === 0 ? (
              <p className="px-[16px] py-[20px] text-[14px] text-[#6B5E5F]">كل التصنيفات فيها خدمات.</p>
            ) : (
              <ul className="divide-y divide-[#F3EEE8]">
                {emptyCategories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between gap-[12px] px-[16px] py-[12px]">
                    <span className="truncate font-[600]">{category.name}</span>
                    <Link
                      to="/admin/services/new"
                      className="inline-flex shrink-0 items-center gap-[4px] text-[13px] font-[600] text-[#4C2325] hover:underline"
                    >
                      <FiPackage className="h-[14px] w-[14px]" aria-hidden="true" />
                      أضف خدمة
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
