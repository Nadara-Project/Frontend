import { Link, useSearchParams } from 'react-router-dom';
import { FiCalendar, FiChevronLeft, FiClock, FiUser } from 'react-icons/fi';
import { EmptyState, ErrorState, Skeleton, StatusBadge } from '../../Common/Feedback';
import Pagination from '../../Common/Pagination';
import { useAsync } from '../../../hooks/useAsync';
import { appointments } from '../../../services/api-client';
import { appointmentDisplayStatus } from '../../../utils/status';
import { formatDateLong, formatPrice, formatSlotTime, formatWeekday, parseWallTime, periodLabel } from '../../../utils/format';

const PERIOD_TABS = [
  { value: 'today', label: 'اليوم' },
  { value: 'tomorrow', label: 'غداً' },
  { value: 'week', label: 'الأسبوع' },
  { value: 'month', label: 'الشهر' },
];

const STATUS_TABS = [
  { value: '', label: 'الكل' },
  { value: 'approved', label: 'مؤكدة' },
  { value: 'awaiting_review', label: 'بانتظار مراجعة الدفع' },
  { value: 'pending_payment', label: 'بانتظار الدفع' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'cancelled', label: 'ملغاة' },
];

const PER_PAGE = 20;

/** يجمع مواعيد الصفحة تحت عنوان كل يوم، فالأسبوع والشهر يُقرآن كرزنامة لا كقائمة. */
const groupByDay = (items) =>
  items.reduce((days, appointment) => {
    const ymd = parseWallTime(appointment.start_at)?.ymd ?? '';
    const last = days[days.length - 1];
    if (last && last.ymd === ymd) last.items.push(appointment);
    else days.push({ ymd, items: [appointment] });
    return days;
  }, []);

const AppointmentRow = ({ appointment }) => {
  const { label, tone } = appointmentDisplayStatus(appointment);

  return (
    <li>
      <Link
        to={`/doctor/appointments/${appointment.id}`}
        className="flex items-center gap-[14px] px-[16px] py-[12px] transition-colors hover:bg-[#FBF9F6]"
      >
        <span className="flex w-[74px] shrink-0 flex-col items-center rounded-[10px] bg-[#F1ECE6] py-[8px] text-[#4C2325]">
          <span className="text-[15px] font-[800] leading-[20px] tabular-nums">{formatSlotTime(appointment.start_at)}</span>
          <span className="text-[11px]">حتى {formatSlotTime(appointment.end_at)}</span>
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="flex flex-wrap items-center gap-[8px]">
            <span className="truncate font-[700] text-[#2B2527]">{appointment.patient?.name ?? 'مريض'}</span>
            <StatusBadge label={label} tone={tone} />
          </span>
          <span className="truncate text-[13.5px] text-[#6B5E5F]">{appointment.service?.name}</span>
        </span>

        <span className="hidden shrink-0 text-[14px] font-[600] tabular-nums text-[#4C2325] sm:block">
          {formatPrice(appointment.price)}
        </span>
        <FiChevronLeft className="h-[18px] w-[18px] shrink-0 text-[#B3A69A]" aria-hidden="true" />
      </Link>
    </li>
  );
};

/** جدول الطبيب (US-017): مواعيده مجمّعة بالأيام مع فلاتر الفترة والحالة. */
const DoctorSchedule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get('period') ?? 'today';
  const status = searchParams.get('status') ?? '';
  const page = Number(searchParams.get('page')) || 1;

  const query = useAsync(
    (signal) => appointments.list({ period, status: status || undefined, page, perPage: PER_PAGE, signal }),
    [period, status, page]
  );

  const items = query.data?.data ?? [];
  const days = groupByDay(items);
  const total = query.data?.meta?.total;

  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (!value || (key === 'page' && value === 1)) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next, { replace: true });
  };

  const tabClass = (active) =>
    `h-[38px] shrink-0 cursor-pointer whitespace-nowrap rounded-[8px] px-[16px] text-[14px] transition-colors ${
      active ? 'bg-white font-[700] text-[#4C2325] shadow-sm' : 'font-[500] text-[#6B5E5F] hover:text-[#4C2325]'
    }`;

  const renderBody = () => {
    if (query.loading && !query.data) {
      return (
        <div className="flex flex-col gap-[10px] p-[14px]">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-[64px]" />
          ))}
        </div>
      );
    }
    if (query.error) return <ErrorState error={query.error} onRetry={query.reload} />;
    if (!items.length) {
      return (
        <div className="p-[16px]">
          <EmptyState
            icon={FiCalendar}
            title={status ? 'لا توجد مواعيد بهذه الحالة في هذه الفترة' : 'لا توجد مواعيد في هذه الفترة'}
            description="جرّب فترة أخرى، أو تابع مع السكرتيرة الحجوزات الجديدة."
          />
        </div>
      );
    }

    return (
      <div className={`transition-opacity ${query.loading ? 'opacity-60' : ''}`}>
        {days.map((day) => (
          <section key={day.ymd} aria-label={formatDateLong(day.ymd)}>
            {period !== 'today' && period !== 'tomorrow' && (
              <h2 className="flex items-center justify-between gap-[10px] border-y border-[#EFE9E2] bg-[#FBF9F6] px-[16px] py-[8px] text-[13px] font-[700] text-[#4C2325]">
                <span>
                  {formatWeekday(day.ymd)} · {formatDateLong(day.ymd)}
                </span>
                <span className="font-[500] text-[#8A7F80]">{day.items.length} موعد</span>
              </h2>
            )}
            <ul className="divide-y divide-[#F3EEE8]">
              {day.items.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))}
            </ul>
          </section>
        ))}

        <div className="border-t border-[#F3EEE8] px-[16px] py-[12px]">
          <Pagination meta={query.data?.meta} onChange={(next) => update({ page: next })} disabled={query.loading} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[24px] font-[800] leading-[34px] sm:text-[28px]">جدولي</h1>
        <p className="flex items-center gap-[8px] text-[14px] text-[#6B5E5F]">
          <FiClock className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          {periodLabel(period)}
        </p>
      </div>

      <div className="flex flex-col gap-[10px] rounded-[14px] border border-[#E9E2DA] bg-white p-[10px] lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="الفترة" className="flex rounded-[10px] bg-[#F1ECE6] p-[3px]">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={period === tab.value}
              onClick={() => update({ period: tab.value === 'today' ? '' : tab.value, page: 1 })}
              className={`${tabClass(period === tab.value)} flex-1 lg:flex-none`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label htmlFor="doctor-status" className="sr-only">
          حالة الموعد
        </label>
        <select
          id="doctor-status"
          value={status}
          onChange={(event) => update({ status: event.target.value, page: 1 })}
          className="h-[42px] cursor-pointer rounded-[10px] border border-[#E2E8F0] bg-white px-[12px] text-[14px] text-[#2B2527] focus:border-[#4C2325] focus:outline-none lg:w-[240px]"
        >
          {STATUS_TABS.map((tab) => (
            <option key={tab.value || 'all'} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[#E9E2DA] bg-white">
        {total !== undefined && items.length > 0 && (
          <div className="flex items-center gap-[6px] border-b border-[#EFE9E2] px-[16px] py-[10px] text-[13px] text-[#6B5E5F]">
            <FiUser className="h-[14px] w-[14px]" aria-hidden="true" />
            <span className="tabular-nums font-[700] text-[#2B2527]">{total}</span> موعد في هذه الفترة
          </div>
        )}
        {renderBody()}
      </div>
    </div>
  );
};

export default DoctorSchedule;
