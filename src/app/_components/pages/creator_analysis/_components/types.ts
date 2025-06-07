export interface IAnalyticsData {
  creator?: { name: string; image: string; _id: string };
  brand?: { name: string; logo: string; _id: string };
  product: { _id: string; title: string; image: string };
  orders: number;
  revenue: number;
  visitors: number;
  salesGraphData: number[];
}

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
  PRODUCT: "product",
  VENDOR: "vendor",
  CREATOR: "creator",
} as const;

export type IFilterKey = (typeof FILTER_KEYS)[keyof typeof FILTER_KEYS];

export interface IFilterAnalytics {
  key: IFilterKey;
  value: string;
}

export interface IStatesAnalytics {
  sales: number;
  revenue: number;
  visitors: number;
  collobrations: number;
  commissions: number;
}
