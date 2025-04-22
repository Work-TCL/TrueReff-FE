
import { ICreateStoreRequest } from "../types-api/my-store";
import { getErrorMessage } from "../utils/commonUtils";
import axios from "./axios";

export const createStore = async (
  params: FormData
): Promise<ICreateStoreRequest> => {
  try {
    const response = await axios.post(`/product/campaign/add`, params, {
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
// export const updateCampaign = async (
//   params: FormData,
//   campaignId: string
// ): Promise<IPOSTCreateCampaignResponse> => {
//   try {
//     const response = await axios.put(
//       `/product/campaign/update/${campaignId}`,
//       params,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response?.data;
//   } catch (error: unknown) {
//     const errorMessage = getErrorMessage(error);
//     throw errorMessage || new Error("Error While update campaign.");
//   }
// };
// export const getCampaign = async (
//   params: IGETCampaignRequest
// ): Promise<ICampaign> => {
//   try {
//     const response = await axios.get(`/product/campaign/${params.id}`);
//     return response?.data?.data?.data;
//   } catch (error: unknown) {
//     const errorMessage = getErrorMessage(error);
//     throw errorMessage || new Error("Error While getCampaign.");
//   }
// };

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
