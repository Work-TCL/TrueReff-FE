"use client";
import ChannelForm from "@/app/_components/pages/pre-form/components/channel-form";
import WordPressChannelForm from "@/app/_components/pages/pre-form/components/word-press-connect";
import { useVendorStore } from "@/lib/store/vendor";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { IVendorRegisterThirdStepSchema, IVendorWordPressConnectSchema, vendorRegisterThirdStepSchema, vendorWordPressConnectSchema } from "@/lib/utils/validations";
import axios from "@/lib/web-api/axios";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function StoreConnect() {
  const { setVendorData } = useVendorStore();
  const [channels, setChannels] = useState<any[]>([]);
  console.log("channels",channels)
  const [loading, setLoading] = useState<boolean>(false);
  const [wordPressLoading, setWordPressLoading] = useState<boolean>(false);

  useEffect(() => {
    getConnectedChannel();
  }, []);
  const getConnectedChannel = async () => {
    setLoading(true);
    try {
      const res: any[] = await getConnectedChannelsList();
      if (Array.isArray(res)) {
        setChannels(res);
        setLoading(false)
      } else {
        setChannels([]);
        setLoading(false)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  }
  const channelMethods = useForm<IVendorRegisterThirdStepSchema>({
    defaultValues: {
      shopify_store_id: ""
    },
    resolver: yupResolver(vendorRegisterThirdStepSchema),
    mode: "onSubmit",
  });
  const wordPressMethods = useForm<IVendorWordPressConnectSchema>({
    defaultValues: {
      wordpress_store_domain: "",
      wordpress_store_id: ""
    },
    resolver: yupResolver(vendorWordPressConnectSchema),
    mode: "onSubmit",
  });
  const handleOnChannelConnect = async (data: IVendorRegisterThirdStepSchema) => {
    setLoading(true);
    try {
      const payload: any = {
        uniqueId: data.shopify_store_id,
        shopUrl: data.shopify_store_domain,
      };
      let { data: response }: any = await axios.post(
        "/channel/shopify/connect",
        payload
      );

      if (response?.status === 200) {
        await getConnectedChannel();
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
          status: response?.data?.status,
        })
        toastMessage.success("Shopify Store Connected Successfully.")
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  const handleOnWordPressConnect = async (data: IVendorWordPressConnectSchema) => {
    setWordPressLoading(true);
    try {
      const payload: any = {
        uniqueId: data.wordpress_store_id,
        shopUrl: data.wordpress_store_domain,
      };
      let { data: response }: any = await axios.post(
        "/channel/wordpress/connect",
        payload
      );

      if (response?.status === 200) {
        await getConnectedChannel();
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
          status: response?.data?.status,
        })
        toastMessage.success("WordPress Store Connected Successfully.")
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setWordPressLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col p-4 gap-2 bg-white rounded-lg">
        <FormProvider {...channelMethods}>
          <form
            onSubmit={channelMethods.handleSubmit(handleOnChannelConnect)}
            className=" w-full h-full overflow-auto flex-1 flex flex-col justify-between gap-3 relative"
          >
            <ChannelForm loading={loading} channels={channels} methods={channelMethods}/>
          </form>
        </FormProvider>
        <FormProvider {...wordPressMethods}>
          <form
            onSubmit={wordPressMethods.handleSubmit(handleOnWordPressConnect)}
            className="w-full h-full overflow-auto flex-1 flex flex-col justify-between gap-3 relative"
          >
            <WordPressChannelForm loading={wordPressLoading} channels={channels} />
          </form>
        </FormProvider>
      </div>
    </>
  );
}
