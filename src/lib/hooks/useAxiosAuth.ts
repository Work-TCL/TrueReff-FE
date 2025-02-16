"use client";
import axiosAuth from "@/lib/web-api/axios";
import {
  AxiosError as OriginalAxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type AxiosError = { config: { _retry: boolean } } & OriginalAxiosError;

const useAxiosAuth = () => {
  const { data: session }: any = useSession();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (
        request: InternalAxiosRequestConfig
      ): Promise<InternalAxiosRequestConfig> => {
        try {
          const token = session?.accessToken;
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
  }, [session]);

  return axiosAuth;
};

export default useAxiosAuth;
