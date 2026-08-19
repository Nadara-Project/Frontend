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
                    w-[600px]
                    h-[116px]
                    pt-[4px]
                    font-[Tajawal]
                    text-[48px]
                    font-bold
                    leading-[56px]
                    tracking-[0px]
                    text-right
                    text-[#4C2325]
                "
            >
                بشرتك تستحق عناية
                <br />
                منظمة ورقمية
            </h1>

            {/* Description */}
            <p
                className="
                     mt-[24px]
                     w-[600px]
                     h-[56px]
                     font-[Tajawal]
                     text-[18px]
                     font-normal
                     leading-[28px]
                     tracking-[0px]
                     text-right
                     text-[#4C2325]
    "
            >
                نظارة منصة عيادة رقمية التي تتيح لك حجز موعدك، ودفع قيمة الجلسة،
                وسؤال طبيبك عن بشرتك من منزلك - بدون طرق طويلة ولا انتظار في الصالة.
            </p>

            {/* Buttons */}
            <div
                className="
        flex
        w-[600px]
        h-[68px]
        gap-[16px]
        pt-[16px]
        pl-[227px]
        opacity-100
    "
            >
                {/* Primary Button */}
                <button
                    className="
                         flex
                         w-[188.36px]
                         h-[52px]
                         items-center
                         justify-center
                         gap-[8px]
                         rounded-[8px]
                         bg-[#4C2325]
                         px-[24px]
                         py-[12px]
                         font-[Tajawal]
                         text-[16px]
                         leading-[24px]
                         text-right
                         text-white
                         transition
                         hover:opacity-90
        "
                >
                    <span>احجز موعدك الآن</span>

                    <FiArrowLeft
                        className="
                h-[16px]
                w-[16px]
            "
                    />
                </button>


                {/* Secondary Button */}
                <button
                    className="
                           flex
                           w-[169px]
                           h-[52px]
                           items-center
                           justify-center
                           rounded-[8px]
                           border-[2px]
                           border-[#D5C7AD33]
                           bg-[#D5C7AD33]
                           px-[24px]
                           py-[12px]
                           font-[Tajawal]
                           text-[16px]
                           font-bold
                           leading-[24px]
                           text-right
                           text-[#4C2325]
                           transition
                           hover:bg-[#D5C7AD55]
    "
                >
                    استشارة أونلاين
                </button>
            </div>
        </div >
    );
};

export default HeroContent;