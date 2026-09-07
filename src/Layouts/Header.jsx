import { Link, NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import NadaraLogo from "../Components/Common/NadaraLogo";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        {
            name: "الرئيسية",
            path: "/",
        },
        {
            name: "الخدمات",
            path: "/services",
        },
        {
            name: "حجز موعد",
            path: "/booking",
        },
        {
            name: "استشارة أونلاين",
            path: "/online-consultation",
        },
        {
            name: "عن العيادة",
            path: "/about",
        },
        {
            name: "تواصل معنا",
            path: "/contact",
        },
    ];

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
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
                        w-[555px]
                        gap-[24px]
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
                                text-[16px]
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

                <div
                    className="
                        hidden
                        lg:flex
                        h-[40px]
                        items-center
                        gap-[16px]
                    "
                >
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className="
                                    flex
                                    h-[40px]
                                    items-center
                                    justify-center
                                    rounded-[8px]
                                    bg-[#4C2325]
                                    px-[16px]
                                    py-[8px]
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    leading-[24px]
                                    whitespace-nowrap
                                    text-white
                                    shadow-[0px_1px_2px_0px_#0000000D]
                                    transition
                                    hover:opacity-90
                                "
                            >
                                {user?.name?.trim().split(/\s+/)[0] ?? "حسابي"}
                            </NavLink>

                            <button
                                type="button"
                                onClick={logout}
                                aria-label="تسجيل الخروج"
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
                                    transition
                                    hover:bg-[#D5C7AD33]
                                "
                            >
                                <FiLogOut className="h-[18px] w-[18px]" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="
                                    flex
                                    h-[40px]
                                    w-[36px]
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
                className={`
                    fixed
                    right-0
                    top-0
                    z-[70]
                    h-screen
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
                <div
                    className="
                        mt-[24px]
                        flex
                        flex-row
                        gap-[12px]
                        border-t
                        border-[#D5C7AD33]
                        pt-[24px]
                    "
                >
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                onClick={closeMenu}
                                className="
                                    flex
                                    h-[44px]
                                    items-center
                                    justify-center
                                    rounded-[8px]
                                    bg-[#4C2325]
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    text-white
                                "
                            >
                                {user?.name?.trim().split(/\s+/)[0] ?? "حسابي"}
                            </NavLink>

                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                                className="
                                    flex
                                    h-[44px]
                                    items-center
                                    justify-center
                                    gap-[8px]
                                    rounded-[8px]
                                    border
                                    border-[#D5C7AD]
                                    font-[Tajawal]
                                    text-[16px]
                                    text-[#4C2325]
                                "
                            >
                                <FiLogOut />
                                تسجيل الخروج
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="
                                    flex
                                    flex-1
                                    min-w-0
                                    h-[44px]
                                    items-center
                                    justify-center
                                    rounded-[8px]
                                    border
                                    border-[#D5C7AD]
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    text-[#4C2325]
                                "
                            >
                                دخول
                            </Link>

                            <Link
                                to="/register"
                                onClick={closeMenu}
                                className="
                                    flex
                                     flex-1
                                    min-w-0
                                    h-[44px]
                                    items-center
                                    justify-center
                                    rounded-[8px]
                                    bg-[#4C2325]
                                    font-[Tajawal]
                                    text-[16px]
                                    font-medium
                                    text-white
                                "
                            >
                                إنشاء حساب
                            </Link>
                        </>
                    )}
                </div>

            </aside>
        </header>
    );
};

export default Header;