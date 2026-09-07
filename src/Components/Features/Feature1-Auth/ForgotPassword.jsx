import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainHeader from "../../../Layouts/Header";
import { auth } from "../../../services/api-client";

const ForgotPassword = () => {
  const location = useLocation();

  // البريد يصل جاهزًا عند العودة من رابط إعادة تعيين منتهي الصلاحية.
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await auth.forgotPassword(email);
      navigate("/check-email");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
          "حدث خطأ ما، يرجى المحاولة مرة أخرى."
        );
      } else {
        setError(
          "تعرّض الاتصال للخلل، تأكد من البريد الإلكتروني."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
                min-h-screen
                w-full
                bg-[#F8F9FA]
                flex
                flex-col
            "
      dir="rtl"
    >
      <MainHeader />

      <main
        className="
                    flex-1
                    w-full
                    flex
                    items-center
                    justify-center
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
      >
        <div
          className="
                        w-full
                        max-w-[446px]
                        bg-white
                        rounded-[16px]
                        border
                        border-[#E2E8F0]
                        p-5
                        sm:p-6
                        shadow-sm
                    "
        >
          <div className="text-center mb-6">
            <h1
              className="
                                text-[21px]
                                sm:text-[24px]
                                leading-[30px]
                                sm:leading-[32px]
                                font-bold
                                text-[#4C2325]
                                font-[Tajawal]
                            "
            >
              استعادة كلمة المرور
            </h1>

            <p
              className="
                                text-[13px]
                                sm:text-[14px]
                                leading-[22px]
                                text-gray-500
                                font-[Tajawal]
                                mt-1
                            "
            >
              أدخل بريدك لإرسال رابط التعيين
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              dir="ltr"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                                w-full
                                h-[50px]
                                sm:h-[53px]
                                px-[16px]
                                border
                                border-[#9E9E9E]
                                rounded-[8px]
                                text-[14px]
                                focus:outline-none
                                focus:border-[#4C2325]
                            "
            />

            {error && (
              <span className="text-red-500 text-[12px] leading-[18px]">
                {error}
              </span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                                w-full
                                min-h-[48px]
                                bg-[#4C2325]
                                text-white
                                rounded-[8px]
                                font-medium
                                font-[Tajawal]
                                text-[14px]
                                sm:text-[16px]
                                transition
                                hover:opacity-90
                                disabled:opacity-50
                            "
            >
              {loading ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;