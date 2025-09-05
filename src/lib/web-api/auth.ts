//write all the api functions here
//always add suffix at the end of the function
import { useAuthStore } from "../store/auth-user";
import { useCreatorStore } from "../store/creator";
import { useVendorStore } from "../store/vendor";
import {
  IGetCategoryParams,
  IGetCategoryResponse,
  IGetCreatorProgressResponse,
  IGetUserNameExistsResponse,
  IGetUserResponse,
  IPostContactUsRequest,
  IPostContactUsResponse,
  IPostCreatorCheckExistRequest,
  IPostCreatorCheckExistResponse,
  IPostCreatorRegisterStepOneRequest,
  IPostCreatorRegisterResponse,
  IPostForgotPasswordRequest,
  IPostForgotPasswordResponse,
  IPostLoginRequest,
  IPostLoginResponse,
  IPostResendOtpRequest,
  IPostResendOtpResponse,
  IPostResetPasswordRequest,
  IPostResetPasswordResponse,
  IPostSignupRequest,
  IPostSignupResponse,
  IPostSocialLoginRequest,
  IPostVendorRegisterRequest,
  IPostVendorRegisterResponse,
  IPostVerifyEmailRequest,
  IPostVerifyEmailResponse,
  IPostVerifyOTPRequest,
  IPostVerifyOTPResponse,
  IPutUpdateCreatorRequest,
  IPutUpdateCreatorResponse,
} from "../types-api/auth";
import { getErrorMessage } from "../utils/commonUtils";
import { USER_TYPE } from "../utils/constants";
import axios from "./axios";

export const signUpAPI = async (
  params: IPostSignupRequest
): Promise<IPostSignupResponse> => {
  try {
    const response = await axios.post("/auth/register", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};

export const loginAPI = async (
  params: IPostLoginRequest
): Promise<IPostLoginResponse> => {
  try {
    const response = await axios.post("/auth/login", {
      userName: params?.email,
      password: params?.password,
    });
    const user = response?.data;
    if (user) {
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
        phone: user?.phone,
      });
    }
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};
export const SocialLoginAPI = async (
  params: IPostSocialLoginRequest
): Promise<IPostLoginResponse> => {
  try {
    const response = await axios.post("/auth/social-login", params);
    const user = response?.data;
    if (user) {
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
        phone: user?.phone,
      });
      if (user?.token) {
        useAuthStore.getState().setIsAuthStatus("authenticated");
        useAuthStore.getState().setToken(user?.token);
      }
    }
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const getUserApi = async (): Promise<IGetUserResponse> => {
  useAuthStore.getState().setIsAuthStatus("loading");
  try {
    const response = await axios.get("/auth/user");
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        phone: user?.phone,
        role: user?.type,
      });
    }
    // creator
    if (response.data?.data?.type === USER_TYPE.Creator) {
      const creator = response.data?.data?.creator;
      useCreatorStore.getState().setCreatorData("creator", {
        creatorId: creator?._id,
        accountId: creator?.accountId,
        full_name: creator?.full_name,
        user_name: creator?.user_name,
        email: creator?.email,
        phone: creator?.phone,
        dob: creator?.dob,
        gender: creator?.gender,
        state: creator?.state,
        city: creator?.city,
        category: creator?.category,
        sub_category: creator?.sub_category,
        tags: creator?.tags,
        channels: creator?.channels,
        completed_step: creator?.completed_step,
        status: creator?.status,
        createdAt: creator?.createdAt,
        updatedAt: creator?.updatedAt,
        completed: creator?.completed,
        instagram_link: creator?.instagram_link,
        youtube_link: creator?.youtube_link,
        banner_image: creator?.banner_image,
        profile_image: creator?.profile_image,
        store_description: creator?.store_description,
        store_name: creator?.store_name,
      });
    }
    // vendor
    if (response.data?.data?.type === USER_TYPE.Vendor) {
      const vendor = response.data?.data?.vendor;
      useVendorStore.getState().setVendorData("vendor", {
        vendorId: vendor?._id,
        accountId: response?.data?.data?._id,
        category: vendor?.category,
        sub_category: vendor?.sub_category,
        completed_step: vendor?.completed_step,
        contacts: vendor?.contacts,
        business_name: vendor?.business_name,
        company_email: vendor?.company_email,
        pin_code: vendor?.pin_code,
        type_of_business: vendor?.type_of_business,
        website: vendor?.website,
        state: vendor?.state,
        city: vendor?.city,
        address: vendor?.address,
        profile_image: vendor?.profile_image,
        banner_image: vendor?.banner_image,
        createdAt: vendor?.createdAt,
        updatedAt: vendor?.updatedAt,
        gst_certificate: vendor?.gst_certificate,
        gst_number: vendor?.gst_number,
        pan_number: vendor?.pan_number,
        channelConfig: vendor?.channelConfig,
        channelId: vendor?.channelId,
        channelStatus: vendor?.channelStatus,
        channelType: vendor?.channelType,
        status: vendor?.status,
      });
    }
    useAuthStore.getState().setIsAuthStatus("authenticated");
    return response?.data;
  } catch (error) {
    useAuthStore.getState().setIsAuthStatus("unauthenticated");
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While getting user");
  }
};

