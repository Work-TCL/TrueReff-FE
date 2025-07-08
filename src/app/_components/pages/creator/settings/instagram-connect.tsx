"use client";
import { useCreatorStore } from "@/lib/store/creator";
import { IGetYTConnectChannelResponse } from "@/lib/types-api/creator";
import { getConnectedChannel } from "@/lib/web-api/creator";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SocialMedia from "../../creator-registration/components/social-media";

export default function ChannelsConnect() {
  const methods = useForm();
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(false);
  const [instagramConnected, setInstagramConnected] = useState<boolean>(false);
  const { creator } = useCreatorStore();
  const searchParams = useSearchParams();
  const router = useRouter();
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
    }
  };

  return (
    <SocialMedia  
    setYoutubeConnected={setYoutubeConnected}
    youtubeConnected={youtubeConnected}
    instagramConnected={instagramConnected}
    setInstagramConnected={setInstagramConnected}
    methods={methods}
    creator={creator}
    />
  );
}
