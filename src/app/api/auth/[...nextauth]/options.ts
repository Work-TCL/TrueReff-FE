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
          token.accessToken = res?.data?.data?.token ?? null; // Ensure token is not undefined
          token.user = res?.data?.data ?? {};
        } else {
          token._id = user?._id || null;
          token.name = user?.name || null;
          token.email = user?.email || null;
          token.type = user?.type || null;
          token.isActive = user?.isActive || false;
          token.isEmailVerified = user?.isEmailVerified || false;
          token.createdAt = user?.createdAt || null;
          token.updatedAt = user?.updatedAt || null;
          token.token = user?.token || null;
  
          token.accessToken = user?.token || null; // ✅ Ensure accessToken is set
        }
      }
  
      return token;
    },
  
    async session({ session, token }: { session: any, token: any }) {
      if (!token) {
        session = null; // Ensure session clears on logout
      }
      session.user = {
        _id: token?._id || "",
        name: token?.name || "",
        email: token?.email || "",
        type: token?.type || "",
        isActive: token?.isActive ?? false,
        isEmailVerified: token?.isEmailVerified ?? false,
        createdAt: token?.createdAt || "",
        updatedAt: token?.updatedAt || "",
        token: token?.token || "",
      };
  
      session.accessToken = token.accessToken || ""; // ✅ Make sure accessToken is always there
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
