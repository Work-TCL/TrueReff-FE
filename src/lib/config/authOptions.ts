import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axiosInstance from "@/lib/web-api/http-common";

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
      async authorize(credentials) {
        try {
          let response;
          if (credentials?.otp) {
            // Handle OTP login
            response = await axiosInstance.post("/auth/login", {
              email: credentials?.username,
              otp: credentials?.otp,
            });
          } else if (credentials?.password) {
            // Handle password login
            response = await axiosInstance.post("/auth/login", {
              email: credentials?.username,
              password: credentials?.password,
            });
          }

          if (response?.data?.data) {
            return {
              ...response?.data?.data,
              accessToken: response?.data?.data?.token,
            };
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
          token.accessToken = (user as any).accessToken;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
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
