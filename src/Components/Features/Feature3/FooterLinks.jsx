const FooterLinks = () => {
    return (
        <div
            dir="rtl"
            className="flex h-[194.25px] w-[373.33px] flex-col gap-[16px] pb-[22.25px]"
        >
            <h3
                className="w-[373.33px] h-[24px] text-right font-[Tajawal] font-bold text-[16px] leading-[24px] tracking-[0px] text-[#4C2325]"
            >
                روابط سريعة
            </h3>

            <ul className="flex w-[373.33px] h-[132px] flex-col gap-[12px]">
                <li className="w-[373.33px] h-[24px] py-[2px]">
                    <a
                        href="#services"
                        className="font-[Tajawal] text-[14px] font-medium leading-[20px] tracking-[0px] text-right text-[#4C2325]"
                    >
                        الخدمات
                    </a>
                </li>

                <li className="w-full h-6 py-[2px]">
                    <a
                        href="#booking"
                        className="font-[Tajawal] text-[14px] font-medium leading-[20px] tracking-[0px] text-right text-[#4C2325]"
                    >
                        حجز موعد
                    </a>
                </li>

                <li className="w-full h-6 py-[2px]">
                    <a
                        href="#consultation"
                        className="font-[Tajawal] text-[14px] font-medium leading-[20px] tracking-[0px] text-right text-[#4C2325]"
                    >
                        استشارة أونلاين
                    </a>
                </li>

                <li className="w-full h-6 py-[2px]">
                    <a
                        href="#about"
                        className="font-[Tajawal] text-[14px] font-medium leading-[20px] tracking-[0px] text-right text-[#4C2325]"
                    >
                        عن العيادة
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default FooterLinks;