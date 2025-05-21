import axios from "./axios";

export const getCreatorStatesInfo = async () => {
  try {
    const response = await axios.get(`/auth/creator-dashboard/states`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getTopPerformingBrand = async () => {
    try {
        const response = await axios.get(`/auth/creator-dashboard/top-performing-vendors`);
        return response?.data?.data;
    } catch (error) {
        throw error;
    }
};

export const getRevenuePerformance = async () => {
    try {
        const response = await axios.get(`/auth/creator-dashboard/revenue-graph`);
        return response?.data?.data;
    } catch (error) {
        throw error;
    }
};
