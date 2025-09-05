export interface IVendorAPIParams {}

export interface IChannel {
  _id: string;
  channelType: string;
  channelStatus: string;
  channelConfig: {
    domain: string;
    name: string;
  };
}

export interface VendorContact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  isDefault?: boolean;
}
export interface IChannelConfig { 
  domain: string;
  name: string;
  shopify_store_id: number; 
  access_token: string;
}
export interface IVendor {
  vendorId: string;
  accountId: string;
  category: string[];
  sub_category: string[];
  completed_step: number;
  contacts: VendorContact[];
  business_name: string;
  company_email: string;
  pin_code: string;
  type_of_business: string;
  website: string;
  state: string;
  city: string;
  address: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  gst_certificate: string;
  gst_number: string;
  pan_number: string;
  channelConfig: IChannelConfig;
  channelId: string;
  channelStatus: string;
  channelType: string;
  status: string;
}
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  category: ICategory[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
export interface IVendorUpdate {
  vendorId: string;
  accountId: string;
  category: string[];
  sub_category: string[];
  completed_step: number;
  contacts: VendorContact[];
  business_name: string;
  company_email: string;
  pin_code: string;
  type_of_business: string;
  website: string;
  state: string;
  city: string;
  address: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  gst_certificate: string;
  gst_number: string;
  pan_number: string;
  channelConfig: IChannelConfig;
  channelId: string;
  channelStatus: string;
  channelType: string;
  status: string;
}

export interface IVendorByIdRequest {
  id: string;
}

export interface IVendorByIdResponse {
  message: string;
  status: number;
  data: IVendor;
}
export interface IGETProductListsRequest {
  start: number;
  limit: number;
  search?: string;
}

export interface IGETProductListsResponse {
  count: number;
  data: IProduct[];
}
