import { Link, NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import NadaraLogo from "../Components/Common/NadaraLogo";
import UserMenu from "../Components/Common/UserMenu";
import UserAvatar from "../Components/Common/UserAvatar";
import { ACCOUNT_LINKS } from "../config/navigation";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    // الروابط الأساسية في الناف بار. المسجّل يذهب مباشرة للنموذج،
    // فيبقى الرابط مُفعّلاً بصرياً بدل المرور بصفحة تحويل.
    const navLinks = [
        { name: "الرئيسية", path: "/" },
        { name: "الخدمات", path: "/services" },
        { name: "حجز موعد", path: isAuthenticated ? "/book-appointment" : "/booking" },
        { name: "استشارة أونلاين", path: isAuthenticated ? "/consultation-request" : "/online-consultation" },
        { name: "عن العيادة", path: "/about" },
        { name: "تواصل معنا", path: "/contact" },
    ];

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // القائمة الجانبية: إغلاق بزر Escape ومنع تمرير الصفحة خلفها
    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    return (
        <>
        <header
            dir="rtl"
            className="
                sticky
                top-0
                z-50
                w-full
                bg-white/95
                border-b
                border-b-[#D5C7AD33]
                backdrop-blur-[12px]
            "
        >
            {/* Header Main */}
            <div
                className="
                    mx-auto
                    flex
                    h-[72px]
                    w-full
                    max-w-[1280px]
                    items-center
                    justify-between
                    px-[20px]
                    lg:px-[32px]
                    lg:py-[16px]
                "
            >
                {/* Logo */}
                <Link to="/" onClick={closeMenu}>
                    <NadaraLogo
                        introTarget
                        className="
                            h-[45px]
                            w-auto
                            sm:h-[52px]
                        "
                    />
                </Link>

                {/* ================= DESKTOP NAV ================= */}
                <nav
                    className="
                        hidden
                        lg:flex
                        h-[30px]
                        gap-[20px]
                        items-center
                    "
                >
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `
                                flex
                                items-center
                                justify-end
                                whitespace-nowrap
                                font-[Tajawal]
                                text-[15px]
                                lg:text-[16px]
                                leading-[24px]
                                text-right
                                text-[#4C2325]
                                transition

                                ${isActive
                                    ? "font-bold border-b-[2px] border-[#4C2325] pb-[4px]"
                                    : "font-normal"
                                }
                                `
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* ================= DESKTOP AUTH ================= */}
                {/* المسجّل يرى زر الحساب (الصورة والاسم) وتسجيل الخروج داخل قائمته */}
                <div
                    className="
                        hidden
                        lg:flex
                        h-[44px]
                        items-center
                        gap-[16px]
                    "
                >
                    {isAuthenticated ? (
                        <UserMenu user={user} onLogout={logout} />
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="
                                    flex
                                    h-[40px]
                                    min-w-[36px]
                                    items-center
                                    justify-center
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    text-[#4C2325]
                                    transition
                                    hover:opacity-70
                                "
                            >
                                دخول
                            </Link>

                            <Link
                                to="/register"
                                className="
                                    flex
                                    h-[40px]
                                    w-[130px]
                                    items-center
                                    justify-center
                                    rounded-[8px]
                                    bg-[#4C2325]
                                    px-[16px]
                                    py-[8px]
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    text-white
                                    shadow-[0px_1px_2px_0px_#0000000D]
                                    transition
                                    hover:opacity-90
                                "
                            >
                                إنشاء حساب
                            </Link>
                        </>
                    )}
                </div>

                {/* ================= MOBILE MENU BUTTON ================= */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="فتح القائمة"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    className="
                        flex
                        h-[40px]
                        w-[40px]
                        items-center
                        justify-center
                        rounded-[8px]
                        border
                        border-[#D5C7AD]
                        text-[#4C2325]
                        lg:hidden
                    "
                >
                    <FiMenu className="h-[24px] w-[24px]" />
                </button>
            </div>
        </header>

            {/* القائمة والطبقة خارج <header>: الـ backdrop-blur يجعل الهيدر حاوية
                للعناصر fixed، فكانت الطبقة الداكنة تغطي 72px فقط بدل الشاشة كلها */}

            {/* ================= OVERLAY ================= */}
            {isMenuOpen && (
                <div
                    onClick={closeMenu}
                    className="
                        fixed
                        inset-0
                        z-[60]
                        bg-black/30
                        lg:hidden
                    "
                />
            )}

            {/* ================= MOBILE SIDE MENU ================= */}
            <aside
                id="mobile-menu"
                aria-label="القائمة"
                aria-hidden={!isMenuOpen}
                inert={!isMenuOpen}
                className={`
                    fixed
                    right-0
                    top-0
                    z-[70]
                    h-[100dvh]
                    overflow-y-auto
                    w-[280px]
                    max-w-[85vw]
                    bg-white
                    p-[24px]
                    shadow-[-4px_0_15px_rgba(0,0,0,0.15)]
                    transition-transform
                    duration-300
                    lg:hidden

                    ${isMenuOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    }
                `}
            >
                {/* Side Menu Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#D5C7AD33]
                        pb-[20px]
                    "
                >
                    <Link to="/" onClick={closeMenu}>
                        <NadaraLogo className="h-[40px] w-auto" />
                    </Link>

                    <button
                        type="button"
                        onClick={closeMenu}
                        aria-label="إغلاق القائمة"
                        className="
                            flex
                            h-[40px]
                            w-[40px]
                            items-center
                            justify-center
                            rounded-[8px]
                            text-[#4C2325]
                            hover:bg-[#D5C7AD33]
                        "
                    >
                        <FiX className="h-[24px] w-[24px]" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="mt-[24px] flex flex-col gap-[8px]">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `
                                flex
                                min-h-[48px]
                                w-full
                                items-center
                                rounded-[8px]
                                px-[16px]
                                font-[Tajawal]
                                text-[16px]
                                text-[#4C2325]
                                transition

                                ${isActive
                                    ? "bg-[#D5C7AD33] font-bold"
                                    : "font-normal hover:bg-[#D5C7AD1A]"
                                }
                                `
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Mobile Authentication */}
                {isAuthenticated ? (
                    <div className="mt-[20px] flex flex-col gap-[4px] border-t border-[#D5C7AD33] pt-[20px]">
                        <div className="mb-[8px] flex items-center gap-[10px] px-[8px]">
                            <UserAvatar user={user} className="h-[40px] w-[40px]" />
                            <div className="min-w-0">
                                <p className="truncate font-[Tajawal] text-[16px] font-medium text-[#2B2527]">
                                    {user?.name || "حسابي"}
                                </p>
                                {user?.email && (
                                    <p dir="ltr" className="truncate text-right font-[Tajawal] text-[12px] text-[#8A7F80]">
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {ACCOUNT_LINKS.map(({ to, label, Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex min-h-[44px] w-full items-center gap-[10px] rounded-[8px] px-[16px] font-[Tajawal] text-[15px] text-[#4C2325] transition ${
                                        isActive ? "bg-[#D5C7AD33] font-bold" : "hover:bg-[#D5C7AD1A]"
                                    }`
                                }
                            >
                                <Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                                {label}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex min-h-[44px] w-full cursor-pointer items-center gap-[10px] rounded-[8px] px-[16px] font-[Tajawal] text-[15px] text-[#B91C1C] transition hover:bg-[#FEF2F2]"
                        >
                            <FiLogOut className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />
                            تسجيل الخروج
                        </button>
                    </div>
                ) : (
                    <div className="mt-[24px] flex flex-row gap-[12px] border-t border-[#D5C7AD33] pt-[24px]">
                        <Link
                            to="/login"
                            onClick={closeMenu}
                            className="flex h-[44px] min-w-0 flex-1 items-center justify-center rounded-[8px] border border-[#D5C7AD] font-[Tajawal] text-[16px] font-medium text-[#4C2325]"
                        >
                            دخول
                        </Link>
                        <Link
                            to="/register"
                            onClick={closeMenu}
                            className="flex h-[44px] min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[#4C2325] font-[Tajawal] text-[16px] font-medium text-white"
                        >
                            إنشاء حساب
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Header;