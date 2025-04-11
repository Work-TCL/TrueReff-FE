export const getConnectedChannelsList = async (axios: any) => {
  try {
    const response = await axios.get(`/channel/vendor/channel/list`);
    return response?.data?.data || [];
  } catch (error) {
    return [];
  }
};
