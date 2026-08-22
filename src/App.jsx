import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';
import Home from './Components/Features/Feature2/Dashboard';
import PatientDashboard from './Components/Features/Feature4-Patient/PatientDashboard';
import ProtectedRoute from './Components/Common/ProtectedRoute';

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

        {/* لوحة المريض بعد تسجيل الدخول */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* توجيه أي مسار خاطئ إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
