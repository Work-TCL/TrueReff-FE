"use client";
import { Button as ButtonOutline } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import { FormProvider, useForm } from "react-hook-form";
import ProductSelectDropdown from "./_components/selectProduct";
import {
  campaignValidationSchema,
  ICampaignValidationSchema,
} from "@/lib/utils/validations";
import toast from "react-hot-toast";
import { formatForDateInput, getErrorMessage } from "@/lib/utils/commonUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "@/lib/types-api/vendor";
import MediaUploader from "./_components/mediaUploader";
import { useParams, useRouter } from "next/navigation";
import {
  createCampaign,
  getCampaign,
  updateCampaign,
} from "@/lib/web-api/campaign";
import Button from "../../ui/button";
import Loader from "../../components-common/layout/loader";
import { get } from "lodash";
import dynamic from "next/dynamic";
import { ICampaign } from "@/lib/types-api/campaign";

const Input = dynamic(() => import("../../ui/form/Input"), { ssr: false });

interface IAddProductDetailProps {
  isDetailView?: boolean;
}

export default function CreateCampaign(props: IAddProductDetailProps) {
  const params = useParams();
  const router = useRouter();
  const campaignId: any = params?.id !== "add" ? params?.id : null;
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [campaignData, setCampaignData] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [media, setMedia] = useState<{ images: File[]; video: File | null }>({
    images: [],
    video: null,
  });
  const [mediaPreview, setMediaPriview] = useState<{
    images: string[];
    video: string | null;
  }>({
    images: [],
    video: null,
  });
  const methods = useForm<ICampaignValidationSchema>({
    defaultValues: {},
    resolver: yupResolver(campaignValidationSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: ICampaignValidationSchema) => {
    if (!selectedProduct) {
      toast.error("select product required.");
      return;
    }
    setLoading(true);
    try {
      const formData: FormData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("discount_type", data.discount_type);
      formData.append("discount_value", data.discount_value.toString());
      formData.append("endDate", String(data.endDate));
      formData.append("startDate", String(data.startDate));
      formData.append("productId", selectedProduct?._id || "");

      data.channels.forEach((channel) => {
        formData.append("channels[]", channel);
      });

      // If you're including images as an array
      if (media.images && media.images.length > 0) {
        media.images.forEach((image: File, index: number) => {
          formData.append("images", image); // backend should expect array under 'images'
        });
      }
      if (media?.video) {
        formData.append("video", media.video);
      }

      // Make API call with formData
      let response: any;
      if (campaignId) {
        const deletedImages: string[] =
          campaignData?.imageUrls?.filter(
            (url) => !mediaPreview.images.includes(url)
          ) || [];

        // 2. If there was a video on the campaign but the preview no longer has one, mark that for deletion
        const deletedVideo: string[] =
          campaignData?.videoUrl && !mediaPreview.video
            ? [campaignData.videoUrl]
            : [];

        // 3. Combine into one array
        const deletedFiles = [...deletedImages, ...deletedVideo];
        if (deletedFiles && deletedFiles.length > 0) {
          formData.append("deleteMedias", JSON.stringify(deletedFiles));
        }

        response = await updateCampaign(formData, campaignId);
      } else {
        response = await createCampaign(formData);
      }
      console.log("response", response);

      if (response?.status === 201 || response?.status === 200) {
        toast.success(response?.message);
        methods?.reset();
        router?.push("/vendor/campaign");
        return true;
      }
      throw response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleProductSelect = (product: IProduct) => {
    console.log("Selected product:", product);
    setSelectedProduct(product);
    methods.setValue("productId", String(product._id));
    methods.setValue("price", 100);
    methods.trigger(["productId", "price"]);
  };

  const handleChannelChange = (channelName = "") => {
    const channels = Array.isArray(methods.watch("channels"))
      ? methods.watch("channels")
      : [];
    if (Boolean(channels?.includes(channelName))) {
      methods.setValue(
        "channels",
        channels?.filter((v) => v != channelName)
      );
    } else {
      methods.setValue("channels", [...channels, channelName]);
    }
    methods.trigger("channels");
  };

  useEffect(() => {
    if (campaignId) {
      (async () => {
        const response = await getCampaign({ id: campaignId });
        methods.setValue("name", response.name);
        methods.setValue("description", response.description);
        methods.setValue("channels", response.channels);
        methods.setValue("discount_type", response.discount_type);
        methods.setValue("discount_value", response.discount_value);
        //@ts-ignore
        methods.setValue("endDate", formatForDateInput(response.endDate));
        //@ts-ignore
        methods.setValue("startDate", formatForDateInput(response.startDate));
        methods.setValue("productId", response.productId._id);
        methods.setValue("price", 200);
        setMediaPriview((prev: any) => {
          prev.images = response.imageUrls;
          prev.video = response?.videoUrl;
          return prev;
        });

        setSelectedProduct(response.productId);
        setCampaignData(response);
      })();
    }
  }, [campaignId]);

  console.log(
    "deletedFiles---images------->> ",
    campaignData?.imageUrls
      ? campaignData?.imageUrls
          ?.map((v) => (!mediaPreview.images.includes(v) ? v : ""))
          .filter((v) => v && v)
      : [],
    "deletedFiles---video------->> ",
    campaignData?.videoUrl ? !mediaPreview.video : "NO"
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 h-full px-4 py-3"
      >
        {loading && <Loader />}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="md:text-[20px] text-base text-500">
            {translate("Campaign_Details_Form")}
          </div>
          <div className="flex gap-[10px]">
            <ButtonOutline
              type="button"
              variant="outline"
              className="rounded-[12px]"
            >
              {translate("Cancel")}
            </ButtonOutline>
            <Button
              type="submit"
              className="text-white rounded-[12px] text-sm py-2"
            >
              {!campaignId
                ? translate("Start_Campaign")
                : translate("Edit_Campaign")}
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-[16px]">
                {translate("General_Information")}
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  name="name"
                  placeholder={`${translate("Type_campaign_name_here")}`}
                  label={`${translate("Campaign_Name")}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  type="textarea"
                  placeholder={translate("Type_campaign_description_here")}
                  label={translate("Description")}
                  name="description"
                  rows={5}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full lg:w-1/2 gap-1">
                  <Input
                    name="startDate"
                    type="date"
                    placeholder={translate("Select_date")}
                    label={translate("Campaign_Start_Date")}
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() + 1))
                    }
                  />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 gap-1">
                  <Input
                    name="endDate"
                    type="date"
                    placeholder={translate("Select_date")}
                    label={translate("Campaign_End_Date")}
                    minDate={
                      methods.watch("startDate")
                        ? new Date(
                            new Date(methods.watch("startDate")).setDate(
                              new Date(methods.watch("startDate")).getDate() + 1
                            )
                          )
                        : new Date(new Date().setDate(new Date().getDate() + 2))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-[16px]">{translate("Product_Media")}</div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full gap-1">
                  <MediaUploader
                    onMediaChange={setMedia}
                    mediaPreview={mediaPreview}
                    setMediaPriview={setMediaPriview}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-[16px]">
                {translate("Product_Selection")}
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full gap-1">
                  <ProductSelectDropdown
                    onSelect={handleProductSelect}
                    selectedProduct={selectedProduct}
                  />
                  {Boolean(get(methods.formState.errors, "productId")) && (
                    <span className="text-red-600 text-sm p-2 block">
                      {methods.formState.errors["productId"]?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-[16px]">
                {translate("Campaign_Channels")}{" "}
              </div>
              <div className="pt-2">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex gap-1">
                    <Input
                      name="channels"
                      type="checkbox"
                      placeholder={translate("Add_link")}
                      label={translate("Instagram")}
                      checked={Boolean(
                        methods.watch("channels")?.includes("instagram")
                      )}
                      onChange={(v) => {
                        handleChannelChange("instagram");
                      }}
                      hideError={true}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Input
                      name="chanls"
                      type="checkbox"
                      placeholder={translate("Add_link")}
                      label={translate("You_tube")}
                      checked={Boolean(
                        methods.watch("channels")?.includes("youtube")
                      )}
                      onChange={(v) => {
                        handleChannelChange("youtube");
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Input
                      name="cha"
                      type="checkbox"
                      placeholder={translate("Add_link")}
                      label={translate("Facebook")}
                      checked={Boolean(
                        methods.watch("channels")?.includes("facebook")
                      )}
                      onChange={(v) => {
                        handleChannelChange("facebook");
                      }}
                      disabled
                    />
                  </div>
                </div>
                {Boolean(get(methods.formState.errors, "channels")) && (
                  <span className="text-red-600 text-sm p-2 block">
                    {methods.formState.errors["channels"]?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
              <div className="text-[16px]">
                {translate("Discount/Price Range")}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="price"
                      type="number"
                      placeholder={"10"}
                      label={translate("Price")}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="discount_type"
                      type="select"
                      placeholder={translate("Select_Discount_Type")}
                      label={translate("Discount_Type")}
                      options={[
                        {
                          label: "Amount",
                          value: "FIXED_AMOUNT",
                        },
                        {
                          label: "Percentage",
                          value: "PERCENTAGE",
                        },
                      ]}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="discount_value"
                      type="number"
                      placeholder={"10"}
                      label={translate("Discount")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
