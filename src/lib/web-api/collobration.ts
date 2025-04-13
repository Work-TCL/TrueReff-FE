import {
  IPostGenerateUTMLinkRequest,
  IPostGenerateUTMLinkResponse,
} from "../types-api/collobration";
import { getErrorMessage } from "../utils/commonUtils";
import axios from "./axios";

export const getCollobrationConversation = async (
  collobrationId: string,
  limit: number,
  page: number
) => {
  try {
    const response = await axios.get(
      `/message/collaboration/${collobrationId}?limit=${limit}&page=${page}`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const generateUTMLink = async (
  params: IPostGenerateUTMLinkRequest
): Promise<IPostGenerateUTMLinkResponse> => {
  try {
    const response = await axios.post("/product/utm/create", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};
