import axiosInstance from "./http-common";

export const getProfileAPI = async () => {
  try {
    const response = await axiosInstance.get("/auth/user");
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
