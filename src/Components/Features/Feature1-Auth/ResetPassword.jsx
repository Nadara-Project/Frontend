import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiAlertTriangle, FiCheck, FiLock } from "react-icons/fi";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";
import FormField from "./FormField";
import { auth } from "../../../services/api-client";

const schema = yup.object({
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),

  confirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
});

const serverFieldMap = {
  password: "password",
  password_confirmation: "confirmPassword",
};

/**
 * أخطاء التوكن يعيدها الخادم تحت مفتاح "email" (سلوك وسيط كلمات المرور في Laravel).
 * في هذه الحالة لا فائدة من إعادة المحاولة على نفس الرابط، لذلك نعرض حالة
 * "رابط غير صالح" مع مسار واضح لطلب رابط جديد بدل رسالة خطأ غامضة داخل النموذج.
 */
const isLinkError = (error) =>
  error.status === 422 && Boolean(error.fieldError?.("email"));

const RequirementItem = ({ met, children }) => (
  <li
    className={`
            flex
            items-center
            gap-2
            text-[12px]
            leading-[20px]
            ${met ? "text-[#4C2325]" : "text-[#4C2325]/50"}
        `}
  >
    <span
      aria-hidden="true"
      className={`
                flex
                h-[16px]
                w-[16px]
                shrink-0
                items-center
                justify-center
                rounded-full
                transition-colors
                ${met ? "bg-[#4C2325] text-white" : "bg-[#D5C7AD]/30 text-transparent"}
            `}
    >
      <FiCheck size={11} />
    </span>

    {children}
  </li>
);

/**
 * شاشة توضيحية تُستخدم عندما يكون الرابط ناقصًا أو منتهي الصلاحية،
 * بنفس هوية بطاقات المصادقة.
 */
const InvalidLinkCard = ({ email, message }) => (
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
      title="الرابط غير صالح"
      subtitle="انتهت صلاحية رابط إعادة التعيين أو تم استخدامه مسبقًا."
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
        <FiAlertTriangle className="w-9 h-9 sm:w-10 sm:h-10 text-[#4C2325]" />
      </div>

      <p
        role="alert"
        className="
                    w-full
                    text-[13px]
                    sm:text-[14px]
                    leading-[22px]
                    text-[#4C2325]/80
                    mb-6
                "
      >
        {message ??
          "رابط إعادة تعيين كلمة المرور صالح لمدة ساعة واحدة فقط. اطلب رابطًا جديدًا للمتابعة."}
      </p>

      <Link
        to="/forgot-password"
        state={email ? { email } : undefined}
        className="
                    w-full
                    min-h-[48px]
                    px-4
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
        طلب رابط جديد
      </Link>
    </div>

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
                font-[Tajawal]
            "
    >
      <span className="text-[13px] sm:text-[14px] text-[#4C2325]">
        تذكرت كلمة المرور؟
      </span>

      <Link
        to="/login"
        className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline"
      >
        تسجيل الدخول
      </Link>
    </div>
  </div>
);

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";
  const email = (searchParams.get("email") ?? "").trim();

  const [formError, setFormError] = useState("");
  const [linkError, setLinkError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });

  // قائمة حيّة بمتطلبات كلمة المرور: تخبر المستخدم بما ينقصه قبل الإرسال لا بعده.
  const requirements = [
    {
      key: "length",
      label: "8 أحرف على الأقل",
      met: password.length >= 8,
    },
    {
      key: "match",
      label: "كلمتا المرور متطابقتان",
      met: password.length > 0 && password === confirmPassword,
    },
  ];

  const onSubmit = async (values) => {
    setFormError("");

    try {
      await auth.resetPassword({
        token,
        email,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      });

      // الخادم يُبطل كل الجلسات بعد التغيير، لذلك نعيده لتسجيل الدخول برسالة نجاح واضحة.
      navigate("/login", {
        replace: true,
        state: {
          notice:
            "تم تغيير كلمة المرور بنجاح، سجّل الدخول بكلمة المرور الجديدة.",
        },
      });
    } catch (error) {
      if (isLinkError(error)) {
        setLinkError(error.fieldError("email"));
        return;
      }

      if (error.status === 422) {
        Object.entries(error.errors).forEach(([serverField, messages]) => {
          const field = serverFieldMap[serverField];

          if (field) {
            setError(field, {
              type: "server",
              message: messages[0],
            });
          }
        });

        setFormError(error.message || "يرجى مراجعة البيانات المدخلة.");
        return;
      }

      if (error.status === 429) {
        setFormError("عدد المحاولات كبير، انتظر قليلًا ثم أعد المحاولة.");
        return;
      }

      setFormError(
        error.message || "تعذّر تغيير كلمة المرور، يرجى المحاولة مرة أخرى."
      );
    }
  };

  // رابط ناقص (فُتح يدويًا) أو مرفوض من الخادم: لا نعرض نموذجًا لا يمكن إرساله.
  const isLinkUsable = Boolean(token && email) && !linkError;

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col" dir="rtl">
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {!isLinkUsable ? (
          <InvalidLinkCard email={email} message={linkError || undefined} />
        ) : (
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
              title="تعيين كلمة مرور جديدة"
              subtitle="اختر كلمة مرور جديدة لحسابك في نضارة"
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
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
              {formError && (
                <div
                  role="alert"
                  className="
                                        w-full
                                        p-3
                                        bg-red-50
                                        border
                                        border-red-200
                                        rounded-[8px]
                                        text-red-600
                                        text-[13px]
                                        text-center
                                    "
                >
                  {formError}
                </div>
              )}

              {/* الحساب المستهدف ظاهر للتأكيد فقط، ولا يُعدّل لأنه مرتبط بالتوكن. */}
              <div
                className="
                                    w-full
                                    flex
                                    items-center
                                    gap-2
                                    rounded-[8px]
                                    bg-[#4C2325]/[0.06]
                                    border
                                    border-[#D5C7AD]/40
                                    px-[16px]
                                    py-[12px]
                                "
              >
                <FiLock
                  className="shrink-0 text-[#4C2325]"
                  size={16}
                  aria-hidden="true"
                />

                <span className="text-[13px] text-[#4C2325]/80">الحساب:</span>

                <span
                  dir="ltr"
                  className="text-[13px] font-medium text-[#4C2325] truncate"
                >
                  {email}
                </span>
              </div>

              {/* حقل مخفي يساعد مدراء كلمات المرور على ربط الحساب بكلمة المرور الجديدة. */}
              <input
                type="email"
                value={email}
                autoComplete="username"
                readOnly
                hidden
                tabIndex={-1}
                aria-hidden="true"
              />

              <FormField
                label="كلمة المرور الجديدة"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                autoFocus
                field={register("password")}
                error={errors.password?.message}
              />

              <FormField
                label="تأكيد كلمة المرور"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                field={register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              <ul className="w-full flex flex-col gap-1">
                {requirements.map((requirement) => (
                  <RequirementItem key={requirement.key} met={requirement.met}>
                    {requirement.label}
                  </RequirementItem>
                ))}
              </ul>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                                    w-full
                                    min-h-[48px]
                                    px-4
                                    bg-[#4C2325]
                                    hover:bg-[#36181A]
                                    text-white
                                    font-medium
                                    rounded-[8px]
                                    transition-colors
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    mt-2
                                    font-[Tajawal]
                                    text-[14px]
                                    sm:text-[16px]
                                "
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ كلمة المرور"}
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
                                font-[Tajawal]
                            "
            >
              <span className="text-[13px] sm:text-[14px] text-[#4C2325]">
                تذكرت كلمة المرور؟
              </span>

              <Link
                to="/login"
                className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResetPassword;
