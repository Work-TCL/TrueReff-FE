import { useAuthStore } from "../store/auth-user";
import { useCreatorStore } from "../store/creator";
import { useVendorStore } from "../store/vendor";
import { USER_TYPE } from "../utils/constants";
import axiosInstance from "./http-common";

export const getProfileAPI = async () => {
  try {
    const response = await axiosInstance.get("/auth/user");
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
      });
    }
    // creator
    if (response.data?.data?.type === USER_TYPE.Creator) {
      const creator = response.data?.data?.creator;
      useCreatorStore.getState().setCreatorData("creator", {
        creatorId: creator?._id,
        accountId: response.data?.data?._id,
        full_name: creator?.full_name,
        user_name: creator?.user_name,
        title: creator?.title,
        phone: creator?.phone,
        banner_image: creator?.banner_image,
        profile_image: creator?.profile_image,
        category: creator?.category,
        sub_category: creator?.sub_category,
        tags: creator?.tags,
        channels: creator?.channels,
        completed: creator?.completed,
        short_description: creator?.short_description,
        long_description: creator?.long_description,
      });
    }
    // vendor
    if (response.data?.data?.type === USER_TYPE.Vendor) {
      const vendor = response.data?.data?.vendor;
      useVendorStore.getState().setVendorData("vendor", {
        vendorId: vendor?._id,
        accountId: response.data?.data?._id,
        business_name: vendor?.business_name,
        company_email: vendor?.company_email,
        company_phone: vendor?.company_phone,
        gst_number: vendor?.gst_number,
        website: vendor?.website,
        type_of_business: vendor?.type_of_business,
        contacts: vendor?.contacts,
        omni_channels: vendor?.omni_channels,
        brand_documents: vendor?.brand_documents,
        addresses: vendor?.addresses,
      });
    }
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile get failed");
  }
};

export const patchProfileAPI = async (data: any) => {
  try {
    const response = await axiosInstance.patch("/auth/user", data);
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile update failed");
  }
};
