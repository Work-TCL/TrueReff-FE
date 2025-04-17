import { IProduct } from "./vendor";

export interface ICampaign {
  _id: string;
  name: string;
  description: string;
  startDate: string; // ISO string format
  endDate: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "COMPLETED"; // Add other possible statuses if any
  productId: IProduct;
  channels: string[];
  discount_type: "FIXED_AMOUNT" | "PERCENTAGE";
  discount_value: number;
  vendorId: string;
  imageUrls: string[];
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPOSTCreateCampaignRequest {
  name: string;
  description: string;
  startDate: Date; // ISO string
  endDate: Date; // ISO string
  productId: string;
  channels: string | string[]; // depending on frontend input
  discount_type: "FIXED_AMOUNT" | "PERCENTAGE"; // add more types if needed
  discount_value: number;

  video: File | null;
  images: File[]; // max 3
}

export interface IPOSTCreateCampaignResponse {
  count: number;
  data: ICampaign;
}
export interface IGETCampaignRequest {
  id: string;
}
