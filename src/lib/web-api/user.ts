import { useAuthStore } from "../store/auth-user";
import { useCreatorStore } from "../store/creator";
import { useVendorStore } from "../store/vendor";
import { USER_TYPE } from "../utils/constants";
import axios from "./axios";

export const getProfileAPI = async () => {
  try {
    const response = await axios.get("/auth/user");
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
        phone: user?.phone
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
      });
    }
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile get failed");
  }
};

export const patchProfileAPI = async (data: any) => {
  try {
    const response = await axios.patch("/auth/user", data);
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile update failed");
  }
};
