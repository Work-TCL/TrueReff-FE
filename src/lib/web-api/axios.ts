import axiosPckg from "axios";
import { getToken } from "../utils/commonUtils";
import { signOut } from "next-auth/react";

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
    if (error?.status === 401) {
      try {
        // Optional: refresh token logic here
        await signOut({
          callbackUrl: "/login",
          redirect: true,
        });
        if (typeof window !== undefined) window.location.href = "/login";
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
