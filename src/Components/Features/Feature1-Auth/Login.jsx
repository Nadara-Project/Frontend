import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";
import { Alert, Spinner } from "../../Common/Feedback";
import { auth } from "../../../services/api-client";
import { useAuth } from "../../../hooks/useAuth";
import { useCountdown } from "../../../hooks/useCountdown";
import { homePathFor } from "../../../config/navigation";

const inputClass =
  "w-full h-[53px] px-[16px] border border-[#9E9E9E] rounded-[8px] text-[14px] focus:outline-none focus:border-[#4C2325]";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);

  // بعد 5 محاولات فاشلة يقفل الخادم الدخول مؤقتاً (429)، فنعرض عدّاداً بدل رسائل متكررة
  const lockSeconds = useCountdown(lockedUntil);
  const isLocked = lockSeconds !== null && lockSeconds > 0;

  // رسالة قادمة من مسار آخر (مثل نجاح تعيين كلمة المرور) لتأكيد ما تم للمستخدم.
  const notice = location.state?.notice ?? "";
  const requestedPath = location.state?.from;

  if (isAuthenticated && !isLoading) {
    return <Navigate to={requestedPath ?? homePathFor(user)} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLocked) return;

    setErrorMessage("");
    setIsLoading(true);

    try {
      // الأدمن يذهب للوحة الإدارة، والمريض للوحته، ما لم يطلب صفحة محددة
      const loggedInUser = await auth.login(email.trim(), password);
      navigate(requestedPath ?? homePathFor(loggedInUser), { replace: true });
    } catch (error) {
      if (error.status === 429) {
        const seconds = error.retryAfter ?? 60;
        setLockedUntil(new Date(Date.now() + seconds * 1000).toISOString());
        setErrorMessage("");
      } else {
        setErrorMessage(error.status === 422 ? error.fieldError("email") || error.message : error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col" dir="rtl">
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-[446px] bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
          <Header title="تسجيل الدخول" subtitle="مرحباً بك مجدداً في نضارة للجلدية والتجميل" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] px-4 pb-5 sm:px-6 sm:pb-6">
            {notice && !errorMessage && !isLocked && <Alert type="info">{notice}</Alert>}

            {isLocked ? (
              <Alert type="warning">
                محاولات دخول كثيرة. يمكنك المحاولة مجدداً بعد{" "}
                <span dir="ltr" className="font-bold">
                  {lockSeconds}
                </span>{" "}
                ثانية.
              </Alert>
            ) : (
              <Alert>{errorMessage}</Alert>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1 text-right">
              <label htmlFor="login-email" className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                البريد الالكتروني
              </label>
              <input
                id="login-email"
                autoComplete="email"
                type="email"
                dir="ltr"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 text-right">
              <label htmlFor="login-password" className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                كلمة المرور
              </label>

              <div className="relative flex items-center w-full">
                <input
                  id="login-password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pl-[45px]`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute left-[16px] text-[#9CA3AF] hover:text-[#4C2325] cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 text-[13px] sm:text-[14px] text-[#2B2527]">
              <Link
                to="/forgot-password"
                state={email ? { email: email.trim() } : undefined}
                className="hover:underline text-[#4C2325] font-medium"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full min-h-[48px] mt-2 flex items-center justify-center gap-2 bg-[#4C2325] hover:bg-[#36181A] text-white font-medium rounded-[8px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-[Tajawal] text-[14px] sm:text-[16px]"
            >
              {isLoading && <Spinner className="h-[18px] w-[18px]" label="جاري تسجيل الدخول" />}
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="w-full min-h-[57px] py-[16px] px-4 sm:px-6 bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex flex-wrap items-center justify-center gap-1 text-center">
            <span className="text-[13px] sm:text-[14px] text-[#4C2325]">ليس لديك حساب؟</span>
            <Link
              to="/register"
              state={location.state?.from ? { from: location.state.from } : undefined}
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
