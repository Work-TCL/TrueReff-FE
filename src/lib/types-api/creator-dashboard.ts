export interface ICreatorStateInfoResponse {
    status: number;
    message: number;
    data: ICreatorStateInfo,
    error: null
}
export interface ICreatorStateInfo {
    activeCollaborations: number;
    pendingCollaborations: number;
    activeCampaigns: number;
    last7DaysVendors: number;
}

export interface ITopBrands {
    activeCollaborationCount: number;
    _id: string;
    business_name: string;
    percentage: number;
}