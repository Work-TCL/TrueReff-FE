import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FaceBookProvider from "next-auth/providers/facebook"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
        // callbacks: {
        //     async signIn({ account, profile }) {
        //       if (account.provider === "google") {
        //         return profile.email_verified && profile.email.endsWith("@example.com")
        //       }
        //       return true // Do different verification for other providers that don't have `email_verified`
        //     },
        //   }
      }
    }),
    FaceBookProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.REACT_APP_FACEBOOK_CLIENT_SECRET,
    })
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)

