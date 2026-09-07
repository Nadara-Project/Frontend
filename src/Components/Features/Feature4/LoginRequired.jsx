import { Link } from "react-router-dom";
import { FiAlertOctagon } from "react-icons/fi";

const LoginRequired = () => {
    return (
        <section
            dir="rtl"
            className="
                w-full
                bg-[#D5C7AD1A]
                px-[16px]
                py-[72px]
                sm:px-[24px]
                sm:py-[80px]
                lg:h-[448px]
                lg:px-[24px]
                lg:py-[96px]
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1280px]
                    justify-center
                "
            >
                <div
                    className="
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
                            h-[72px]
                            w-[72px]
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
                    <div className="w-full">
                        <h2
                            className="
                                w-full
                                font-[Tajawal]
                                text-[22px]
                                font-bold
                                leading-[32px]
                                text-center
                                text-[#4C2325]
                                sm:text-[24px]
                            "
                        >
                            تسجيل الدخول مطلوب
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="w-full">
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
                    </div>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="
                            mt-[4px]
                            flex
                            h-[52px]
                            w-full
                            max-w-[176px]
                            items-center
                            justify-center
                            rounded-[6px]
                            bg-[#4C2325]
                            px-[24px]
                            py-[12px]
                            shadow-[0px_1px_2px_0px_#0000000D]
                            transition
                            hover:opacity-90
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
            </div>
        </section>
    );
};

export default LoginRequired;