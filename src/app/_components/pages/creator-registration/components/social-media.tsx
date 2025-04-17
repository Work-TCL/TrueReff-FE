"use client";
import Loader from "@/app/_components/components-common/layout/loader";
import Button from "@/app/_components/ui/button";
import AnchorButton from "@/app/_components/ui/button/variant";
import Input from "@/app/_components/ui/form/Input";
import {
  IConnectYoutubeChannelResponse,
  IGetYTConnectChannelResponse,
} from "@/lib/types-api/creator";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import { translate } from "@/lib/utils/translate";
import {
  connectYoutubeChannel,
  getConnectedChannel,
} from "@/lib/web-api/creator";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

interface IProps {
  setYoutubeConnected: any;
  youtubeConnected: any;
  setInstagramConnected: any;
  instagramConnected: any;
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
      const response: IGetYTConnectChannelResponse =
        await getConnectedChannel();
      if (response?.data?.length) {
        let youtube = response?.data.findLast(
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

        let instagram = response?.data.findLast(
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
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/youtube/auth/callback`; // Backend endpoint
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${creatorId}`;

    window.location.href = authUrl; // Redirect user to Google login
  };

  const handleInstaLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
    const callBackUri = `${process.env.NEXT_PUBLIC_BACKEND_URL}/channel/creator/instagram/auth/callback`; // Backend endpoint
    const scope =
      "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish";
    const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callBackUri}&response_type=code&scope=${scope}&state=${creatorId}`;
    window.location.href = authUrl; // Redirect user to Google login
  };

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex gap-4 items-center">
            <img
              src="/assets/creator/Instagram-icon.svg"
              width={40}
              height={40}
            />
            <div>{translate("Instagram")}</div>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <Input
            label="Account Name"
            name="channels[0].account_name"
            type="text"
            placeholder="JohnDoe_Style"
            disabled
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full">
              <Input
                label="Handle Name"
                name="channels[0].handle_name"
                type="text"
                placeholder="@JohnDoe_Style"
                disabled
              />
            </div>
            <div className={`flex mt-5 ${instagramConnected ? "hidden" : ""}`}>
              {/* main button */}
              <Button
                loading={isLoading}
                className={cn("w-full lg:w-fit  font-medium px-8 h-[55px]")}
                size="small"
                onClick={handleInstaLogin}
                disabled={isLoading}
              >
                {"Connect"}
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <Input
            label="Account Link"
            name="channels[0].account_link"
            type="text"
            placeholder="https://instagram.com/JohnDoe_Style"
            disabled
          />
        </div>
        <div className="col-span-2">
          <div className="flex gap-4 items-center">
            <img
              src="/assets/creator/Youtube-icon.svg"
              width={40}
              height={40}
            />
            <div>{translate("You_tube")}</div>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <Input
            label="Account Name"
            name="channels[1].account_name"
            type="text"
            placeholder="John Doe Fashion"
            disabled
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full">
              <Input
                label="Handle Name"
                name="channels[1].handle_name"
                disabled
                type="text"
                placeholder="@JohnDoeFashion"
              />
            </div>
            <div className={`flex mt-5 ${youtubeConnected ? "hidden" : ""}`}>
              <Button
                className={cn("w-full lg:w-fit  font-medium px-8 h-[55px]")}
                size="small"
                onClick={handleGoogleLogin}
                loading={isLoading}
                disabled={isLoading}
              >
                {"Connect"}
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <Input
            label="Account Link"
            name="channels[1].account_link"
            type="text"
            disabled
            placeholder="https://youtube.com/@JohnDoeFashion"
          />
        </div>
      </div>
    </>
  );
}
