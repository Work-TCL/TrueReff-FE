import {
  IPostGenerateUTMLinkRequest,
  IPostGenerateUTMLinkResponse,
} from "../types-api/collobration";
import { getErrorMessage } from "../utils/commonUtils";
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

export const generateUTMLink = async (
  params: IPostGenerateUTMLinkRequest
): Promise<IPostGenerateUTMLinkResponse> => {
  try {
    const response = await axiosInstance.post("/product/utm/create", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};
