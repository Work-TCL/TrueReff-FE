import axiosInstance from "./http-common";

export const getCollobrationConversation = async (collobrationId: string) => {
  try {
    const response = await axiosInstance.get(
      `/message/collaboration/${collobrationId}?limit=20&page=1`
    );
    return response?.data?.data || [];
  } catch (error) {
    return [];
  }
};
