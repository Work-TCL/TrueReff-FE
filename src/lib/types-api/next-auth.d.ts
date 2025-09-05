import "next-auth";
import { DefaultSession } from "next-auth";
import { boolean, string } from "yup";


declare module "next-auth" {
    interface User {
        _id?: string,
        name?: string,
        email?: string,
        phone?: string;
        type?: string,
        isActive?: boolean,
        isEmailVerified?: boolean,
        createdAt?: string,
        updatedAt?: string,
        token?: string,
        creator?: any,
        vendor?: any,
    }
    interface Session {
       user:{
         _id?: string,
        name?: string,
        email?: string,
        phone?: string,
        type: string,
        isActive?: boolean,
        isEmailVerified?: boolean,
        createdAt?: string,
        updatedAt?: string,
        token?: string,
       },
       creator?: any,
       vendor?: any,
       accessToken: string;
    }
    interface JWT {
        accessToken: string;
      }
}