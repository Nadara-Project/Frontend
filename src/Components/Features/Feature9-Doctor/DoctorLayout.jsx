import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import NadaraLogo from '../../Common/NadaraLogo';
import UserMenu from '../../Common/UserMenu';
import { useAuth } from '../../../hooks/useAuth';
import { DOCTOR_LINKS } from '../../../config/navigation';

const navClass = ({ isActive }) =>
  `flex h-[44px] min-w-0 items-center justify-center gap-[8px] whitespace-nowrap rounded-[10px] px-[12px] text-[14.5px] transition-colors sm:px-[16px] sm:text-[15px] ${
    isActive ? 'bg-[#4C2325] font-[700] text-white' : 'font-[500] text-[#4C2325] hover:bg-[#D5C7AD33]'
  }`;

/** إطار بوابة الطبيب: شريط علوي وتبويبان (جدولي · الاستشارات). */
const DoctorLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F6F2ED] text-right font-['Tajawal'] text-[#2B2527]" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-[#E9E2DA] bg-white">
        <div className="mx-auto flex h-[64px] max-w-[1120px] items-center justify-between gap-[12px] px-[16px] sm:px-[24px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <Link to="/doctor" aria-label="بوابة الطبيب">
              <NadaraLogo className="h-[38px] w-auto" />
            </Link>
            <span className="hidden rounded-full bg-[#4C2325] px-[10px] py-[2px] text-[12px] font-[700] text-white sm:inline">
              بوابة الطبيب
            </span>
          </div>

          <div className="flex items-center gap-[8px] sm:gap-[16px]">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-[6px] text-[14px] font-[500] text-[#6B5E5F] hover:text-[#4C2325] md:inline-flex"
            >
              عرض الموقع
              <FiExternalLink className="h-[14px] w-[14px]" aria-hidden="true" />
            </Link>
            <UserMenu user={user} onLogout={logout} />
          </div>
        </div>

        <nav
          aria-label="أقسام بوابة الطبيب"
          className="mx-auto flex max-w-[1120px] gap-[6px] px-[16px] pb-[10px] sm:px-[24px]"
        >
          {DOCTOR_LINKS.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-[16px] pb-[56px] pt-[20px] sm:px-[24px] sm:pt-[28px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
