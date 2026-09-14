import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiCalendar, FiMessageCircle, FiPlus, FiUser } from 'react-icons/fi';
import Header from '../../../Layouts/Header';
import { useAuth } from '../../../hooks/useAuth';

const TABS = [
  { to: '/dashboard', end: true, label: 'مواعيدي', Icon: FiCalendar },
  { to: '/dashboard/consultations', label: 'استشاراتي', Icon: FiMessageCircle },
  { to: '/dashboard/profile', label: 'ملفي الشخصي', Icon: FiUser },
];

/** إطار لوحة المريض: ترحيب، إجراءات سريعة، وتبويبات بين الأقسام. */
const PatientLayout = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(/\s+/)[0];

  return (
    <div className="min-h-screen bg-[#F7F4F0] text-right font-['Tajawal']" dir="rtl">
      <Header />

      <main className="mx-auto flex w-full max-w-[960px] flex-col gap-[20px] px-[16px] pb-[60px] pt-[24px] sm:px-[24px] sm:pt-[36px]">
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-[4px] block text-[12px] text-[#4C2325]/70">لوحة المريض</span>
            <h1 className="text-[24px] font-[700] leading-[34px] text-[#4C2325] sm:text-[30px]">
              {firstName ? `أهلاً، ${firstName}` : 'حسابي'}
            </h1>
          </div>

          <div className="flex flex-wrap gap-[10px]">
            <Link
              to="/book-appointment"
              className="inline-flex h-[42px] items-center gap-[6px] rounded-[10px] bg-[#4C2325] px-[16px] text-[14px] font-[600] text-white transition-colors hover:bg-[#381A1B]"
            >
              <FiPlus className="h-[16px] w-[16px]" aria-hidden="true" />
              حجز موعد
            </Link>
            <Link
              to="/consultation-request"
              className="inline-flex h-[42px] items-center gap-[6px] rounded-[10px] border border-[#4C2325] bg-white px-[16px] text-[14px] font-[600] text-[#4C2325] transition-colors hover:bg-[#4C2325]/5"
            >
              <FiMessageCircle className="h-[16px] w-[16px]" aria-hidden="true" />
              استشارة جديدة
            </Link>
          </div>
        </div>

        <nav aria-label="أقسام الحساب" className="grid grid-cols-3 gap-[4px] rounded-[14px] border border-[#E9E2DA] bg-white p-[4px]">
          {TABS.map(({ to, end, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-[42px] min-w-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] px-[6px] text-[13px] transition-colors sm:gap-[8px] sm:px-[14px] sm:text-[14px] ${
                  isActive ? 'bg-[#4C2325] font-[700] text-white' : 'font-[500] text-[#4C2325] hover:bg-[#D5C7AD33]'
                }`
              }
            >
              <Icon className="hidden h-[16px] w-[16px] shrink-0 min-[400px]:block" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
