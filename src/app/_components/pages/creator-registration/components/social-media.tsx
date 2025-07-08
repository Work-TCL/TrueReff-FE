"use client";
import Loader from "@/app/_components/components-common/layout/loader";
import Button from "@/app/_components/ui/button";
import { getConnectedChannel } from "@/lib/web-api/creator";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface IProps {
  setYoutubeConnected: (value: boolean) => void;
  youtubeConnected: boolean;
  setInstagramConnected: (value: boolean) => void;
  instagramConnected: boolean;
  methods: any;
  creator: any;
}

export default function SocialMedia({
  setYoutubeConnected,
  youtubeConnected,
  instagramConnected,
  setInstagramConnected,
  methods,
  creator
}: IProps) {
  const translate = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatorId = searchParams.get("creatorId") ?? creator?._id??creator?.creatorId??"";
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
      "instagram_business_basic";
    const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callBackUri}&response_type=code&scope=${scope}&state=${creatorId}`;
    window.location.href = authUrl;
  };

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="relative border-l-2 border-gray-dark ">
        {/* Instagram Step */}
        <div className="mb-4 ml-6 relative">
          <div className="absolute -left-6 top-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Instagram-icon.svg"
              alt="Instagram"
              className="w-7 h-7"
            />
          </div>
          <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] p-6 rounded-20 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-100 flex-1 md:text-xl text:sm font-semibold">
                {translate("Connect_Instagram")}
              </h3>
              {!instagramConnected && (
                <Button
                  loading={isLoading}
                  onClick={handleInstaLogin}
                  size="small"
                  className="md:text-sm text-xs bg-primary-color text-white w-fit md:px-3 px-2 md:py-2 py-1"
                >
                  {translate("Connect")}
                </Button>
              )}
            </div>
            <p className="text-gray-100 mb-4 md:text-base text-sm">
              {instagramConnected
                ? translate("Instagram_Connected_text")
                : translate("Connect_Instagram_text")}
            </p>
            <p className="text-xs text-gray-100 mb-4">
              {translate("Minium_Followers_Text")}
            </p>
            {instagramConnected && (
              <div className="text-sm text-gray-100 space-y-1 mt-4">
                <div>
                  <strong>{translate("Name")}:</strong>{" "}
                  {methods.watch("channels[0].account_name")}
                </div>
                <div>
                  <strong>{translate("Handle")}:</strong> @
                  {methods.watch("channels[0].handle_name")}
                </div>
                <div>
                  <strong>{translate("Link")}:</strong>{" "}
                  <a
                    href={methods.watch("channels[0].account_link")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline"
                  >
                    {translate("Profile")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YouTube Step */}
        <div className="mb-1 ml-6 relative">
          <div className="absolute -left-6 top-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Youtube-icon.svg"
              alt="YouTube"
              className="w-7 h-7"
            />
          </div>
          <div className="bg-gradient-to-r from-[#FF6B6B] via-[#FF0000] to-[#c43c3c] p-6 rounded-20 shadow-md">
            <div className="flex items-center justify-between mb-2 flex-1">
              <h3 className="text-gray-100 md:text-xl text:sm font-semibold">
                {translate("Connect_YouTube")}
              </h3>
              {!youtubeConnected && (
                <Button
                  loading={isLoading}
                  onClick={handleGoogleLogin}
                  size="small"
                  className="md:text-sm text-xs bg-dark-orange text-white w-fit md:px-3 px-2 md:py-2 py-1"
                >
                  {translate("Connect")}
                </Button>
              )}
            </div>
            <p className="text-gray-100 mb-4 md:text-base text-sm">
              {youtubeConnected
                ? translate("YouTube_Connected_text")
                : translate("Connect_YouTube_text")}
            </p>
            <p className="text-xs text-gray-100 mb-4">
              {translate("Minium_subscribers_Text")}
            </p>
            {youtubeConnected && (
              <div className="text-sm text-gray-100 space-y-1 mt-4">
                <div>
                  <strong>{translate("Name")}:</strong>{" "}
                  {methods.watch("channels[1].account_name")}
                </div>
                <div>
                  <strong>{translate("Handle")}:</strong>
                  {methods.watch("channels[1].handle_name")}
                </div>
                <div>
                  <strong>{translate("Link")}:</strong>{" "}
                  <a
                    href={methods.watch("channels[1].account_link")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue underline"
                  >
                    {translate("Channel")}
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
