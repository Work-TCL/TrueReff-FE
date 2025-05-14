"use client";
import { Button as ButtonOutline } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  campaignProductValidationSchema,
  campaignValidationSchema,
  campaignValidationUpdateSchema,
  ICampaignProductValidationSchema,
  ICampaignValidationSchema,
} from "@/lib/utils/validations";
import toast from "react-hot-toast";
import { formatForDateInput, getErrorMessage } from "@/lib/utils/commonUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import MediaUploader from "./_components/mediaUploader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  createCampaign,
  createCampaignProduct,
  updateCampaign,
} from "@/lib/web-api/campaign";
import Button from "../../ui/button";
import Loader from "../../components-common/layout/loader";
import { get } from "lodash";
import dynamic from "next/dynamic";
import { ICampaign } from "@/lib/types-api/campaign";
import { useTranslations } from "next-intl";
import LightButton from "../../ui/button/variant/light-button";
import { labelStyle } from "../../ui/form/Input";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import axios from "@/lib/web-api/axios";
import { ICategoryData } from "@/lib/types-api/auth";
import { getCategories } from "@/lib/web-api/auth";

const Input = dynamic(() => import("../../ui/form/Input"), { ssr: false });

interface IAddProductDetailProps {
  isDetailView?: boolean;
}

interface IProduct {
  handle: string;
  id: string;
  image: string;
  title: string;
  category: string;
  tags: string[];
  sku: string;
  price: string;
  totalInventory: number;
  description: string;
  createdAt: string;
}

const VIDEO_TYPE = [
  {
    label: "UGC",
    value: "UGC",
  },
  {
    label: "Product Reviews",
    value: "Product Reviews",
  },
  {
    label: "Unboxing Videos",
    value: "Unboxing Videos",
  },
  {
    label: "How-To / Tutorials",
    value: "How-To / Tutorials",
  },
  {
    label: "Comparison Videos",
    value: "Comparison Videos",
  },
  {
    label: "Top 5 / Top 10 Lists",
    value: "Top 5 / Top 10 Lists",
  },
  {
    label: "Vlogs with Product Integration",
    value: "Vlogs with Product Integration",
  },
  {
    label: "Challenges or Trends",
    value: "Challenges or Trends",
  },
  {
    label: "Testimonials / Personal Experience",
    value: "Testimonials / Personal Experience",
  },
];

