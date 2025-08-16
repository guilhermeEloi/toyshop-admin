import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      toast.info("Sessão expirada. Faça login novamente.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
