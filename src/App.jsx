import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";
import ForgotPassword from "./Components/Features/Feature1-Auth/ForgotPassword";
import CheckEmail from './Components/Features/Feature1-Auth/CheckEmail';
// import Footer from "./Components/Features/Feature3/Footer";
// import BookingSteps from "./Components/Features/Feature3/BookingSteps";
// import Services from "./Components/Features/Feature3/Services";
// import WhyNadara from "./Components/Features/Feature3/WhyNadara";
// import Hero from "./Components/Features/Feature3/Hero";
// import Header from "./Layouts/Header";
import Dashboard from "./Pages/Dashboard";



function App() {
  return (
    <>


      {/* <BrowserRouter>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
        </Routes>
        <Header />
      </BrowserRouter> */}

      <Dashboard />

      {/* <Hero />
      <WhyNadara />
      <BookingSteps />
      <Services />
      <Footer /> */}
    </>
  );
}

export default App;