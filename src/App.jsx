import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';
import Dashboard from './Components/Features/Feature2/Dashboard';

// إذا أردتِ استيراد مكونات صديقتك لتظهر في الصفحة الرئيسية بعد الدخول:
// import Hero from "./Components/Features/Feature3/Hero";
// import Services from "./Components/Features/Feature3/Services";
// import Footer from "./Components/Features/Feature3/Footer";

const isAuthenticated = () => !!localStorage.getItem('auth_token');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* المسارات العامة لتسجيل الدخول وإنشاء الحساب */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        
        {/* مسار لوحة التحكم (الذي يظهر بعد تسجيل الدخول بنجاح) */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
          } 
        />

        {/* توجيه أي مسار خاطئ لصفحة تسجيل الدخول */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;