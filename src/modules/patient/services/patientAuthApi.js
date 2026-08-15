import axios from "axios";

// استبدل الـ URL برابط الـ API الخاص بـ Backend فريقك
const API_BASE_URL = "https://api.nodhara.com/api/v1/patient";

export const patientAuthApi = {
  // تسجيل الدخول
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("patientToken", response.data.token);
      localStorage.setItem("patientUser", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // إنشاء حساب جديد
  register: async (patientData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, patientData);
    return response.data;
  },

  // استعادة كلمة المرور
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
      email,
    });
    return response.data;
  },

  // تسجيل الخروج
  logout: () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
  },
};