export default function CreateProductCampaign(props: IAddProductDetailProps) {
  const translate = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId: any = params?.id !== "add" ? params?.id : null;
  const shopifyId: any = searchParams?.get("productId");
  const isDisabled: any = props?.isDetailView;
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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
  // campaign mixin
  const [mediaMixin, setMediaMixin] = useState<{
    images: File[];
    video: File | null;
  }>({
    images: [],
    video: null,
  });
  const [mediaPreviewMixin, setMediaPriviewMixin] = useState<{
    images: string[];
    video: string | null;
  }>({
    images: [],
    video: null,
  });
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
    } catch (error: any) {
      console.log("Error Fetching channels", error.message);
    }
  };

  const methods = useForm<ICampaignProductValidationSchema>({
    defaultValues: {},
    //@ts-ignore
    resolver: campaignId
      ? yupResolver(campaignValidationUpdateSchema)
      : yupResolver(campaignProductValidationSchema),
    mode: "onChange",
  });
  const { control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore
    name: "references",
  });

  console.log("------errors", methods.formState.errors);

  const onSubmit = async (data: ICampaignProductValidationSchema) => {
    console.log("data-->>", data);

    if (!selectedProduct) {
      toast.error("select product required.");
      return;
    }
    setLoading(true);
    try {
      const formData: FormData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("channelName", "shopify");
      formData.append("videoType", data?.videoType);
      formData.append("notes", data?.notes);
      formData.append("discount_type", data.discount_type);
      formData.append("discount_value", data.discount_value.toString());
      formData.append("endDate", String(data.endDate));
      formData.append("startDate", String(data.startDate));
      formData.append("productId", selectedProduct?.id || "");
      //@ts-ignore
      formData.append("commission", data.commission);
      formData.append("commission_type", data?.commission_type);
      //@ts-ignore
      formData.append("lifetime", data?.campaignLifeTime);
      // formData.append("category", data.category);
      // formData.append("sub_category", data.sub_category);

      data.channels.forEach((channel) => {
        formData.append("channels[]", channel);
      });
      data?.category?.forEach((opt: any, i: number) => {
        formData.append(`category[${i}]`, opt?.value);
      });
      data?.sub_category?.forEach((opt: any, i: number) => {
        formData.append(`subCategory[${i}]`, opt?.value);
      });
      selectedProduct?.tags.forEach((tag: string, i: number) => {
        formData.append(`tags[${i}]`, tag);
      });
      data?.references?.forEach((link: string, i: number) => {
        formData.append(`referenceLinks[${i}]`, link);
      });

      // If you're including images as an array
      if (media.images && media.images.length > 0) {
        media.images.forEach((image: File, index: number) => {
          formData.append("images", image); // backend should expect array under 'images'
        });
      }
      if (mediaMixin.images && mediaMixin.images.length > 0) {
        mediaMixin.images.forEach((image: File, index: number) => {
          formData.append("creatorMaterial", image); // backend should expect array under 'images'
        });
      }
      if (media?.video) {
        formData.append("video", media.video);
      }
      if (mediaMixin?.video) {
        formData.append("creatorMaterial", mediaMixin.video);
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
        response = await createCampaignProduct(formData);
      }
      console.log("response", response);

      if (response?.status === 201 || response?.status === 200) {
        toast.success(response?.message);
        methods?.reset();
        router?.push("/vendor/products/channel-products");
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
    methods.setValue("name", String(product?.title));
    methods.setValue("description", String(product?.description || "-"));
    methods.setValue("productId", String(product?.id));
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

  const fetchShopifyProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product?productId=${shopifyId}`
      );

      const product: any = response?.data?.data;
      const images = product?.featuredMedia?.preview?.image?.url;

      setSelectedProduct({ ...product, media: images });
      handleProductSelect({ ...product, media: images });
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    (async () => {
      const categoriesId =
        (await methods.watch("category")?.map((v: any) => v.value)) || [];

      const optionsSubCategory = await categories.filter((ele) =>
        categoriesId?.includes(ele?.parentId)
      );

      setSubCategory(optionsSubCategory);
      const availableSubCategoriesIds = optionsSubCategory.map((v) => v?._id);
      const subCategoroies = methods.watch("sub_category") || [];
      methods.setValue(
        "sub_category",
        subCategoroies.filter((v: any) =>
          availableSubCategoriesIds.includes(v.value)
        )
      );
    })();
  }, [methods.watch("category")?.length]);

  useEffect(() => {
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, []);

  // useEffect(() => {
  //   if (campaignId) {
  //     (async () => {
  //       setLoading(true);
  //       try {
  //         const response = await getCampaign({ id: campaignId });
  //         methods.setValue("name", response.name);
  //         methods.setValue("description", response.description);
  //         methods.setValue("channels", response.channels);
  //         methods.setValue("discount_type", response.discount_type);
  //         methods.setValue("discount_value", response.discount_value);
  //         //@ts-ignore
  //         methods.setValue("endDate", formatForDateInput(response.endDate));
  //         //@ts-ignore
  //         methods.setValue("startDate", formatForDateInput(response.startDate));
  //         methods.setValue("productId", response.productId._id);
  //         methods.setValue("price", 200);
  //         setMediaPriview((prev: any) => {
  //           prev.images = response.imageUrls;
  //           prev.video = response?.videoUrl;
  //           return prev;
  //         });

  //         setSelectedProduct(response.productId);
  //         setCampaignData(response);
  //       } catch (e) {
  //         console.log("while fetch campaign");
  //       } finally {
  //         setLoading(false);
  //       }
  //     })();
  //   }
  // }, [campaignId]);

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
          {!isDisabled ? (
            <div className="flex gap-[10px]">
              <ButtonOutline
                type="button"
                variant="outline"
                className="rounded-[12px]"
                onClick={() => router?.push("/vendor/campaign")}
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
          ) : null}
        </div>
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("General_Information")}
              </div>
              <div className="flex flex-col gap-1">
                {selectedProduct?.media?.length && (
                  <div className="mb-2 mt-2">
                    {selectedProduct?.media?.map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        className="w-20 border h-20 rounded-sm"
                      />
                    ))}
                  </div>
                )}
                <label className={labelStyle}>{`${translate(
                  "product_name"
                )}`}</label>
                <p className="text-secondary font-medium md:text-lg text-base">
                  {selectedProduct?.title || "-"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelStyle}>{`${translate(
                  "Product_Description"
                )}`}</label>
                <p className="text-secondary font-medium md:text-lg text-base">
                  {selectedProduct?.description || "-"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelStyle}>{`${translate("Tags")}`}</label>
                <div className="text-secondary font-medium md:text-lg text-base">
                  {selectedProduct?.tags?.length > 0 && (
                    <div className="text-gray-500 text-sm flex flex-wrap gap-2">
                      {selectedProduct?.tags?.map((v: string, i: number) => (
                        <TruncateWithToolTip
                          key={i}
                          checkHorizontalOverflow={true}
                          className="line-clamp-none truncate bg-background py-1 px-2 rounded text-xs sm:text-sm"
                          text={`#${v}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-2">
                <div className="md:col-span-1 col-span-2">
                  <Input
                    label={translate("Category")}
                    placeholder={translate("Select_Category")}
                    name="category"
                    type="multiSelectWithTags"
                    options={parentCategory?.map((ele) => ({
                      value: ele?._id,
                      label: ele?.name,
                    }))}
                    autoFocus={false}
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <Input
                    label={translate("Sub_category")}
                    placeholder={translate("Select_Sub_Category")}
                    name="sub_category"
                    type="multiSelectWithTags"
                    options={subCategory.map((ele) => ({
                      value: ele?._id,
                      label: ele?.name,
                    }))}
                    autoFocus={false}
                  />
                </div>
              </div>
              {/* {methods.watch("campaignLifeTime") ? null : ( */}
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
                    disabled={isDisabled}
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
                            //@ts-ignore
                            new Date(methods.watch("startDate")).setDate(
                              //@ts-ignore
                              new Date(methods.watch("startDate")).getDate() + 1
                            )
                          )
                        : new Date(new Date().setDate(new Date().getDate() + 2))
                    }
                    disabled={isDisabled}
                  />
                </div>
              </div>
              {/* )} */}

              <div className="flex gap-1 cursor-pointer">
                <Input
                  name="channels"
                  type="checkbox"
                  placeholder={translate("Add_link")}
                  label={translate("CampaignLifeTime")}
                  checked={Boolean(methods.watch("campaignLifeTime"))}
                  onChange={(v) => {
                    methods.setValue(
                      "campaignLifeTime",
                      !Boolean(methods.watch("campaignLifeTime"))
                    );
                  }}
                  hideError={true}
                  disabled={isDisabled}
                />
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("Product_Media")}
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full gap-1">
                  <MediaUploader
                    onMediaChange={setMedia}
                    mediaPreview={mediaPreview}
                    setMediaPriview={setMediaPriview}
                    disabled={isDisabled}
                    videoTypeComponent={() => {
                      return (
                        <div className="flex flex-col w-full gap-1">
                          <Input
                            name="videoType"
                            type="select"
                            placeholder={translate("Select_Video_Type")}
                            label={translate("videoType")}
                            options={VIDEO_TYPE}
                            disabled={isDisabled}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("Campaign_Channels")}{" "}
              </div>
              <div className="pt-2">
                <div className="flex flex-col md:flex-row gap-6">
                  {!isDisabled ? (
                    <div className="flex gap-1 cursor-pointer">
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
                        disabled={isDisabled}
                      />
                    </div>
                  ) : null}

                  {!isDisabled ? (
                    <div className="flex gap-1 cursor-pointer">
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
                        disabled={isDisabled}
                      />
                    </div>
                  ) : null}
                  {!isDisabled ? (
                    <div className="flex gap-1 cursor-pointer">
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
                  ) : null}
                  {isDisabled
                    ? methods
                        .watch("channels")
                        ?.map((v) => (
                          <div className="flex gap-1 bg-background p-2 rounded-md">
                            {v}
                          </div>
                        ))
                    : null}
                </div>
                {Boolean(get(methods.formState.errors, "channels")) && (
                  <span className="text-red-600 text-sm p-2 block">
                    {methods.formState.errors["channels"]?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("Creator_material")}
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full gap-1">
                  <MediaUploader
                    onMediaChange={setMediaMixin}
                    mediaPreview={mediaPreviewMixin}
                    setMediaPriview={setMediaPriviewMixin}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("Discount/Price Range")}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="couponCode"
                      type="text"
                      placeholder={"COUP0nC0dE"}
                      label={translate("couponCode")}
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
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="discount_value"
                      type="number"
                      placeholder={"10"}
                      label={translate("Discount")}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("CreatorCommission")}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="commission_type"
                      type="select"
                      placeholder={translate("Select_Commission_Type")}
                      label={translate("Commission_Type")}
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
                      disabled={isDisabled}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="commission"
                      type="number"
                      placeholder={"10"}
                      label={translate("commission")}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
              <div className="text-lg font-medium text-gray-500">
                {translate("NoteAndCampaign")}
              </div>
              <div className="flex flex-col w-full gap-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-1">
                    <div className="flex-1">
                      <Input
                        name={`references.${index}`}
                        type="text"
                        placeholder="https://example.com"
                        label={`Reference Link #${index + 1}`}
                      />
                      {/* {errors.references?.[index] && (
                          <p className="text-sm text-red-500">
                            {errors.references[index]?.message}
                          </p>
                        )} */}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:underline h-full mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <LightButton
                  type="button"
                  onClick={() => append("")}
                  className="text-blue-600 hover:underline me-auto mt-2 mb-3"
                >
                  + {translate("Add_References_Link")}
                </LightButton>
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-col w-full gap-1">
                  {/* <div className="flex flex-col gap-1"> */}
                  <Input
                    type="textarea"
                    placeholder={translate("Type_product_note_here")}
                    label={translate("Product_Note")}
                    name="notes"
                    rows={5}
                    disabled={isDisabled}
                  />
                  {/* </div> */}
                  {/* <ProductSelectDropdown
                    onSelect={handleProductSelect}
                    selectedProduct={selectedProduct}
                    disabled={isDisabled}
                  /> */}
                  {Boolean(get(methods.formState.errors, "productId")) && (
                    <span className="text-red-600 text-sm p-2 block">
                      {methods.formState.errors["productId"]?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
              <div className="text-lg font-medium text-gray-500">
                {translate("TermsCondition")}{" "}
              </div>
              <div className="pt-2">
                <div className="flex flex-col md:flex-row gap-6">
                  {!isDisabled ? (
                    <div className="flex gap-1 cursor-pointer">
                      <Input
                        name="tearmAndCondition"
                        type="checkbox"
                        label={translate("campaignTerms")}
                        checked={Boolean(methods.watch("tearmAndCondition"))}
                        onChange={(v) => {
                          methods.setValue(
                            "tearmAndCondition",
                            !Boolean(methods.watch("tearmAndCondition"))
                          );
                        }}
                        hideError={true}
                      />
                    </div>
                  ) : null}
                </div>
                {Boolean(
                  get(methods.formState.errors, "tearmAndCondition")
                ) && (
                  <span className="text-red-600 text-sm p-2 block">
                    {methods.formState.errors["tearmAndCondition"]?.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
