import { Link, NavLink } from "react-router-dom";

const Header = () => {
    const navLinks = [
        {
            name: "الرئيسية",
            path: "/",
            width: "w-[61px]",
            height: "h-[30px]",
            fontWeight: "font-bold",
        },
        {
            name: "الخدمات",
            path: "/services",
            width: "w-[55px]",
            height: "h-[24px]",
            fontWeight: "font-normal",
        },
        {
            name: "حجز موعد",
            path: "/booking",
            width: "w-[64px]",
            height: "h-[24px]",
            fontWeight: "font-normal",
        },
        {
            name: "استشارة أونلاين",
            path: "/online-consultation",
            width: "w-[107px]",
            height: "h-[24px]",
            fontWeight: "font-normal",
        },
        {
            name: "عن العيادة",
            path: "/about",
            width: "w-[70px]",
            height: "h-[24px]",
            fontWeight: "font-normal",
        },
        {
            name: "تواصل معنا",
            path: "/contact",
            width: "w-[78px]",
            height: "h-[24px]",
            fontWeight: "font-normal",
        },
    ];

    return (
        <header
            dir="rtl"
            className="
                sticky
                top-0
                z-50
                w-full
                h-[105px]
                bg-white/95
                border-b
                border-b-[#D5C7AD33]
                backdrop-blur-[12px]
            "
        >
            <div
                className="
                    w-full
                    max-w-[1280px]
                    h-[72px]
                    mx-auto
                    px-[32px]
                    py-[16px]
                    flex
                    items-center
                    justify-between
                "
            >
                {/* Logo */}
                <Link to="/">
                    <img
                        src="/Logo.svg"
                        alt="NADARA نظارة"
                        className="
                            h-[52px]
                            w-auto
                            object-contain
                        "
                    />
                </Link>

                {/* Navigation */}
                <nav
                    className="
                        w-[555px]
                        h-[30px]
                        flex
                        gap-[24px]
                        opacity-100
                    "
                >
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `
                                    ${link.width}
                                    ${link.height}
                                    flex
                                    items-center
                                    justify-end
                                    font-[Tajawal]
                                    text-[16px]
                                    ${link.fontWeight}
                                    leading-[24px]
                                    tracking-[0px]
                                    text-right
                                    text-[#4C2325]
                                    whitespace-nowrap
                                    transition
                                    ${
                                        isActive
                                            ? "pb-[4px] border-b-[2px] border-[#4C2325]"
                                            : ""
                                    }
                                `
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Authentication */}
                <div className="w-[172.08px] h-[40px] flex gap-[16px]">
                    
                    {/* Login */}
                    <Link
                        to="/login"
                        className="
                            flex
                            w-[36px]
                            h-[40px]
                            items-center
                            justify-center
                            font-[Tajawal]
                            text-[16px]
                            font-medium
                            leading-[24px]
                            text-right
                            text-[#4C2325]
                            transition
                            hover:opacity-70
                        "
                    >
                        دخول
                    </Link>

                    {/* Register */}
                    <Link
                        to="/register"
                        className="
                            flex
                            w-[120.08px]
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
                            text-right
                            text-white
                            shadow-[0px_1px_2px_0px_#0000000D]
                            transition
                            hover:opacity-90
                        "
                    >
                        إنشاء حساب
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;