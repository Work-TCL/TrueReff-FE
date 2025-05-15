export interface ICreateStoreRequest {
  creatorId: string;
  name: string;
  description: string;
  tags: string[];
  category: string[];
  link: string;
  profile_image: string;
  banner_image: string;
}
