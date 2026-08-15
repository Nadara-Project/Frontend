import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;