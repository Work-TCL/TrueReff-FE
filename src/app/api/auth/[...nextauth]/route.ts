import authOptions from "@/lib/config/authOptions";
import NextAuth from "next-auth";

// Extend the types for the Session and JWT
declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
  interface JWT {
    accessToken: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
