import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

const LoginRequired = () => {
    return (
        <section
            dir="rtl"
            className="w-full
                      
                      h-[448px]
                      pt-[96px]
                      pb-[96px]
                      bg-[#D5C7AD1A]
                      opacity-100"
        >
            <div className="
                    w-full
                    max-w-[1280px]
                    h-[256px]
                    mx-auto
                    pr-[24px]
                    pl-[24px]
                    opacity-100
  ">
                <div className="
                        w-full
                        max-w-[448px]
                        h-[256px]
                        mx-auto
                        flex
                        flex-col
                        items-center
                        gap-[12px]
                        opacity-100
  ">
                    {/* Icon */}
                    <div className="w-[80px]
                                   h-[80px]
                                   rounded-full
                                   bg-[#D5C7AD80]
                                   flex
                                   items-center
                                   justify-center">
                        <FiLogIn className="text-2xl text-[#4A294B]" />
                    </div>

                    <div className="w-full max-w-[448px]">
                        <h2
                            className="
                                   w-full
                                   h-[44px]
                                   pt-[12px]
                                   font-[Tajawal]
                                   text-[24px]
                                   font-bold
                                   leading-[32px]
                                   text-center
                                   text-[#4C2325]
        "
                        >
                            تسجيل الدخول مطلوب
                        </h2>
                    </div>

                    <div className="w-full h-[44px] pb-[20px]">
                        <p
                            className="
                                  w-full
                                  h-[24px]
                                  font-[Tajawal]
                                  text-[16px]
                                  font-normal
                                  leading-[24px]
                                  tracking-[0px]
                                  text-center
                                  text-[#4C2325]
        "
                        >
                            يرجى تسجيل الدخول للوصول إلى هذه الصفحة.
                        </p>
                    </div>

                    <Link
                        to="/login"
                        className="
                                w-[176.08px]
                                h-[52px]
                                pt-[12px]
                                pr-[32px]
                                pb-[12px]
                                pl-[32px]
                                rounded-[6px]
                                bg-[#4C2325]
                                shadow-[0px_1px_2px_0px_#0000000D]
                                flex
                                items-center
                                justify-center
    "
                    >
                        <span
                            className="
                                   w-[112.08px]
                                   h-[28px]
                                   font-[Tajawal]
                                   text-[18px]
                                   font-medium
                                   leading-[28px]
                                   tracking-[0px]
                                   text-center
                                   text-white
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