"use client";
import Loader from "@/app/_components/components-common/layout/loader";
import Button from "@/app/_components/ui/button";
import ModalPortal from "@/lib/components/dialogs/ModelPortal";
import { getConnectedChannel } from "@/lib/web-api/creator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
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
  creator,
}: IProps) {
  const translate = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatorId =
    searchParams.get("creatorId") ?? creator?._id ?? creator?.creatorId ?? "";
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
      // setShowHelpTip(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/youtube/auth/callback`;
      const scope = encodeURIComponent(
        "https://www.googleapis.com/auth/youtube.readonly"
      );
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${creatorId}`;
      window.location.href = authUrl;
    } catch (e) {
      setShowHelpTip(true);
    }
  };

  const handleInstaLogin = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
      const callBackUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/instagram/auth/callback`;
      const scope = "instagram_business_basic";
      const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callBackUri}&response_type=code&scope=${scope}&state=${creatorId}`;
      window.location.href = authUrl;
    } catch (e) {
      setShowHelpTip(true);
    }
  };

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="relative border-l-2 border-gray-dark ">
        {/* Instagram Step */}
        <div className="mb-4 ml-4 md:ml-6 relative">
          <div className="absolute -left-4 md:-left-6 top-0 w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Instagram-icon.svg"
              alt="Instagram"
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </div>
          <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] p-3 md:p-6 px-4 md:px-6 rounded-20 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-100 flex-1 md:text-xl text:sm font-semibold">
                {translate("Connect_Instagram")}
              </h3>
              {!instagramConnected && (
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Button
                    loading={isLoading}
                    onClick={handleInstaLogin}
                    size="small"
                    className="md:text-sm text-xs bg-primary-color text-white w-fit md:px-3 px-2 md:py-2 py-1"
                  >
                    {translate("Connect")}
                  </Button>
                  <TooltipProvider key={`how-to-connect-youtube`}>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrl(
                              "https://www.youtube.com/embed/eNvUS-6PTbs?si=HzfziQOYNGSaJCJx"
                            );
                            setShowVideo(true);
                          }}
                          className="flex items-center gap-1 text-white bg-black bg-opacity-40 px-2 py-1 rounded-lg text-xs hover:bg-opacity-60 transition"
                        >
                          ▶ Watch How
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-sm md:max-w-[300px] overflow-hidden"
                        side="left"
                      >
                        🎥 Watch How to Connect (30 sec)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
        <div className="mb-1 ml-4 md:ml-6 relative">
          <div className="absolute -left-4 md:-left-6 top-0 w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/assets/creator/Youtube-icon.svg"
              alt="YouTube"
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </div>
          <div className="bg-gradient-to-r from-[#FF6B6B] via-[#FF0000] to-[#c43c3c] p-3 md:p-6 px-4 md:px-6 rounded-20 shadow-md ">
            <div className="flex items-center justify-between mb-2 flex-1">
              <h3 className="text-gray-100 md:text-xl text:sm font-semibold">
                {translate("Connect_YouTube")}
              </h3>

              {!youtubeConnected && (
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Button
                    loading={isLoading}
                    onClick={handleGoogleLogin}
                    size="small"
                    className="md:text-sm text-xs bg-dark-orange text-white w-fit md:px-3 px-2 md:py-2 py-1"
                  >
                    {translate("Connect")}
                  </Button>
                  <TooltipProvider key={`how-to-connect-youtube`}>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrl(
                              "https://www.youtube.com/embed/gyjRT6WlLUU?si=0WmzBzPuw6r-NUYf"
                            );
                            setShowVideo(true);
                          }}
                          className="flex items-center gap-1 text-white bg-black bg-opacity-40 px-2 py-1 rounded-lg text-xs hover:bg-opacity-60 transition"
                        >
                          ▶ Watch How
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-sm md:max-w-[300px] overflow-hidden"
                        side="left"
                      >
                        🎥 Watch How to Connect (30 sec)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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

      {/* models */}
      {showVideo && (
        <ModalPortal>
          <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative group">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-[30px] right-3 text-white text-2xl font-bold group-hover:primary hover:primary"
              >
                ✕
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-[400px] rounded-lg"
                  src={videoUrl}
                  title="Watch How"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showHelpTip && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform animate-scaleIn">
              {/* Close Button */}
              <button
                onClick={() => setShowHelpTip(false)}
                className="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-110 transition"
              >
                ✕
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl p-4 flex items-center gap-2">
                <span className="bg-primary text-white text-blue-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                  !
                </span>
                <h3 className="text-primary text-lg font-semibold">
                  Need Help Connecting?
                </h3>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Having trouble?{" "}
                  <button
                    className="text-blue-600 underline font-medium hover:text-blue-800 transition"
                    onClick={() => {
                      setVideoUrl(
                        "https://www.youtube.com/embed/gyjRT6WlLUU?si=0WmzBzPuw6r-NUYf"
                      );
                      setShowHelpTip(false);
                      setShowVideo(true);
                    }}
                  >
                    Watch this quick guide
                  </button>{" "}
                  to connect smoothly.
                </p>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
