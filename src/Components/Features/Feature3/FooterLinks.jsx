import { Link } from "react-router-dom";

const links = [
    { name: "الخدمات", path: "/services" },
    { name: "حجز موعد", path: "/booking" },
    { name: "استشارة أونلاين", path: "/online-consultation" },
    { name: "عن العيادة", path: "/about" },
];

const FooterLinks = () => {
    return (
        <div
            dir="rtl"
            className="flex w-full flex-col gap-4"
        >
            <h3
                className="
                    text-right
                    font-[Tajawal]
                    text-[16px]
                    font-bold
                    leading-6
                    text-[#4C2325]
                "
            >
                روابط سريعة
            </h3>

            <ul className="flex flex-col gap-3">
                {links.map((link) => (
                    <li key={link.path}>
                        <Link
                            to={link.path}
                            className="font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FooterLinks;
