"use client";
import LightButton from "@/app/_components/ui/button/variant/light-button";
import { useTranslations } from "next-intl";
import React from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function SocialAuth() {
  const translate = useTranslations();
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;    
    const redirectUri = `${BACKEND_URL}/auth/callback/google`;
    const scope = encodeURIComponent("openid email profile");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=web`;

    window.location.href = authUrl;
  };
  const handleAppleLogin = () => {
 const params = new URLSearchParams({
      response_type: "code",
      response_mode: "form_post",
      client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
      redirect_uri: `${BACKEND_URL}/auth/callback/apple`,
      scope: "name email",
      nonce: "12345"
    });

    window.location.href = `https://appleid.apple.com/auth/authorize?${params}&state=web`;
  };

  return (
    // <div className="grid sm:grid-cols-2 sm:gap-3 gap-2">
    <div className="grid sm:grid-cols-1 sm:gap-3 gap-2">
      <LightButton
        onClick={() => handleGoogleLogin()}
        type="button"
        className="w-full flex justify-center items-center gap-2"
      >
        <svg className="w-4" viewBox="0 0 533.5 544.3">
          <path
            d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
            fill="#4285f4"
          />
          <path
            d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
            fill="#34a853"
          />
          <path
            d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
            fill="#fbbc04"
          />
          <path
            d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
            fill="#ea4335"
          />
        </svg>
        <span>{translate("Continue_with_Google")}</span>
      </LightButton>
      <LightButton
      onClick={() => handleAppleLogin()}
        type="button"
        className="w-full flex justify-center items-center gap-2"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 17 17"><path d="M13.72 9.15c-.02-2.3 1.87-3.4 1.95-3.45-1.07-1.57-2.74-1.79-3.33-1.82-1.42-.14-2.77.84-3.48.84-.72 0-1.83-.82-3.01-.8-1.54.03-2.96.9-3.76 2.28-1.6 2.8-.4 6.94 1.15 9.2.76 1.09 1.66 2.3 2.85 2.25 1.15-.04 1.59-.72 2.99-.72 1.4 0 1.79.72 3.02.7 1.25-.02 2.04-1.1 2.79-2.2.88-1.3 1.25-2.57 1.26-2.63-.03-.01-2.4-.92-2.43-3.65z"/><path d="M11.2 2.68c.62-.75 1.04-1.78.93-2.83-.9.04-1.98.6-2.63 1.35-.57.64-1.07 1.67-.93 2.67.98.08 1.99-.5 2.63-1.19z"/></svg>
        <span>{translate("Continue_with_Apple")}</span>
      </LightButton>
    </div>
  );
}
