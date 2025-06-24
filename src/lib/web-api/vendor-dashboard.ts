import axios from "./axios";

export const getStatesInfo = async (days: string = "7") => {
  try {
    const response = await axios.get(
      `/auth/vendor-dashboard/states${days !== "all" ? `?days=${days}` : ""}`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getVendorRevenuePerformance = async (days: string = "7") => {
  try {
    const response = await axios.get(
      `/auth/vendor-dashboard/revenue-graph${
        days !== "all" ? `?days=${days}` : ""
      }`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};
export const getWalletBalance = async () => {
  try {
    const response = await axios.get(`/payment/wallet`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};
