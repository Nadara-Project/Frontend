import React from 'react';
import { useNavigate } from 'react-router-dom';

const FooterCTA = () => {
    const navigate = useNavigate();

    return (
        <div
            dir="rtl"
            className="
                mx-auto
                flex
                h-[230px]
                w-[1216px]
                flex-col
                gap-[16px]
                rounded-[24px]
                bg-[#4C2325]
                p-[40px]
                text-white
            "
        >
            {/* Heading 2 */}
            <h2
                className="
                    h-[36px]
                    w-[1136px]
                    text-center
                    font-[Tajawal]
                    text-[30px]
                    font-bold
                    leading-[36px]
                    tracking-[0px]
                    text-[#FFFFFF]
                "
            >
                جاهز لتبدأ رحلة بشرتك؟
            </h2>

            {/* Description */}
            <div className="h-[24px] w-[1136px]">
                <p
                    className="
                        h-[24px]
                        w-[445px]
                        mx-auto
                        text-center
                        font-[Tajawal]
                        text-[16px]
                        font-normal
                        leading-[24px]
                        tracking-[0px]
                        text-[#FFFFFF]
                    "
                >
                    أنشئ حسابك خلال دقيقة واحجز أول موعد أو أرسل استشارتك الأولى.
                </p>
            </div>

            {/* Buttons Container */}
            <div
                className="
                    flex
                    h-[58px]
                    w-[1136px]
                    flex-row
                    justify-center
                    gap-[16px]
                    pt-[16px]
                "
            >
                {/* تواصل مع العيادة */}
                <button
                    className="
                        flex
                        h-[42px]
                        w-[168.91px]
                        items-center
                        justify-center
                        rounded-[8px]
                        border
                        border-[#D5C7AD]
                        bg-[#D5C7AD33]
                        px-[24px]
                        py-[8px]
                        cursor-pointer
                    "
                >
                    <span
                        className="
                            h-[24px]
                            w-[118.91px]
                            text-center
                            font-[Tajawal]
                            text-[16px]
                            font-medium
                            leading-[24px]
                            tracking-[0px]
                            text-[#FFFFFF]
                        "
                    >
                        تواصل مع العيادة
                    </span>
                </button>

                {/* إنشاء حساب - يوجه لصفحة التسجيل */}
                <button
                    onClick={() => navigate('/register')}
                    className="
                        flex
                        h-[42px]
                        w-[141px]
                        items-center
                        justify-center
                        rounded-[8px]
                        bg-[#D5C7AD]
                        px-[24px]
                        py-[8px]
                        shadow-[0px_1px_2px_0px_#0000000D]
                        cursor-pointer
                        hover:bg-[#c5b79d]
                        transition-colors
                    "
                >
                    <span
                        className="
                            h-[24px]
                            w-[93px]
                            text-center
                            font-[Tajawal]
                            text-[16px]
                            font-bold
                            leading-[24px]
                            tracking-[0px]
                            text-[#4C2325]
                        "
                    >
                        إنشاء حساب
                    </span>
                </button>
            </div>
        </div>
    );
};

export default FooterCTA;