export const resendOtp = async (
  params: IPostResendOtpRequest
): Promise<IPostResendOtpResponse> => {
  try {
    const response = await axios.post("/user/auth/resend-otp", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("resend not sent OTP");
  }
};

export const verifyOtp = async (
  params: IPostVerifyOTPRequest
): Promise<IPostVerifyOTPResponse> => {
  try {
    const response = await axios.post("/auth/reset-password", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid OTP");
  }
};

export const verifyEmail = async (
  params: IPostVerifyEmailRequest
): Promise<IPostVerifyEmailResponse> => {
  try {
    const response = await axios.post("/auth/email-verify", params);
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
        phone: user?.phone,
      });
      useAuthStore.getState().setToken(response.data?.data?.token);
    }
    // creator
    if (response.data?.data?.type === USER_TYPE.Creator) {
      const creator = response.data?.data?.creator;
      useCreatorStore.getState().setCreatorData("creator", {
        creatorId: creator?._id,
        accountId: creator?.accountId,
        full_name: creator?.full_name,
        user_name: creator?.user_name,
        email: creator?.email,
        phone: creator?.phone,
        dob: creator?.dob,
        gender: creator?.gender,
        state: creator?.state,
        city: creator?.city,
        category: creator?.category,
        sub_category: creator?.sub_category,
        tags: creator?.tags,
        channels: creator?.channels,
        completed_step: creator?.completed_step,
        status: creator?.status,
        createdAt: creator?.createdAt,
        updatedAt: creator?.updatedAt,
        completed: creator?.completed,
        instagram_link: creator?.instagram_link,
        youtube_link: creator?.youtube_link,
        banner_image: creator?.banner_image,
        profile_image: creator?.profile_image,
        store_description: creator?.store_description,
        store_name: creator?.store_name,
      });
    }
    // vendor
    if (response.data?.data?.type === USER_TYPE.Vendor) {
      const vendor = response.data?.data?.vendor;
      useVendorStore.getState().setVendorData("vendor", {
        vendorId: vendor?._id,
        accountId: response?.data?.data?._id,
        category: vendor?.category,
        sub_category: vendor?.sub_category,
        completed_step: vendor?.completed_step,
        contacts: vendor?.contacts,
        business_name: vendor?.business_name,
        company_email: vendor?.company_email,
        pin_code: vendor?.pin_code,
        type_of_business: vendor?.type_of_business,
        website: vendor?.website,
        state: vendor?.state,
        city: vendor?.city,
        address: vendor?.address,
        profile_image: vendor?.profile_image,
        banner_image: vendor?.banner_image,
        createdAt: vendor?.createdAt,
        updatedAt: vendor?.updatedAt,
        gst_certificate: vendor?.gst_certificate,
        gst_number: vendor?.gst_number,
        pan_number: vendor?.pan_number,
        channelConfig: vendor?.channelConfig,
        channelId: vendor?.channelId,
        channelStatus: vendor?.channelStatus,
        channelType: vendor?.channelType,
        status: vendor?.status,
      });
    }
    if (response.data?.data?.token) {
      useAuthStore.getState().setToken(response.data?.data?.token);
    }
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid OTP");
  }
};

