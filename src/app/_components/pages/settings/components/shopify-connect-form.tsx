"use client";
import Button from "@/app/_components/ui/button";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IShopifyConnectSchema,
  shopifyConnectSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { translate } from "@/lib/utils/translate";
import Input from "@/app/_components/ui/form/Input";
import { useRouter } from "next/navigation";
import axios from "@/lib/web-api/axios";

export default function ShopifyStoreConnects() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = shopifyConnectSchema;
  const methods = useForm<IShopifyConnectSchema>({
    defaultValues: {
      id_string: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = async (data: IShopifyConnectSchema) => {
    setLoading(true);

    try {
      let { data: response }: any = await axios.post(
        "/channel/shopify/connect",
        data
      );
      if (response?.status === 200) {
        toast.success(response?.message);
        router.refresh();
        methods?.reset();
        return true;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-1 xl:gap-4"
      >
        <div className="flex flex-col gap-2 text-[14px] xl:text-[16px] text-gray-500">
          <label>{translate("shopify_id")}</label>
          <Input
            name="id_string"
            placeholder={translate("enter_shopify_shopify_id")}
          />
        </div>
        <div className="flex  gap-2 text-[14px] xl:text-[16px] mt-4 xl:mt-6 text-gray-500">
          <Button
            type="submit"
            className="w-[215px]"
            disabled={loading}
            loading={loading}
          >
            {translate("connect_now")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
