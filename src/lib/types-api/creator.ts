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
  email: string;
  phone: string;
  dob: string;
  gender: string;
  state: string;
  city: string;
  category: string[];
  sub_category: string[];
  tags: string[];
  channels: string[];
  completed_step: number;
  status: "IN_PROGRESS"| "PENDING_APPROVAL"| "APPROVED"| "REJECTED";
  createdAt: string;
  updatedAt: string;
  completed: number,
  instagram_link: string;
  youtube_link: string;
  banner_image: string;
  profile_image: string;
  store_description: string;
  store_name: string;
}

export interface ICreatorByIdRequest {
  id: string;
}

export interface ICreatorByIdResponse {
  message: string;
  status: number;
  data: ICreator;
}
