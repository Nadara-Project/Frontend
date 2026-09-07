import { FiArrowLeft } from "react-icons/fi";

const HeroContent = () => {
    return (
        <div
            className="
                flex
                w-full
                flex-col
                items-end
            "
        >
            {/* Main Heading */}
            <h1
                className="
                    w-full
                    font-[Tajawal]
                    text-[32px]
                    font-bold
                    leading-[42px]
                    text-right
                    text-[#4C2325]
                    sm:text-[40px]
                    sm:leading-[50px]
                    lg:text-[48px]
                    lg:leading-[56px]
                "
            >
                بشرتك تستحق عناية
                <br />
                منظمة ورقمية
            </h1>

            {/* Description */}
            <p
                className="
                    mt-5
                    w-full
                    font-[Tajawal]
                    text-[15px]
                    font-normal
                    leading-[24px]
                    text-right
                    text-[#4C2325]
                    sm:text-[16px]
                    sm:leading-[26px]
                    lg:mt-6
                    lg:text-[18px]
                    lg:leading-[28px]
                "
            >
                نظارة منصة عيادة رقمية التي تتيح لك حجز موعدك، ودفع قيمة الجلسة،
                وسؤال طبيبك عن بشرتك من منزلك - بدون طرق طويلة ولا انتظار في الصالة.
            </p>

            {/* Buttons */}
            <div
                className="
                    mt-4
                    flex
                    w-full
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:justify-سفشقف
                    sm:gap-4
                "
            >
                {/* Primary Button */}
                <button
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-[8px]
                        bg-[#4C2325]
                        px-6
                        py-3
                        font-[Tajawal]
                        text-[15px]
                        leading-[24px]
                        text-white
                        transition
                        hover:opacity-90
                        sm:w-auto
                        sm:min-w-[188px]
                        sm:text-[16px]
                    "
                >
                    <span>احجز موعدك الآن</span>

                    <FiArrowLeft className="h-4 w-4 shrink-0" />
                </button>

                {/* Secondary Button */}
                <button
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        rounded-[8px]
                        border-[2px]
                        border-[#D5C7AD33]
                        bg-[#D5C7AD33]
                        px-6
                        py-3
                        font-[Tajawal]
                        text-[15px]
                        font-bold
                        leading-[24px]
                        text-[#4C2325]
                        transition
                        hover:bg-[#D5C7AD55]
                        sm:w-auto
                        sm:min-w-[169px]
                        sm:text-[16px]
                    "
                >
                    استشارة أونلاين
                </button>
            </div>
        </div>
    );
};

export default HeroContent;