export const forgotPassword = async (
  params: IPostForgotPasswordRequest
): Promise<IPostForgotPasswordResponse> => {
  try {
    const response = await axios.post("/auth/forgot-password", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Email");
  }
};

export const resetPasswordAPI = async (
  params: IPostResetPasswordRequest
): Promise<IPostResetPasswordResponse> => {
  try {
    const response = await axios.post("/auth/reset-password/confirm", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Otp");
  }
};

export const contactUsAPI = async (
  params: IPostContactUsRequest
): Promise<IPostContactUsResponse> => {
  try {
    const response = await axios.post("/user/contact", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const venderRegister = async (
  params: IPostVendorRegisterRequest,
  step: number
): Promise<IPostVendorRegisterResponse> => {
  try {
    const response = await axios.post(
      `/auth/vendor/register?step=${step}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};

export const getVendor = async (): Promise<any> => {
  try {
    const response = await axios.get(`/auth/vendor`);
    return response?.data?.data?.vendor;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching creator progress.");
  }
};

export const creatorRegister = async (
  params: IPostCreatorRegisterStepOneRequest | any,
  step: number,
  storeEdit: boolean = false
): Promise<IPostCreatorRegisterResponse> => {
  try {
    const response = await axios.post(
      `/auth/creator/register?step=${step}&storeEdit=${storeEdit}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Creator Registered.");
  }
};
export const updateCreator = async (
  params: IPutUpdateCreatorRequest
): Promise<IPutUpdateCreatorResponse> => {
  try {
    const response = await axios.put("/auth/creator/update", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Creator Update.");
  }
};

export const socialMediaAdded = async (
  params: any
): Promise<IPostCreatorRegisterResponse> => {
  try {
    const response = await axios.put("/auth/creator/channel-add", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Creator Registered.");
  }
};

export const getCategories = async (
  params: IGetCategoryParams
): Promise<IGetCategoryResponse> => {
  try {
    const response = await axios.get(`/product/category/list?all=true${params?.type ? `&type=${params.type}` : ''}${params?.parentId ? `&parentId=${params.parentId}` : ''}`);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching categories.");
  }
};
export const getCreatorProgress =
  async (): Promise<IGetCreatorProgressResponse> => {
    try {
      const response = await axios.get(`/auth/creator`);
      return response?.data?.data?.creator;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      // throw errorMessage || new Error("Error While fetching creator progress.");
      return {
        completed: 0,
      };
    }
  };
export const getSuggestedProducts = async (): Promise<[]> => {
  try {
    const response = await axios.get(
      `/auth/creator-dashboard/suggested-product`
    );
    return response?.data?.data?.products;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    // throw errorMessage || new Error("Error While fetching creator progress.");
    return [];
  }
};
export const getSuggestedCreators = async (): Promise<[]> => {
  try {
    const response = await axios.get(
      `/auth/vendor-dashboard/suggested-creators`
    );

    return response?.data?.data?.list;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    // throw errorMessage || new Error("Error While fetching creator progress.");
    return [];
  }
};
// get username exists or not
export const fetchUserNameExists = async (params: {
  user_name: string;
}): Promise<IGetUserNameExistsResponse> => {
  try {
    const response = await axios.post(`/auth/creator/check-exists`, params);
    return response?.data?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching user name.");
  }
};
export const checkCreatorUserNameExist = async (
  params: IPostCreatorCheckExistRequest
): Promise<IPostCreatorCheckExistResponse | null> => {
  try {
    const response = await axios.post(`/auth/creator/check-exists`, params);
    return response?.data?.error;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    // throw errorMessage || new Error("Error While fetching creator progress.");
    return null;
  }
};

export const getCreatorList = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    const response = await axios.get(
      `/auth/creator/list?page=${page}&limit=${limit}`
    );
    return response?.data?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching creator list.");
  }
};

export const getVendorList = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    const response = await axios.get(
      `/auth/vendor/list?page=${page}&limit=${limit}`
    );
    return response?.data?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching creator list.");
  }
};

export const getVendorCreatorCount = async (): Promise<any> => {
  try {
    const response = await axios.get(`/auth/creator/creator-vendor-count`);
    return response?.data?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching creator list.");
  }
};
