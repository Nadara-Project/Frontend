import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";
import { auth } from "../../../services/api-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // رسالة قادمة من مسار آخر (مثل نجاح تعيين كلمة المرور) لتأكيد ما تم للمستخدم.
  const notice = location.state?.notice ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // auth.login تُرجع كائن الـ user مباشرة بناءً على التعديل في api-client.js
      const user = await auth.login(email, password);

      // تحديد مسار التوجيه بناءً على دور المستخدم (role) أو الاعتماد على location.state قادم من صفحة محمية
      let defaultRedirect = "/dashboard";
      if (user?.role === "admin") {
        defaultRedirect = "/admin/dashboard"; // أو لوحة تحكم الأدمن الخاصة بكِ
      } else if (user?.role === "doctor") {
        defaultRedirect = "/doctor/dashboard"; // أو لوحة تحكم الدكتور
      } else if (user?.role === "patient") {
        defaultRedirect = "/patient/profile"; // أو صفحة المريض
      }

      const finalRedirect = location.state?.from ?? defaultRedirect;
      navigate(finalRedirect, { replace: true });
    } catch (error) {
      if (error.status === 422) {
        setErrorMessage(
          error.fieldError("email") ||
          "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );
      } else {
        setErrorMessage(
          error.message || "حدث خطأ أثناء تسجيل الدخول."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#F8F9FA] flex flex-col"
      dir="rtl"
    >
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
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
            title="تسجيل الدخول"
            subtitle="مرحباً بك مجدداً في نضارة للجلدية والتجميل"
          />

          <form
            onSubmit={handleSubmit}
            className="
                                    flex
                                    flex-col
                                    gap-[16px]
                                    px-4
                                    pb-5
                                    sm:px-6
                                    sm:pb-6
                                "
          >
            {notice && !errorMessage && (
              <div
                role="status"
                className="w-full p-3 bg-[#D5C7AD]/20 border border-[#D5C7AD] rounded-[8px] text-[#4C2325] text-[13px] text-center"
              >
                {notice}
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="w-full p-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-[13px] text-center"
              >
                {errorMessage}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1 text-right">
              <label className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                البريد الالكتروني
              </label>

              <input
                type="email"
                dir="ltr"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                                            w-full
                                            h-[53px]
                                            px-[16px]
                                            border
                                            border-[#9E9E9E]
                                            rounded-[8px]
                                            text-[14px]
                                            focus:outline-none
                                            focus:border-[#4C2325]
                                        "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 text-right">
              <label className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                كلمة المرور
              </label>

              <div className="relative flex items-center w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                                                w-full
                                                h-[53px]
                                                px-[16px]
                                                pl-[45px]
                                                border
                                                border-[#9E9E9E]
                                                rounded-[8px]
                                                text-[14px]
                                                focus:outline-none
                                                focus:border-[#4C2325]
                                            "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute left-[16px] text-[#9CA3AF]"
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div
              className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-3
                                    text-[13px]
                                    sm:text-[14px]
                                    text-[#2B2527]
                                "
            >
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 accent-[#4C2325]"
                />
                تذكرني
              </label>

              <Link
                to="/forgot-password"
                className="hover:underline text-[#4C2325] font-medium"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                                            w-full
                                            min-h-[48px]
                                            bg-[#4C2325]
                                            hover:bg-[#36181A]
                                            text-white
                                            font-medium
                                            rounded-[8px]
                                            transition-colors
                                            cursor-pointer
                                            disabled:opacity-50
                                            mt-2
                                            font-[Tajawal]
                                            text-[14px]
                                            sm:text-[16px]
                                        "
            >
              {isLoading
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>
          </form>

          <div
            className="
                            w-full
                            min-h-[57px]
                            py-[16px]
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
              ليس لديك حساب؟
            </span>

            <Link
              to="/register"
              className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;