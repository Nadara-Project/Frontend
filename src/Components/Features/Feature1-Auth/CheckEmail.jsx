import { Link } from "react-router-dom";
import Header from "./Header";
import { FiMail } from "react-icons/fi";

const CheckEmail = () => {
  return (
    <div
      className="
                min-h-screen
                w-full
                bg-[#F8F9FA]
                flex
                items-center
                justify-center
                px-4
                py-8
                sm:px-6
            "
      dir="rtl"
    >
      <div
        className="
                    w-full
                    max-w-[446px]
                    bg-white
                    rounded-[16px]
                    border
                    border-[#E2E8F0]
                    shadow-sm
                    flex
                    flex-col
                    overflow-hidden
                "
      >
        <Header
          title="تفقد بريدك الإلكتروني"
          subtitle="أرسلنا رابط إعادة ضبط كلمة المرور إلى بريدك الإلكتروني."
        />

        <div
          className="
                        w-full
                        flex
                        flex-col
                        items-center
                        text-center
                        px-4
                        pb-6
                        sm:px-6
                    "
        >
          <div
            className="
                            w-[72px]
                            h-[72px]
                            sm:w-[80px]
                            sm:h-[80px]
                            bg-[#D5C7AD]/20
                            rounded-full
                            flex
                            items-center
                            justify-center
                            mb-5
                        "
          >
            <FiMail className="w-9 h-9 sm:w-10 sm:h-10 text-[#4C2325]" />
          </div>

          <p
            className="
                            w-full
                            text-[13px]
                            sm:text-[14px]
                            leading-[22px]
                            text-[#4C2325]/80
                            mb-6
                        "
          >
            لم يصلك البريد؟ تأكد من مجلد الرسائل غير المرغوب فيها
            (Spam) أو أعد المحاولة.
          </p>

          <Link
            to="/forgot-password"
            className="
                            w-full
                            h-[48px]
                            bg-[#4C2325]
                            hover:bg-[#36181A]
                            text-white
                            font-medium
                            text-[14px]
                            rounded-[8px]
                            flex
                            items-center
                            justify-center
                            transition-colors
                            font-[Tajawal]
                        "
          >
            إعادة الإرسال
          </Link>
        </div>

        <div
          className="
                        w-full
                        min-h-[57px]
                        py-4
                        px-4
                        sm:px-6
                        bg-[#4C2325]/10
                        border-t
                        border-[#D5C7AD]/20
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-1
                        text-center
                    "
        >
          <span className="text-[13px] sm:text-[14px] text-[#4C2325]">
            تذكرت كلمة المرور؟
          </span>

          <Link
            to="/login"
            className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline"
          >
            تسجيل دخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;