"use client";
import axiosAuth from "@/lib/web-api/axios";
import {
  AxiosError as OriginalAxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth-user";
import { signOut } from "next-auth/react";

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

const useAxiosAuth = () => {
  const { token: authToken }: any = useAuthStore();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (
        request: InternalAxiosRequestConfig
      ): Promise<InternalAxiosRequestConfig> => {
        try {
          const token = authToken;
          if (token && request.headers) {
            request.headers["Authorization"] = `Bearer ${token}`;
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

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.code === "ERR_NETWORK") return;
        const originalConfig = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
              // Logic to handle token refresh or redirect to login
              await signOut({
                    callbackUrl: "/login",
                    redirect: false,
                  });
              // e.g., fetch a new token and retry the request
            } catch (e) {
              return Promise.reject(e);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [authToken]);

  return axiosAuth;
};

export default useAxiosAuth;
