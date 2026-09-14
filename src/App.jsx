import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Components/Features/Feature2/Dashboard';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import ScrollToTop from './Components/Common/ScrollToTop';
import { PageLoader } from './Components/Common/Feedback';
import { auth } from './services/api-client';

// الصفحة الرئيسية تُحمَّل مباشرة، وباقي الصفحات عند الحاجة فقط لتصغير الحزمة الأولى
const Login = lazy(() => import('./Components/Features/Feature1-Auth/Login'));
const Register = lazy(() => import('./Components/Features/Feature1-Auth/Register'));
const ForgotPassword = lazy(() => import('./Components/Features/Feature1-Auth/ForgotPassword'));
const CheckEmail = lazy(() => import('./Components/Features/Feature1-Auth/CheckEmail'));
const ResetPassword = lazy(() => import('./Components/Features/Feature1-Auth/ResetPassword'));
const ServicesPage = lazy(() => import('./Components/Features/Feature1-Auth/ServicesPage'));
const ContactUs = lazy(() => import('./Components/Features/Feature1-Auth/ContactUs'));
const AboutClinic = lazy(() => import('./Components/Features/Feature6/AboutClinic'));
const AppointmentBooking = lazy(() => import('./Components/Features/Feature4/AppointmentBooking'));
const DermatologyConsultation = lazy(() => import('./Components/Features/Feature5/DermatologyConsultation'));

const BookAppointment = lazy(() => import('./Components/Features/Feature1-Auth/BookAppointment'));
const AppointmentPayment = lazy(() => import('./Components/Features/Feature1-Auth/AppointmentPayment'));
const ConsultationRequest = lazy(() => import('./Components/Features/Feature5/ConsultationRequest'));
const ConsultationDetail = lazy(() => import('./Components/Features/Feature2/ConsultationDetail'));

const PatientLayout = lazy(() => import('./Components/Features/Feature2/PatientLayout'));
const MyAppointments = lazy(() => import('./Components/Features/Feature2/MyAppointments'));
const MyConsultations = lazy(() => import('./Components/Features/Feature2/MyConsultations'));
const PatientProfile = lazy(() => import('./Components/Features/Feature1-Auth/PatientProfile'));

const NotFound = lazy(() => import('./Components/Common/NotFound'));

const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] font-['Tajawal']" dir="rtl">
    <PageLoader />
  </div>
);

function App() {
  // التحقق من التوكن المخزّن عند فتح التطبيق: إن أُلغي من جهاز آخر تُمسح الجلسة فوراً
  useEffect(() => {
    auth.refreshUser().catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* الصفحة الرئيسية للموقع */}
          <Route path="/" element={<Home />} />

          {/* المصادقة */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* صفحات عامة */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutClinic />} />
          <Route path="/booking" element={<AppointmentBooking />} />
          <Route path="/online-consultation" element={<DermatologyConsultation />} />

          {/* الحجز والاستشارة والدفع: للمريض المسجّل فقط */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute patientOnly>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id/payment"
            element={
              <ProtectedRoute patientOnly>
                <AppointmentPayment kind="appointment" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultation-request"
            element={
              <ProtectedRoute patientOnly>
                <ConsultationRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations/:id/payment"
            element={
              <ProtectedRoute patientOnly>
                <AppointmentPayment kind="consultation" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations/:id"
            element={
              <ProtectedRoute>
                <ConsultationDetail />
              </ProtectedRoute>
            }
          />

          {/* لوحة المريض */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MyAppointments />} />
            <Route path="consultations" element={<MyConsultations />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* روابط قديمة */}
          <Route path="/user-profile" element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/appointment-payment" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
