import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiImage, FiMessageCircle } from 'react-icons/fi';
import { EmptyState, ErrorState, Skeleton, StatusBadge } from '../../Common/Feedback';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { consultations } from '../../../services/api-client';
import { consultationDisplayStatus } from '../../../utils/status';
import { formatPrice, formatTimestamp } from '../../../utils/format';

const PER_PAGE = 10;

const FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'awaiting_reply', label: 'تنتظر ردّي' },
  { value: 'replied', label: 'تم الرد' },
  { value: 'pending_payment', label: 'بانتظار الدفع' },
];

/** صندوق الاستشارات الواردة (US-018). الفلترة محلية لأن الخادم لا يستقبل حالة هنا. */
const DoctorConsultations = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  const query = useAsync((signal) => consultations.list({ page, perPage: PER_PAGE, signal }), [page]);
  const all = query.data?.data ?? [];
  const items = filter ? all.filter((item) => item.status === filter) : all;
  const waiting = all.filter((item) => item.status === 'awaiting_reply').length;

  const renderBody = () => {
    if (query.loading && !query.data) {
      return (
        <div className="flex flex-col gap-[12px]">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-[120px] rounded-[14px]" />
          ))}
        </div>
      );
    }
    if (query.error) return <ErrorState error={query.error} onRetry={query.reload} />;
    if (!items.length) {
      return (
        <EmptyState
          icon={FiMessageCircle}
          title={filter ? 'لا توجد استشارات بهذه الحالة في هذه الصفحة' : 'لا توجد استشارات بعد'}
          description={filter ? 'جرّب فلتراً آخر.' : 'تصل هنا استشارات المرضى عن بُعد بعد تأكيد الدفع.'}
        />
      );
    }

    return (
      <div className={`flex flex-col gap-[12px] transition-opacity ${query.loading ? 'opacity-60' : ''}`}>
        {items.map((consultation) => {
          const { label, tone } = consultationDisplayStatus(consultation);
          const needsReply = consultation.status === 'awaiting_reply';

          return (
            <Link
              key={consultation.id}
              to={`/doctor/consultations/${consultation.id}`}
              className={`flex flex-col gap-[10px] rounded-[14px] border bg-white p-[16px] transition-colors hover:border-[#4C2325] sm:p-[18px] ${
                needsReply ? 'border-[#D5C7AD]' : 'border-[#E9E2DA]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-[8px]">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-[700] text-[#2B2527]">{consultation.patient?.name ?? 'مريض'}</h2>
                  <p className="text-[12.5px] text-[#8A7F80]">
                    {formatTimestamp(consultation.submitted_at ?? consultation.created_at)} · {formatPrice(consultation.price)}
                  </p>
                </div>
                <StatusBadge label={label} tone={tone} />
              </div>

              <p className="line-clamp-2 text-[14px] leading-[22px] text-[#4C2325]">{consultation.symptoms}</p>

              <div className="flex items-center justify-between gap-[10px] border-t border-[#F3EEE8] pt-[10px] text-[13px]">
                <span className="flex items-center gap-[6px] text-[#6B5E5F]">
                  <FiImage className="h-[14px] w-[14px]" aria-hidden="true" />
                  {consultation.payment?.status === 'verified' ? 'الدفع مؤكد' : 'الدفع غير مؤكد'}
                </span>
                <span className="flex items-center gap-[4px] font-[600] text-[#4C2325]">
                  {needsReply ? 'اقرأ وردّ' : 'عرض'}
                  <FiChevronLeft className="h-[14px] w-[14px]" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}

        <Pagination meta={query.data?.meta} onChange={setPage} disabled={query.loading} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <h1 className="text-[24px] font-[800] leading-[34px] sm:text-[28px]">الاستشارات</h1>
        <p className="mt-[2px] text-[14px] text-[#6B5E5F]">
          {waiting > 0 ? `${waiting} استشارة تنتظر ردّك.` : 'لا توجد استشارات تنتظر ردّك حالياً.'}
        </p>
      </div>

      <div role="group" aria-label="حالة الاستشارة" className="flex gap-[6px] overflow-x-auto rounded-[12px] border border-[#E9E2DA] bg-white p-[6px]">
        {FILTERS.map((item) => (
          <button
            key={item.value || 'all'}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`h-[36px] shrink-0 cursor-pointer whitespace-nowrap rounded-[8px] px-[14px] text-[13.5px] transition-colors ${
              filter === item.value ? 'bg-[#4C2325] font-[700] text-white' : 'font-[500] text-[#6B5E5F] hover:bg-[#F1ECE6]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {renderBody()}
    </div>
  );
};

export default DoctorConsultations;
