"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/app/_components/components-common/layout/loader";
import Button from "@/app/_components/ui/button";
import { getConnectedChannel } from "@/lib/web-api/creator";
import { translate } from "@/lib/utils/translate";

interface IProps {
  setYoutubeConnected: (value: boolean) => void;
  youtubeConnected: boolean;
  setInstagramConnected: (value: boolean) => void;
  instagramConnected: boolean;
}

export default function SocialMedia({
  setYoutubeConnected,
  youtubeConnected,
  instagramConnected,
  setInstagramConnected,
}: IProps) {
  const methods = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatorId = searchParams.get("creatorId") ?? "";
  const message = searchParams.get("message") ?? "";
  const error = searchParams.get("error") ?? "";

  useEffect(() => {
    fetchConnectedChannel();
  }, []);

  useEffect(() => {
    if (message) {
      toast.success(message);
      removeQueryParam("message");
    } else if (error) {
      toast.error(error);
      removeQueryParam("error");
    }
  }, [message, error]);

  const removeQueryParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchConnectedChannel = async () => {
    setIsPageLoading(true);
    try {
      const response = await getConnectedChannel();
      if (response?.data?.length) {
        const youtube = response.data.findLast(
          (ele) => ele?.channelType === "youtube"
        );
        if (youtube) {
          methods.setValue(`channels[1].account_name`, youtube?.channelName);
          methods.setValue(
            `channels[1].account_link`,
            `https://youtube.com/${youtube?.handleName}`
          );
          methods.setValue(`channels[1].handle_name`, youtube?.handleName);
          setYoutubeConnected(true);
        } else setYoutubeConnected(false);

        const instagram = response.data.findLast(
          (ele) => ele?.channelType === "instagram"
        );
        if (instagram) {
          methods.setValue(`channels[0].account_name`, instagram?.channelName);
          methods.setValue(
            `channels[0].account_link`,
            `https://instagram.com/${instagram?.handleName}`
          );
          methods.setValue(`channels[0].handle_name`, instagram?.handleName);
          setInstagramConnected(true);
        } else setInstagramConnected(false);
      }
    } catch (error) {
      console.error("Error fetching connected channels:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/youtube/auth/callback`;
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${creatorId}`;
    window.location.href = authUrl;
  };

  const handleInstaLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
    const callBackUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/instagram/auth/callback`;
    const scope =
      "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish";
    const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callBackUri}&response_type=code&scope=${scope}&state=${creatorId}`;
    window.location.href = authUrl;
  };

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="relative border-l-2 border-gray-dark ">
        {/* Instagram Step */}
        <div className="mb-4 ml-6 relative">
          <div className="absolute -left-6 top-0 w-12 h-12 bg-primary-color rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Instagram-icon.svg"
              alt="Instagram"
              className="w-7 h-7"
            />
          </div>
          <div className="bg-gray-light p-6 rounded-20 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text flex-1 md:text-xl text:sm font-semibold">
                Connect Instagram
              </h3>
              {!instagramConnected && (
                <Button
                  loading={isLoading}
                  onClick={handleInstaLogin}
                  size="small"
                  className="md:text-sm text-xs bg-primary-color text-white w-fit md:px-3 px-2 md:py-2 py-1"
                >
                  Connect
                </Button>
              )}
            </div>
            <p className="text-gray-color mb-4 md:text-base text-sm">
              {instagramConnected
                ? "Your Instagram account is connected."
                : "Connect your Instagram account to share your content seamlessly."}
            </p>
            <p className="text-xs text-gray-color mb-4">
              Minimum 1,000 followers required to connect.
            </p>
            {instagramConnected && (
              <div className="text-sm text-gray-color space-y-1 mt-4">
                <div>
                  <strong>Name:</strong>{" "}
                  {methods.watch("channels[0].account_name")}
                </div>
                <div>
                  <strong>Handle:</strong> @
                  {methods.watch("channels[0].handle_name")}
                </div>
                <div>
                  <strong>Link:</strong>{" "}
                  <a
                    href={methods.watch("channels[0].account_link")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline"
                  >
                    Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YouTube Step */}
        <div className="mb-1 ml-6 relative">
          <div className="absolute -left-6 top-0 w-12 h-12 bg-dark-orange rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Youtube-icon.svg"
              alt="YouTube"
              className="w-7 h-7"
            />
          </div>
          <div className="bg-gray-light p-6 rounded-20 shadow-md">
            <div className="flex items-center justify-between mb-2 flex-1">
              <h3 className="text-text md:text-xl text:sm font-semibold">
                Connect YouTube
              </h3>
              {!youtubeConnected && (
                <Button
                  loading={isLoading}
                  onClick={handleGoogleLogin}
                  size="small"
                  className="md:text-sm text-xs bg-dark-orange text-white w-fit md:px-3 px-2 md:py-2 py-1"
                >
                  Connect
                </Button>
              )}
            </div>
            <p className="text-gray-color mb-4 md:text-base text-sm">
              {youtubeConnected
                ? "Your YouTube channel is connected."
                : "Connect your YouTube channel to manage your videos and analytics."}
            </p>
            <p className="text-xs text-gray-color mb-4">
              Minimum 1,000 subscribers required to connect.
            </p>
            {youtubeConnected && (
              <div className="text-sm text-gray-color space-y-1 mt-4">
                <div>
                  <strong>Name:</strong>{" "}
                  {methods.watch("channels[1].account_name")}
                </div>
                <div>
                  <strong>Handle:</strong> @
                  {methods.watch("channels[1].handle_name")}
                </div>
                <div>
                  <strong>Link:</strong>{" "}
                  <a
                    href={methods.watch("channels[1].account_link")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline"
                  >
                    Channel
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
