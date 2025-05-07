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

export interface IVendor {
  vendorId: string;
  accountId: string;
  business_name: string;
  company_email: string;
  company_phone: string;
  gst_number: string;
  website: string;
  type_of_business: string;
  profile_image: string;
  contacts: VendorContact[];
  omni_channels: string[];
  brand_documents: any[];
  addresses: any[];
  banner_image?: string;
  user_name?: string;
  short_description?: string;
  long_description?: string;
  state: string;
  city: string;
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
  vendorId?: string;
  accountId?: string;
  business_name?: string;
  company_email?: string;
  company_phone?: string;
  gst_number?: string;
  website?: string;
  profile_image?: string;
  type_of_business?: string;
  contacts?: VendorContact[];
  omni_channels?: string[];
  brand_documents?: any[];
  addresses?: any[];
  banner_image?: string;
  user_name?: string;
  short_description?: string;
  long_description?: string;
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
