import axios from "axios";

const api = axios.create({
  // Cambiamos localhost por tu URL real de Render
  baseURL: "https://tegridad-backend.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;