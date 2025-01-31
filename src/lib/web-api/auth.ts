//write all the api functions here
//always add suffix at the end of the function

import {
  ILogin,
  IResendOtp,
  IResetPassword,
  IResponse,
  ISignupAPIParams,
  IVerifyOtp,
} from "../types-api/auth";
import { getErrorMessage } from "../utils/commonUtils";
import { IContactSchema } from "../utils/validations";
import axiosInstance from "./http-common";

export const signUpAPI = async (
  params: ISignupAPIParams
): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/auth/register", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};

export const loginAPI = async (params: ILogin): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const resendOtp = async (params: IResendOtp): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/user/auth/resend-otp", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("resend not sent OTP");
  }
};

export const verifyOtp = async (params: IVerifyOtp): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid OTP");
  }
};

export const forgotPassword = async (
  params: IResendOtp
): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/forgot-password",
      params
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Email");
  }
};

export const resetPasswordAPI = async (
  params: IResetPassword
): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-password/confirm",
      params
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Otp");
  }
};

export const contactUsAPI = async (
  params: IContactSchema
): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/user/contact", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const venderRegister = async (
  params: any
): Promise<IResponse> => {
  try {
    const response = await axiosInstance.post("/vendor/add-vendor-details", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};
