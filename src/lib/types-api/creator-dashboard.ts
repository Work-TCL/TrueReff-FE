export interface ICreatorStateInfoResponse {
    status: number;
    message: number;
    data: ICreatorStateInfo,
    error: null
}

export interface IFollowers {
    _id: string;
    channelType: string;
    followers: number;
}
export interface ICreatorStateInfo {
    pendingCollaborations: number;
    followers: IFollowers[];
    totalRevenue: number;
    totalCommission: number;
    totalOrders: number;
    conversionRate: number;
}

export interface ITopBrands {
    vendorId: string;
    business_name: string;
    profile_image: string;
    revenue: number;
    percentage: number;
}

export interface IRevenue {
    date: string;
    totalRevenue: number;
}
export interface IRevenueData {
    "current": IRevenue[],
    "past": IRevenue[]
}