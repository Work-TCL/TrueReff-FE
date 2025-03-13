import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axiosInstance from "@/lib/web-api/http-common";
import { IPostLoginResponse, IPostVerifyEmailResponse } from "@/lib/types-api/auth";
import { loginAPI, verifyEmail } from "@/lib/web-api/auth";

interface AuthorizeCredentials {
  username: string;
  otp?: string;
  password?: string;
  redirect?: boolean;
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password", optional: true },
        otp: { label: "OTP", type: "text", optional: true }, // Add OTP field
      },
      async authorize(credentials: AuthorizeCredentials | any) {
        try {
          if (credentials?.otp) {
            // Handle OTP login
            const response: IPostVerifyEmailResponse = await verifyEmail({
              email: credentials?.username,
              otpCode: credentials?.otp,
            });
            if (response?.data) {
              return {
                ...response?.data,
                accessToken: response?.data?.token,
              };
            }
          } else if (credentials?.password) {
            // Handle password login
            const response: IPostLoginResponse = await loginAPI({
              email: credentials?.username,
              password: credentials?.password,
            });
            if (response?.data) {
              return {
                ...response?.data,
                accessToken: response?.data?.token,
              };
            }
          }

          return null;
        } catch (error) {
          throw error || new Error("Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "google") {
          const res = await axiosInstance.post("/user/auth/social-login", {
            accessToken: account?.access_token,
          });
          token.accessToken = res?.data?.data?.token;
          token.user = res?.data?.data;
        } else {
          token._id = user?._id;
        token.name = user?.name;
        token.email = user?.email;
        token.type = user?.type;
        token.isActive = user?.isActive;
        token.isEmailVerified = user?.isEmailVerified;
        token.createdAt = user?.createdAt;
        token.updatedAt = user?.updatedAt;
        token.token = user?.token;

          token.accessToken = (user as any).accessToken;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user._id = token?._id; 
        session.user.name = token?.name;
        session.user.email = token?.email;
        session.user.type = token?.type;
        session.user.isActive = token?.isActive;
        session.user.isEmailVerified = token?.isEmailVerified;
        session.user.createdAt = token?.createdAt;
        session.user.updatedAt = token?.updatedAt;
        session.user.token = token?.token;

      session.accessToken = (
        token as unknown as { accessToken: string }
      ).accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
    newUser: "/",
  },
};

export default authOptions;
