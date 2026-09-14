import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiUsers } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import Footer from '../../../Layouts/Footer';
import { EmptyState, ErrorState, Skeleton } from '../../Common/Feedback';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { catalog } from '../../../services/api-client';
import { formatPrice } from '../../../utils/format';

// صور احتياطية للخدمات التي لم يرفع لها الأدمن صورة بعد
const FALLBACK_IMAGES = ['/استشارة طبيب جلدية.jpg', '/علاجية.jpg', '/تجميلية.jpg', '/ليزر.jpg'];
const fallbackImage = (service) => FALLBACK_IMAGES[(service.category?.id ?? service.id) % FALLBACK_IMAGES.length];

const PER_PAGE = 9;

const ServiceCard = ({ service }) => {
  const bookable = (service.bookable_doctors_count ?? 0) > 0;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[16px] border border-[#D5C7AD]/20 bg-white shadow-sm">
      <div className="relative h-[192px] w-full shrink-0 bg-gray-100">
        <img
          src={service.image_url || encodeURI(fallbackImage(service))}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {service.category?.name && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#4C2325] backdrop-blur-sm">
            {service.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-[16px] px-[24px] pb-[24px] pt-[22px] text-right">
        <div>
          <h3 className="mb-[10px] text-[21px] font-medium leading-[30px] text-[#4C2325]">{service.name}</h3>
          {service.description && (
            <p className="line-clamp-3 text-[15px] leading-[24px] text-[#4C2325]/90">{service.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-[16px] border-t border-[#EEEEEE] pt-[16px]">
          <div className="flex items-end justify-between gap-[12px]">
            <div className="flex flex-col">
              <span className="mb-1 text-[12px] leading-none text-[#6B5E5F]">
                {service.starting_price ? 'السعر يبدأ من' : 'السعر'}
              </span>
              <span className="text-[22px] font-bold leading-[32px] text-[#4C2325]">
                {service.starting_price ? formatPrice(service.starting_price) : 'يُحدَّد عند الحجز'}
              </span>
            </div>

            {bookable && (
              <span className="flex items-center gap-[4px] rounded-[8px] border border-[#D5C7AD]/20 bg-[#D5C7AD33] px-[10px] py-[4px] text-[12px] font-medium text-[#4C2325]">
                <FiUsers className="h-[14px] w-[14px]" aria-hidden="true" />
                {service.bookable_doctors_count === 1 ? 'طبيب واحد' : `${service.bookable_doctors_count} أطباء`}
              </span>
            )}
          </div>

          {bookable ? (
            <Link
              to={`/book-appointment?service_id=${service.id}`}
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#4C2325] text-[14px] font-medium text-white transition-colors hover:bg-[#381a1b]"
            >
              <span>حجز موعد</span>
              <FiArrowLeft className="text-base" aria-hidden="true" />
            </Link>
          ) : (
            <span className="flex h-[48px] w-full items-center justify-center rounded-full bg-[#F5F2EE] text-[14px] font-medium text-[#6B5E5F]">
              غير متاحة للحجز حالياً
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const ServicesPage = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const categoriesQuery = useAsync((signal) => catalog.categories({ signal }), []);
  const servicesQuery = useAsync(
    (signal) => catalog.services({ categoryId, q: debouncedSearch, page, perPage: PER_PAGE, signal }),
    [categoryId, debouncedSearch, page]
  );

  const categories = categoriesQuery.data?.data ?? [];
  const services = servicesQuery.data?.data ?? [];

  const selectCategory = (id) => {
    setCategoryId(id);
    setPage(1);
  };

  const changePage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chipClass = (active) =>
    `h-[38px] shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors ${
      active ? 'bg-[#4C2325] text-white' : 'bg-[#F5F2EE] text-[#6B5E5F] hover:bg-[#EAE4DC]'
    }`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFBF9] px-4 font-['Tajawal'] sm:px-6 lg:px-8" dir="rtl">
        <div className="mx-auto max-w-[1120px] space-y-8 pb-[104px]">
          <div className="flex max-w-[768px] flex-col gap-[12px] pt-[56px] text-right sm:pt-[64px]">
            <h1 className="text-[32px] font-bold leading-[44px] tracking-[-0.96px] text-[#4C2325] sm:text-[48px] sm:leading-[57.6px]">
              خدمات الجلدية والعناية بالبشرة
            </h1>
            <p className="max-w-[720px] text-[17px] leading-[28.8px] text-[#4C2325] sm:text-[18px]">
              مجموعة واسعة من الخدمات الطبية والتجميلية بإشراف أطباء مختصين. اختر الخدمة، ثم الطبيب والوقت
              المناسب لك.
            </p>
          </div>

          {/* الفلاتر والبحث */}
          <div className="mx-auto flex w-full flex-col-reverse items-center justify-between gap-4 rounded-[16px] border border-[#D5C7AD]/20 bg-white p-[12px] md:flex-row">
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0" role="group" aria-label="التصنيفات">
              <button type="button" aria-pressed={categoryId === null} onClick={() => selectCategory(null)} className={chipClass(categoryId === null)}>
                الكل
              </button>
              {categoriesQuery.loading && !categories.length
                ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-[38px] w-[110px] shrink-0 rounded-full" />)
                : categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={categoryId === category.id}
                      onClick={() => selectCategory(category.id)}
                      className={chipClass(categoryId === category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
            </div>

            <div className="relative h-[50px] w-full md:w-[320px]">
              <label htmlFor="services-search" className="sr-only">
                ابحث عن خدمة
              </label>
              <input
                id="services-search"
                type="search"
                placeholder="ابحث عن خدمة..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-full w-full rounded-full border border-[#D5C7AD]/50 bg-white px-[48px] text-right text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#4C2325] focus:outline-none"
              />
              <FiSearch className="pointer-events-none absolute right-[16px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#4C2325]" aria-hidden="true" />
            </div>
          </div>

          {/* الخدمات */}
          {servicesQuery.loading && !servicesQuery.data ? (
            <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, key) => (
                <Skeleton key={key} className="h-[460px] rounded-[16px]" />
              ))}
            </div>
          ) : servicesQuery.error ? (
            <ErrorState error={servicesQuery.error} onRetry={servicesQuery.reload} />
          ) : services.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="لا توجد خدمات مطابقة"
              description={debouncedSearch ? `لم نجد نتائج لـ "${debouncedSearch}". جرّب كلمة أخرى أو تصنيفاً مختلفاً.` : 'لا توجد خدمات في هذا التصنيف حالياً.'}
            />
          ) : (
            <div className={`space-y-8 transition-opacity ${servicesQuery.loading ? 'opacity-60' : ''}`}>
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <Pagination meta={servicesQuery.data?.meta} onChange={changePage} disabled={servicesQuery.loading} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage;
