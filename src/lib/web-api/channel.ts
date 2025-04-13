import axios from "./axios";

export const getConnectedChannelsList = async () => {
  try {
    const response = await axios.get(`/channel/vendor/channel/list`);
    return response?.data?.data || [];
  } catch (error) {
    return [];
  }
};
