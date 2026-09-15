import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import NadaraLogo from '../../Common/NadaraLogo';
import UserMenu from '../../Common/UserMenu';
import { useAuth } from '../../../hooks/useAuth';
import { ADMIN_LINKS } from '../../../config/navigation';

const navClass = ({ isActive }) =>
  `flex h-[44px] min-w-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-[10px] px-[6px] text-[14px] transition-colors sm:gap-[10px] sm:px-[14px] sm:text-[15px] lg:justify-start ${
    isActive ? 'bg-[#4C2325] font-[700] text-white' : 'font-[500] text-[#4C2325] hover:bg-[#D5C7AD33]'
  }`;

/**
 * إطار لوحة إدارة المنصة: شريط علوي خاص بالإدارة، وقائمة جانبية على الشاشات الكبيرة
 * تتحول إلى تبويبات أفقية على الموبايل.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F6F2ED] text-right font-['Tajawal'] text-[#2B2527]" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-[#E9E2DA] bg-white">
        <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between gap-[12px] px-[16px] sm:px-[24px]">
          <div className="flex min-w-0 items-center gap-[12px]">
            <Link to="/admin" aria-label="لوحة الإدارة">
              <NadaraLogo className="h-[38px] w-auto" />
            </Link>
            <span className="hidden rounded-full bg-[#4C2325] px-[10px] py-[2px] text-[12px] font-[700] text-white sm:inline">
              لوحة الإدارة
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
      </header>

      <div className="mx-auto flex max-w-[1320px] flex-col gap-[20px] px-[16px] pb-[56px] pt-[16px] sm:px-[24px] lg:flex-row lg:gap-[28px] lg:pt-[28px]">
        <aside className="lg:w-[220px] lg:shrink-0">
          <nav
            aria-label="أقسام الإدارة"
            className="grid grid-cols-3 gap-[4px] rounded-[12px] border border-[#E9E2DA] bg-white p-[4px] lg:sticky lg:top-[92px] lg:flex lg:flex-col lg:gap-[6px] lg:border-0 lg:bg-transparent lg:p-0"
          >
            {ADMIN_LINKS.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navClass}>
                <Icon className="hidden h-[18px] w-[18px] shrink-0 min-[400px]:block" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
