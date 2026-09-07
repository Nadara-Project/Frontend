import { Link } from "react-router-dom";
import { FiAlertOctagon } from "react-icons/fi";

const LoginRequired = () => {
    return (
        <section
            dir="rtl"
            className="
                w-full
                bg-[#D5C7AD1A]
                px-[20px]
                py-[72px]
                sm:px-[24px]
                sm:py-[96px]
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[448px]
                    flex-col
                    items-center
                    gap-[12px]
                "
            >
                {/* Icon */}
                <div
                    className="
                        flex
                        h-[64px]
                        w-[64px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D5C7AD80]
                        sm:h-[80px]
                        sm:w-[80px]
                    "
                >
                    <FiAlertOctagon
                        className="
                            h-[32px]
                            w-[32px]
                            text-[#4A294B]
                            sm:h-[40px]
                            sm:w-[40px]
                        "
                    />
                </div>

                {/* Heading */}
                <h2
                    className="
                        w-full
                        pt-[8px]
                        font-[Tajawal]
                        text-[22px]
                        font-bold
                        leading-[32px]
                        text-center
                        text-[#4C2325]
                        sm:pt-[12px]
                        sm:text-[24px]
                    "
                >
                    تسجيل الدخول مطلوب
                </h2>

                {/* Description */}
                <p
                    className="
                        w-full
                        font-[Tajawal]
                        text-[15px]
                        font-normal
                        leading-[24px]
                        text-center
                        text-[#4C2325]
                        sm:text-[16px]
                    "
                >
                    يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
                </p>

                {/* Login Button */}
                <Link
                    to="/login"
                    className="
                        mt-[8px]
                        flex
                        h-[48px]
                        w-full
                        max-w-[176px]
                        items-center
                        justify-center
                        rounded-[6px]
                        bg-[#4C2325]
                        px-[24px]
                        py-[12px]
                        shadow-[0px_1px_2px_0px_#0000000D]
                    "
                >
                    <span
                        className="
                            whitespace-nowrap
                            font-[Tajawal]
                            text-[17px]
                            font-medium
                            leading-[28px]
                            text-center
                            text-white
                            sm:text-[18px]
                        "
                    >
                        تسجيل الدخول
                    </span>
                </Link>
            </div>
        </section>
    );
};

export default LoginRequired;