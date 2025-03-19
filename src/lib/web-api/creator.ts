import toast from "react-hot-toast";
import { IConnectYoutubeChannelRequest, IConnectYoutubeChannelResponse, IGetYTConnectChannelResponse } from "../types-api/creator";
import { getErrorMessage } from "../utils/commonUtils";
import axiosInstance from "./http-common";

export const getConnectedChannel = async (): Promise<IGetYTConnectChannelResponse> => {
  try {
    const response = await axiosInstance.get("/channel/creator/list");
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While getting connected channel");
  }
};

export const connectYoutubeChannel = async (
    params: IConnectYoutubeChannelRequest
): Promise<IConnectYoutubeChannelResponse> => {
    try {
      const response = await axiosInstance.post("/channel/creator/youtube/validate/channel",params);
      console.log("response",response)
      if(response?.data?.status === 200){
        toast.success(response?.data?.message)
      }
      return response?.data;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if(errorMessage){
        toast.error(errorMessage);
      }
      throw errorMessage ||  new Error("Error While validating youtube channel");
    }
  };