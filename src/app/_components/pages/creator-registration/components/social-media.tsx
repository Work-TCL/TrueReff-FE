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
import {
  connectYoutubeChannel,
  getConnectedChannel,
} from "@/lib/web-api/creator";
import axiosInstance from "@/lib/web-api/http-common";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

interface IProps {
  code?: string;
  setYoutubeConnected: any;
  youtubeConnected: any;
}

export default function SocialMedia({
  code = "",
  setYoutubeConnected,
  youtubeConnected,
}: IProps) {
  const methods = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchConnectedChannel();
  }, []);
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
      }
    } catch (error) {
      console.log("while fetching conncted channels");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleConnectChannel = async () => {
    setIsLoading(true);
    try {
      const channels: any = ["channels[1].handle_name"];
      const isValid = await methods.trigger(channels);
      const values = methods.getValues();
      if (isValid) {
        try {
          const response = await axiosInstance.post(
            "/channel/creator/youtube/validate/channel",
            { channelName: values.channels[1].handle_name }
          );
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message);
          }
          methods.setValue(
            `channels[1].account_name`,
            response?.data?.data?.channelName
          );
          methods.setValue(
            `channels[1].account_link`,
            `https://youtube.com/${values.channels[1].handle_name}`
          );
          setYoutubeConnected(true);
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          if (errorMessage) {
            toast.error(errorMessage);
            setYoutubeConnected(false);
          } else throw new Error("Error While validating youtube channel");
        }
      }
    } catch (error) {
      console.log("while youtube connecting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectInstagram = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/channel/creator/instagram/auth/callback/?code=${code}`
      );
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      }
      methods.setValue(
        `channels[0].account_name`,
        response?.data?.data?.channelName
      );
      methods.setValue(
        `channels[0].handle_name`,
        response?.data?.data?.channelName
      );
      // methods.setValue(
      //   `channels[0].account_link`,
      //   `https://youtube.com/${values.channels[1].handle_name}`
      // );
      // setYoutubeConnected(true);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage) {
        toast.error(errorMessage);
        // setYoutubeConnected(false);
      } else throw new Error("Error While validating youtube channel");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      handleConnectInstagram();
    }
  }, [code]);

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
            <div>Instagram</div>
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
            <div className={`flex mt-5 ${youtubeConnected ? "hidden" : ""}`}>
              {/* main button */}
              {/* <AnchorButton
              loading={isLoading}
              href="https://www.instagram.com/oauth/authorize?client_id=9535212806541456&redirect_uri=https://192.168.235.236:3000/creator-registration&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish"
              className={cn("w-full lg:w-fit  font-medium px-8 h-[55px]")}
              size="small"
              
              // onClick={handleConnectInstagram}
            >
              {"Connect"}
            </AnchorButton> */}

              {/* temporary */}
              <Button
                // loading={isLoading}
                className={cn("w-full lg:w-fit  font-medium px-8 h-[55px]")}
                size="small"
                disabled
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
            <div>Youtube</div>
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
                disabled={youtubeConnected}
                type="text"
                placeholder="@JohnDoeFashion"
              />
            </div>
            <div className={`flex mt-5 ${youtubeConnected ? "hidden" : ""}`}>
              <Button
                className={cn("w-full lg:w-fit  font-medium px-8 h-[55px]")}
                size="small"
                onClick={handleConnectChannel}
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
