import { useNavigate } from "react-router-dom";

const FooterCTA = () => {
    const navigate = useNavigate();

    return (
        <div
            dir="rtl"
            className="
                mx-auto
                flex
                w-full
                flex-col
                items-center
                gap-4
                rounded-2xl
                bg-[#4C2325]
                p-6
                text-white
                sm:p-8
                md:rounded-[24px]
                md:p-10
            "
        >
            {/* Heading */}
            <h2
                className="
                    w-full
                    text-center
                    font-[Tajawal]
                    text-[22px]
                    font-bold
                    leading-8
                    text-white
                    sm:text-[26px]
                    md:text-[30px]
                    md:leading-9
                "
            >
                جاهز لتبدأ رحلة بشرتك؟
            </h2>

            {/* Description */}
            <p
                className="
                    w-full
                    max-w-[500px]
                    text-center
                    font-[Tajawal]
                    text-[13px]
                    font-normal
                    leading-6
                    text-white
                    sm:text-[15px]
                    md:text-[16px]
                "
            >
                أنشئ حسابك خلال دقيقة واحجز أول موعد أو أرسل استشارتك الأولى.
            </p>

            {/* Buttons */}
            <div
                className="
                    flex
                    w-full
                    flex-col
                    gap-3
                    sm:w-auto
                    sm:flex-row
                "
            >
                <button
                    className="
                        flex
                        h-[42px]
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#D5C7AD]
                        bg-[#D5C7AD33]
                        px-6
                        py-2
                        font-[Tajawal]
                        text-[15px]
                        font-medium
                        text-white
                        sm:w-auto
                    "
                >
                    تواصل مع العيادة
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="
                        flex
                        h-[42px]
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#D5C7AD]
                        px-6
                        py-2
                        font-[Tajawal]
                        text-[15px]
                        font-bold
                        text-[#4C2325]
                        shadow-[0px_1px_2px_0px_#0000000D]
                        transition-colors
                        hover:bg-[#c5b79d]
                        sm:w-auto
                    "
                >
                    إنشاء حساب
                </button>
            </div>
        </div>
    );
};

export default FooterCTA;