import { number } from "yup"

export interface IYoutubeConnectChannelRequest {
    channelName: string
}
export interface IChannelDetail {
    _id: string,
    creatorId: string,
    channelId: string,
    channelName: string,
    handleName: string,
    channelType: string,
    createdAt: string,
    updatedAt: string
}
export interface IGetYTConnectChannelResponse {
    data: IChannelDetail[]
}

export interface IConnectYoutubeChannelRequest {
   channelName: string
}

export interface IConnectYoutubeChannelResponse {
    message: string,
    status: number,
    data: {
        channelId: string,
        channelName: string
    }
 }