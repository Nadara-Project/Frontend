import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiImage, FiMessageCircle } from 'react-icons/fi';
import { EmptyState, ErrorState, Skeleton, StatusBadge } from '../../Common/Feedback';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { consultations } from '../../../services/api-client';
import { canPayConsultation, consultationDisplayStatus } from '../../../utils/status';
import { formatPrice, formatTimestamp } from '../../../utils/format';

const ConsultationCard = ({ consultation }) => {
  const { label, tone } = consultationDisplayStatus(consultation);
  const needsPayment = canPayConsultation(consultation);

  return (
    <article className="flex flex-col gap-[12px] rounded-[16px] border border-[#E9E2DA] bg-white p-[16px] shadow-[0px_1px_2px_0px_#0000000D] sm:p-[20px]">
      <div className="flex flex-wrap items-start justify-between gap-[8px]">
        <div className="flex min-w-0 flex-col gap-[2px]">
          <h3 className="text-[16px] font-[700] text-[#2B2527]">استشارة مع {consultation.doctor?.name ?? 'الطبيب'}</h3>
          <p className="text-[12px] text-[#94A3B8]">
            {formatTimestamp(consultation.submitted_at ?? consultation.created_at)} · {formatPrice(consultation.price)}
          </p>
        </div>
        <StatusBadge label={label} tone={tone} />
      </div>

      <p className="line-clamp-2 text-[14px] leading-[22px] text-[#4C2325]">{consultation.symptoms}</p>

      {consultation.status === 'replied' && (
        <p className="flex items-center gap-[6px] text-[13px] font-[600] text-[#047857]">
          <FiMessageCircle className="h-[14px] w-[14px]" aria-hidden="true" />
          وصلك رد من الطبيب
        </p>
      )}

      <div className="flex flex-wrap items-center gap-[10px] border-t border-[#F1F5F9] pt-[12px]">
        {needsPayment && (
          <Link
            to={`/consultations/${consultation.id}/payment`}
            className="inline-flex h-[38px] items-center rounded-[10px] bg-[#4C2325] px-[14px] text-[13px] font-[600] text-white hover:bg-[#381A1B]"
          >
            {consultation.payment?.status === 'rejected' ? 'رفع إيصال جديد' : 'رفع إيصال الدفع'}
          </Link>
        )}
        <Link
          to={`/consultations/${consultation.id}`}
          className="ms-auto inline-flex h-[38px] items-center gap-[4px] rounded-[10px] px-[12px] text-[13px] font-[600] text-[#4C2325] hover:bg-[#D5C7AD33]"
        >
          عرض التفاصيل
          <FiChevronLeft className="h-[14px] w-[14px]" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

const MyConsultations = () => {
  const [page, setPage] = useState(1);
  const query = useAsync((signal) => consultations.list({ page, signal }), [page]);
  const items = query.data?.data ?? [];

  if (query.loading && !query.data) {
    return (
      <div className="flex flex-col gap-[12px]">
        {[0, 1].map((key) => (
          <Skeleton key={key} className="h-[140px] rounded-[16px]" />
        ))}
      </div>
    );
  }

  if (query.error) return <ErrorState error={query.error} onRetry={query.reload} />;

  if (!items.length) {
    return (
      <EmptyState
        icon={FiImage}
        title="لا توجد لديك استشارات بعد"
        description="صف حالتك وأرفق صوراً، وسيرد عليك طبيب الجلدية خلال 24 ساعة من تأكيد الدفع."
        action={
          <Link
            to="/consultation-request"
            className="inline-flex h-[42px] items-center rounded-[10px] bg-[#4C2325] px-[18px] text-[14px] font-[600] text-white hover:bg-[#381A1B]"
          >
            اطلب استشارة
          </Link>
        }
      />
    );
  }

  return (
    <section className={`flex flex-col gap-[12px] transition-opacity ${query.loading ? 'opacity-60' : ''}`}>
      <h2 className="sr-only">استشاراتي</h2>
      {items.map((consultation) => (
        <ConsultationCard key={consultation.id} consultation={consultation} />
      ))}
      <Pagination meta={query.data?.meta} onChange={setPage} disabled={query.loading} />
    </section>
  );
};

export default MyConsultations;
