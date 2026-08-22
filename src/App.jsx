import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';
import Dashboard from './Components/Features/Feature2/Dashboard';
import AppointmentBooking from "./Components/Features/Feature4/AppointmentBooking";
import DermatologyConsultation from "./Components/Features/Feature5/DermatologyConsultation";


const isAuthenticated = () => !!localStorage.getItem('auth_token');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية للموقع (تظهر واجهة نضارة والخدمات أولاً) */}
        <Route path="/" element={<Dashboard />} />

        {/* مسارات المصادقة العامة */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />

        {/* مسار لوحة التحكم المحمي */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        {/* حجز موعد */}
        <Route
          path="/booking"
          element={<AppointmentBooking />}
        />

        {/* استشارة اونلاين */}
        <Route
          path="/online-consultation"
          element={<DermatologyConsultation />}
        />

        {/* توجيه أي مسار خاطئ إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
``
export default App;