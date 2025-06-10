export const MODES_ANALYTICS = {
  VENDOR: "vendor",
  CREATOR: "creator",
} as const;

export type IModes = (typeof MODES_ANALYTICS)[keyof typeof MODES_ANALYTICS];

export interface IStatesOptions {
  key: string;
  value: number;
}

export const FILTER_KEYS = {
  VENDOR: "vendor",
  CREATOR: "creator",
} as const;

export type IFilterKey = (typeof FILTER_KEYS)[keyof typeof FILTER_KEYS];

export interface IFilterAnalytics {
  key: IFilterKey;
  value: IAnalyticsData;
}
export interface IAnalyticsProduct {
  productImage: string;
  productName: string;
  productId: string;
}

export interface IStatesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalViews: number;
  totalCollaborations: number;
  conversionRate: number;
}

export interface IAnalyticsData {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
  totalCommissionPaid: number;
  totalViews: number;
  vendorName: string;
  vendorImage: string;
  vendorId: string;
  creatorName: string;
  creatorImage: string;
  creatorId: string;
  productName: string;
  productImage: string;
  productId: string;
}

export interface IAnalyticsBrandData {
  _id: string;
  business_name: string;
  profile_image: string;
}
export interface IAnalyticsProductData {
  _id: string;
  title: string;
  media: string[];
}
export interface IAnalyticsCreatorData {
  _id: string;
  name: string;
  profile_image: string;
}
