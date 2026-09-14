import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MainHeader from "../../../Layouts/Header";
import Header from "./Header";
import FormField from "./FormField";
import { Alert, Spinner } from "../../Common/Feedback";
import { auth } from "../../../services/api-client";
import { useAuth } from "../../../hooks/useAuth";
import { todayInClinic } from "../../../utils/format";

// نفس قواعد RegisterRequest في الباك إند، حتى لا يُرفض ما قبلته الواجهة
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

const schema = yup.object({
  name: yup.string().trim().required("الاسم مطلوب").min(2, "الاسم يجب أن يكون حرفين على الأقل").max(255, "الاسم طويل جداً"),

  email: yup.string().trim().required("البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),

  phone: yup.string().trim().required("رقم الهاتف مطلوب").matches(PHONE_PATTERN, "رقم الهاتف غير صحيح"),

  date_of_birth: yup
    .string()
    .required("تاريخ الميلاد مطلوب")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الميلاد غير صحيح")
    .test("past", "تاريخ الميلاد يجب أن يكون قبل اليوم", (value) => !value || value < todayInClinic())
    .test("realistic", "تأكد من سنة الميلاد", (value) => !value || Number(value.slice(0, 4)) > new Date().getFullYear() - 120),

  gender: yup.string().oneOf(["male", "female"], "الرجاء اختيار الجنس").required("الجنس مطلوب"),

  password: yup.string().required("كلمة المرور مطلوبة").min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),

  confirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
});

const serverFieldMap = {
  name: "name",
  email: "email",
  phone: "phone",
  password: "password",
  password_confirmation: "confirmPassword",
  birth_date: "date_of_birth",
  gender: "gender",
};

const Register = () => {
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectTo = location.state?.from ?? "/dashboard";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated && !isSubmitting) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setFormError("");

    try {
      await auth.register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        birth_date: values.date_of_birth,
        gender: values.gender,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error.status === 422) {
        let mapped = 0;
        Object.entries(error.errors).forEach(([serverField, messages]) => {
          const field = serverFieldMap[serverField];
          if (field) {
            setError(field, { type: "server", message: messages[0] });
            mapped += 1;
          }
        });
        setFormError(mapped ? "يرجى مراجعة الحقول المظللة." : error.message);
      } else {
        setFormError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col" dir="rtl">
      <MainHeader />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-[446px] bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
          <Header title="إنشاء حساب" subtitle="مرحباً بك في نضارة للجلدية والتجميل" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[16px] px-4 pb-5 sm:px-6 sm:pb-6">
            <Alert>{formError}</Alert>

            <FormField label="الاسم" placeholder="الاسم الكامل" autoComplete="name" field={register("name")} error={errors.name?.message} />

            <FormField
              label="البريد الالكتروني"
              type="email"
              dir="ltr"
              placeholder="example@gmail.com"
              autoComplete="email"
              field={register("email")}
              error={errors.email?.message}
            />

            <FormField
              label="رقم الهاتف"
              type="tel"
              dir="ltr"
              inputMode="tel"
              placeholder="0599123456"
              autoComplete="tel"
              field={register("phone")}
              error={errors.phone?.message}
            />

            <FormField
              label="تاريخ الميلاد"
              type="date"
              max={todayInClinic()}
              autoComplete="bday"
              field={register("date_of_birth")}
              error={errors.date_of_birth?.message}
            />

            <div className="flex flex-col gap-1 text-right">
              <label htmlFor="register-gender" className="text-[13px] sm:text-[14px] font-medium text-[#2B2527]">
                الجنس
              </label>
              <select
                id="register-gender"
                {...register("gender")}
                aria-invalid={errors.gender ? "true" : "false"}
                className={`w-full h-[50px] sm:h-[53px] px-3 border rounded-[8px] outline-none text-[14px] bg-white ${
                  errors.gender ? "border-red-400 focus:border-red-500" : "border-[#9E9E9E] focus:border-[#4C2325]"
                }`}
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              {errors.gender && (
                <span role="alert" className="text-red-600 text-[12px]">
                  {errors.gender.message}
                </span>
              )}
            </div>

            <FormField
              label="كلمة المرور"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              hint="8 أحرف على الأقل، ويُفضّل أن تحتوي على حرف كبير وصغير ورقم"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] px-4 mt-2 flex items-center justify-center gap-2 bg-[#4C2325] hover:bg-[#36181A] text-white font-medium rounded-[8px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-[Tajawal] text-[14px] sm:text-[16px]"
            >
              {isSubmitting && <Spinner className="h-[18px] w-[18px]" label="جاري إنشاء الحساب" />}
              {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          <div className="w-full min-h-[57px] py-[16px] px-4 sm:px-6 bg-[#4C2325]/10 border-t border-[#D5C7AD]/20 flex flex-wrap items-center justify-center gap-1 text-center font-[Tajawal]">
            <span className="text-[13px] sm:text-[14px] text-[#4C2325]">لديك حساب بالفعل؟</span>
            <Link
              to="/login"
              state={location.state?.from ? { from: location.state.from } : undefined}
              className="font-bold text-[13px] sm:text-[14px] text-[#4C2325] hover:underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
