// POST Login
export interface IPostGenerateUTMLinkRequest {
  collaborationId: string; // or "FIXED_AMOUNT"
  discountType: string; // or "FIXED_AMOUNT"
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
}
export interface IPostGenerateUTMLinkResponse {
  status: number;
  message: string;
  data: {
    id: string;
  };
}
