import axiosInstance from "./http-common";

export const getConnectedChannelsList = async () => {
  try {
    const response = await axiosInstance.get(`/channel/vendor/channel/list`);
    return response?.data?.data || [];
  } catch (error) {
    return [];
  }
};
