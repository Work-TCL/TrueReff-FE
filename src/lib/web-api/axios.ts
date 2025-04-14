import axiosPckg from "axios";
import { getToken } from "../utils/commonUtils";

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axios = axiosPckg.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Set token dynamically on each request
axios.interceptors.request.use(
  (config) => {
    const token = getToken(); // get fresh token each time
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: Handle 401 token expiry globally
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        // Optional: refresh token logic here
        // await signOut({
        //   callbackUrl: "/login",
        //   redirect: false,
        // });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
