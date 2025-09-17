import axios from "./axios";

export const getCreatorStatesInfo = async (days: string = "") => {
  try {
    const response = await axios.get(
      `/auth/creator-dashboard/states${days !== "all" ? `?days=${days}` : ""}`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getTopPerformingBrand = async () => {
  try {
    const response = await axios.get(
      `/auth/creator-dashboard/top-performing-vendors`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getRevenuePerformance = async (days: string = "") => {
  try {
    const response = await axios.get(
      `/auth/creator-dashboard/revenue-graph${
        days !== "all" ? `?days=${days}` : ""
      }`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};
