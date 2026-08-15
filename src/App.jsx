import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Login from "./Components/Features/Feature1-Auth/Login";
import Register from "./Components/Features/Feature1-Auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;