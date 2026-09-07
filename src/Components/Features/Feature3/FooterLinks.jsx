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
                <li>
                    <a
                        href="#services"
                        className="font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]"
                    >
                        الخدمات
                    </a>
                </li>

                <li>
                    <a
                        href="#booking"
                        className="font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]"
                    >
                        حجز موعد
                    </a>
                </li>

                <li>
                    <a
                        href="#consultation"
                        className="font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]"
                    >
                        استشارة أونلاين
                    </a>
                </li>

                <li>
                    <a
                        href="#about"
                        className="font-[Tajawal] text-[14px] font-medium leading-5 text-[#4C2325]"
                    >
                        عن العيادة
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default FooterLinks;