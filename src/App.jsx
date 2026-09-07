import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';
import ResetPassword from './Components/Features/Feature1-Auth/ResetPassword';
import Home from './Components/Features/Feature2/Dashboard';
// import PatientDashboard from './Components/Features/Feature4-Patient/PatientDashboard';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import AppointmentBooking from "./Components/Features/Feature4/AppointmentBooking";
import DermatologyConsultation from "./Components/Features/Feature5/DermatologyConsultation";
import AboutClinic from "./Components/Features/Feature6/AboutClinic";
import ServicesPage from "./Components/Features/Feature1-Auth/ServicesPage";
import ContactUs from "./Components/Features/Feature1-Auth/ContactUs";
import PatientProfile from "./Components/Features/Feature1-Auth/PatientProfile";
import BookAppointment from './Components/Features/Feature1-Auth/BookAppointment';
import AppointmentPayment from './Components/Features/Feature1-Auth/AppointmentPayment';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية للموقع (تظهر واجهة نضارة والخدمات أولاً) */}
        <Route path="/" element={<Home />} />

        {/* مسارات المصادقة العامة */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/AppointmentPayment" element={<AppointmentPayment />} />
        <Route path="/appointment-payment" element={<AppointmentPayment />} />

        {/* لوحة المريض بعد تسجيل الدخول */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />



        <Route
          path="/booking"
          element={<AppointmentBooking />}
        />

        <Route
          path="/online-consultation"
          element={<DermatologyConsultation />}
        />

        <Route
          path="/about"
          element={<AboutClinic />}
        />

        {/* توجيه أي مسار خاطئ إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;
