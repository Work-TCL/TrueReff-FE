import {
  IGETProductListsRequest,
  IGETProductListsResponse,
  IVendorByIdRequest,
  IVendorByIdResponse,
} from "../types-api/vendor";
import { getErrorMessage } from "../utils/commonUtils";
import axios from "./axios";

export const checkVendorExist = async (axios: any, email: string) => {
  try {
    const response = await axios.get(`/auth/vendor/check-exist/${email}`);
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile get failed");
  }
};

export const getVendorById = async (
  params: IVendorByIdRequest
): Promise<IVendorByIdResponse> => {
  try {
    const response = await axios.get(`/auth/vendor/${params.id}`);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching categories.");
  }
};
export const getProductLists = async (
  params: IGETProductListsRequest
): Promise<IGETProductListsResponse> => {
  try {
    const response = await axios.get(
      `/product/vendor-product/product/list?page=${params.start}&limit=${params.limit}`
    );
    return response?.data?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching products.");
  }
};
