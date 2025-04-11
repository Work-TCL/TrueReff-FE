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
  contacts: VendorContact[];
  omni_channels: string[];
  brand_documents: any[];
  addresses: any[];
}

export interface IVendorUpdate {
  vendorId?: string;
  accountId?: string;
  business_name?: string;
  company_email?: string;
  company_phone?: string;
  gst_number?: string;
  website?: string;
  type_of_business?: string;
  contacts?: VendorContact[];
  omni_channels?: string[];
  brand_documents?: any[];
  addresses?: any[];
}
