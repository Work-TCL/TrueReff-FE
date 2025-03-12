import {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError as OriginalAxiosError,
} from "axios";
import axios from "./axios";
import { getServerSession } from "next-auth";
import authOptions from "../config/authOptions";

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const axiosInstance = axios;

const isServer = typeof window === "undefined"; // ✅ Check if it's a server environment

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  async (
    request: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      let token: string | undefined;

      if (isServer) {
        // ✅ Use server-side session retrieval
        const session: any = await getServerSession(authOptions);
        token = session?.accessToken;
      } else {
        // ✅ Use client-side session retrieval (inside a function)
        const getClientSession = async () => {
          const session = await import("next-auth/react").then((mod) => mod.getSession());
          return session?.accessToken;
        };
        token = await getClientSession();
      }

      if (token && request.headers) {
        request.headers["Authorization"] = `${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token", error);
    }
    return request;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle retries for unauthorized requests
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.code === "ERR_NETWORK") return;
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          // Logic to handle token refresh or redirect to login
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
