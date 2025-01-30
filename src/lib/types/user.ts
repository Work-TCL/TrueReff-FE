
//whatever type define in this file must be match with backend because that way it will vary easy to manage the project long way.
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profile?: string;
    accessToken?: string
}