"use client";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { IConnectYoutubeChannelResponse, IGetYTConnectChannelResponse } from "@/lib/types-api/creator";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import { connectYoutubeChannel, getConnectedChannel } from "@/lib/web-api/creator";
import axiosInstance from "@/lib/web-api/http-common";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SocialMedia({methods}:any) {
  const [youtubeConnected,setYoutubeConnected] = useState<boolean>(false); 
  useEffect(() => {
    fetchConnectedChannel()
  }, [])
  const fetchConnectedChannel = async () => {
    const response: IGetYTConnectChannelResponse = await getConnectedChannel();
    if (response?.data?.length) {
      let youtube = response?.data.findLast(ele => ele?.channelType === "youtube");
      if(youtube){
        methods.setValue(`channels[1].account_name`, youtube?.channelName)
            methods.setValue(`channels[1].account_link`,`https://youtube.com/${youtube?.handleName}`)
            methods.setValue(`channels[1].handle_name`,youtube?.handleName)
        setYoutubeConnected(true);
      } else setYoutubeConnected(false)
    }
  }

  const handleConnectChannel = async () => {
    const channels: any = ["channels[1].handle_name"];
    const isValid = await methods.trigger(channels);
    const values = methods.getValues();
    if(isValid){
      try {
        const response = await axiosInstance.post("/channel/creator/youtube/validate/channel",{channelName: values.channels[1].handle_name});
        if(response?.data?.status === 200){
          toast.success(response?.data?.message)
        }
        methods.setValue(`channels[1].account_name`, response?.data?.data?.channelName)
        methods.setValue(`channels[1].account_link`,`https://youtube.com/${values.channels[1].handle_name}`)
        setYoutubeConnected(true)
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        if(errorMessage){
          toast.error(errorMessage);
          setYoutubeConnected(false)
        }
        else throw new Error("Error While validating youtube channel");
      }
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div className="flex gap-4 items-center">
          <img src="/assets/creator/Instagram-icon.svg" width={40} height={40} />
          <div>Instagram</div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Input
          label="Account Name"
          name="channels[0].account_name"
          type="text"
          placeholder="Account_name"
        />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Input
          label="Handle Name"
          name="channels[0].handle_name"
          type="text"
          placeholder="@Handle_name"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Account Link"
          name="channels[0].account_link"
          type="text"
          placeholder="https://instagram.com/Account_name"
        />
      </div>
      <div className="col-span-2">
        <div className="flex gap-4 items-center">
          <img src="/assets/creator/Youtube-icon.svg" width={40} height={40} />
          <div>Youtube</div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Input
          label="Account Name"
          name="channels[1].account_name"
          type="text"
          placeholder="Account name"
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
            placeholder="Handlename"
          />
          </div>
          <div className={`flex items-end ${youtubeConnected ? "hidden":""}`}>
          <Button
            className={cn(
              "w-full lg:w-fit  font-medium px-8 h-[55px]"
            )}
            size="small"
            onClick={handleConnectChannel}
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
          placeholder="https://youtube.com/@Handle_name"
        />
      </div>
    </div>
  );
}
