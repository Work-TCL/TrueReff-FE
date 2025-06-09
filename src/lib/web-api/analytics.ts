import axios from "./axios";

// *****************CREATOR-SIDE**************************

export interface IGETCreatorsRequest {
  vendorId?: string;
  productId?: string;
  page?: number;
  limit?: number;
}

export interface IGETCreatorsStateRequest {
  vendorId?: string;
  productId?: string;
}

export const getAnalyticsCreatorsList = async (
  params: IGETCreatorsRequest = {
    page: 1,
    limit: 10,
  }
) => {
  try {
    const response = await axios.get(`/product/analytics/creator/list`, {
      params: params,
    });
    return response?.data?.data;
  } catch (error) {
    return [];
  }
};
export const getAnalyticsCreatorsState = async (
  params: IGETCreatorsStateRequest
) => {
  try {
    const response = await axios.get(`/product/analytics/creator/page-state`, {
      params: params,
    });
    return response?.data?.data;
  } catch (error) {
    return [];
  }
};

// *****************VENDOR-SIDE**************************

export interface IGETVendorsRequest {
  creatorId?: string;
  productId?: string;
  page?: number;
  limit?: number;
}
export interface IGETVendorsStateRequest {
  creatorId?: string;
  productId?: string;
}

export const getAnalyticsVendorsList = async (
  params: IGETCreatorsRequest = {
    page: 1,
    limit: 10,
  }
) => {
  try {
    const response = await axios.get(`/product/analytics/vendor/list`, {
      params: params,
    });
    return response?.data?.data;
  } catch (error) {
    return [];
  }
};
export const getAnalyticsVendorsState = async (
  params: IGETVendorsStateRequest
) => {
  try {
    const response = await axios.get(`/product/analytics/vendor/page-state`, {
      params: params,
    });
    return response?.data?.data;
  } catch (error) {
    return [];
  }
};
