
import { ICreateStoreRequest } from "../types-api/my-store";
import { getErrorMessage } from "../utils/commonUtils";
import axios from "./axios";

export const createStore = async (
  params: FormData
): Promise<ICreateStoreRequest> => {
  try {
    const response = await axios.post(`/auth/creator-store/add`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While create campaign.");
  }
};
export const updateCreatorStore = async (
  params: FormData
): Promise<any> => {
  try {
    const response = await axios.put(
      `/auth/creator-store/update`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While update campaign.");
  }
};
export const getCreatorStore = async (
  params: {storeName?:string}
): Promise<any> => {
  try {
    const response = await axios.get(`/auth/creator-store${params?.storeName ? `?name=${params.storeName}`:""}`);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While getCampaign.");
  }
};

// export const getCampaignList = async (
//   params: IGETCampaignListRequest
// ): Promise<IGETCampaignListResponse> => {
//   const {page,limit,search,status} = params;
//   try {
//     const response = await axios.get(`/product/campaign/list?limit=${limit}&page=${page}${search ? `&search=${search}`:''}${status ? `&status=${status}`:""}`);
//     return response?.data?.data;
//   } catch (error: unknown) {
//     const errorMessage = getErrorMessage(error);
//     throw errorMessage || new Error("Error While getCampaign.");
//   }
// };
