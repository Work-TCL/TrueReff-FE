import { number } from "yup";

export interface IYoutubeConnectChannelRequest {
  channelName: string;
}
export interface IChannelDetail {
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetYTConnectChannelResponse {
  data: IChannelDetail[];
}

export interface IConnectYoutubeChannelRequest {
  channelName: string;
}

export interface IConnectYoutubeChannelResponse {
  message: string;
  status: number;
  data: {
    channelId: string;
    channelName: string;
  };
}
3;
export interface ICreator {
  creatorId: string;
  accountId: string;
  full_name: string;
  user_name: string;
  title: string;
  phone: string;
  banner_image: string;
  profile_image: string;
  category: string[];
  sub_category: string[];
  tags: string[];
  channels: string[];
  completed: number;
  short_description: string;
  long_description: string;
}

export interface ICreatorByIdRequest {
  id: string;
}

export interface ICreatorByIdResponse {
  message: string;
  status: number;
  data: ICreator;
}
