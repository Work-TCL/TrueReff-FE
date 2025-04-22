
export interface ICategory {
    _id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}