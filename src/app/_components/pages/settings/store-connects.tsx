"use client";
import Button from "@/app/_components/ui/button";
import React, { useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import { yupResolver } from "@hookform/resolvers/yup";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import {
  shopifyConnectSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { IShopifyConnectSchema } from "../../../../lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../ui/form/Input";

export default function StoreConnects() {
  const axios = useAxiosAuth();
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
    console.log("data-=----", data);

    try {
      let response: any = await axios.post("/channel/shopify/connect", data);
      console.log("response-=----", response);
      // if (response?.status === 200) {
      //   toast.success(response?.message);
      //   router.push("?");
      //   methods?.reset();
      //   return true;
      // }
    } catch (error) {
      // const errorMessage = getErrorMessage(error);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  console.log("errors", methods.formState.errors);

  return (
    <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-2 shadow-md">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-sm xl:text-lg font-semibold">
          {translate("store_integration")}
        </h2>
      </div>
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
              // className="rounded-xl h-[46px] text-[12px] xl:text-[16px] xl:h-[56px] bg-white"
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
    </div>
  );
}
