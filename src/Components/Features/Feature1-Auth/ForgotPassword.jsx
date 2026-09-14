import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";
import { Alert, Spinner } from "../../Common/Feedback";
import { auth } from "../../../services/api-client";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // البريد يصل جاهزًا من صفحة الدخول أو عند العودة من رابط إعادة تعيين منتهي الصلاحية.
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await auth.forgotPassword(email.trim());
      navigate("/check-email", { state: { email: email.trim() } });
    } catch (err) {
      // الخادم يرد بنفس الرسالة سواء كان البريد مسجلاً أم لا، فالأخطاء هنا: صيغة، أو 429، أو شبكة
      setError(err.fieldError?.("email") || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col" dir="rtl">
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-[446px] bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
          <Header title="استعادة كلمة المرور" subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لتعيين كلمة مرور جديدة" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col gap-1 text-right">
              <label htmlFor="forgot-email" className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                البريد الالكتروني
              </label>
              <input
                id="forgot-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-[50px] sm:h-[53px] px-[16px] border border-[#9E9E9E] rounded-[8px] text-[14px] focus:outline-none focus:border-[#4C2325]"
              />
            </div>

            <Alert>{error}</Alert>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#4C2325] hover:bg-[#36181A] text-white rounded-[8px] font-medium font-[Tajawal] text-[14px] sm:text-[16px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner className="h-[18px] w-[18px]" label="جاري الإرسال" />}
              {loading ? "جاري الإرسال..." : "إرسال رابط التعيين"}
            </button>
          </form>

          <div className="w-full min-h-[57px] py-[16px] px-4 sm:px-6 bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex flex-wrap items-center justify-center gap-1 text-center font-[Tajawal]">
            <span className="text-[13px] sm:text-[14px] text-[#4C2325]">تذكرت كلمة المرور؟</span>
            <Link to="/login" className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
