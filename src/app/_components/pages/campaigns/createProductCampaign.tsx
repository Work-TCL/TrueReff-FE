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
import {
  cn,
  formatForDateInput,
  getErrorMessage,
} from "@/lib/utils/commonUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import MediaUploader from "./_components/mediaUploader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  createCampaign,
  createCampaignProduct,
  updateCampaign,
  updateCampaignProduct,
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
import CreatorMaterial from "./_components/creator-material";
import CampaignProductView from "./_components/product-view";
import { VIDEO_TYPE } from "@/lib/utils/constants";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function CreateProductCampaign(props: IAddProductDetailProps) {
  const translate = useTranslations();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId: any = params?.productId !== "add" ? params?.productId : null;
  const shopifyId: any = searchParams?.get("productId");
  const isDisabled: any = props?.isDetailView;
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
  const [showDiscountSection, setShowDiscountSection] = useState(true);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
      methods.setValue(
        "sub_category",
        categories
          ?.filter((ele) => campaignData?.subCategory?.includes(ele?._id))
          ?.map((v: any) => ({
            label: v?.name,
            value: v?._id,
          }))
      );
    } catch (error: any) {
      console.log("Error Fetching channels", error.message);
    }
  };

  const methods = useForm<ICampaignProductValidationSchema>({
    defaultValues: {
      references: [""],
    },
    //@ts-ignore
    resolver: productId
      ? yupResolver(campaignProductValidationSchema)
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
      // formData.append("videoType", );
      formData.append("notes", data?.notes);
      formData.append("discount_type", data.discount_type);
      formData.append("discount_value", data.discount_value.toString());
      formData.append("productId", selectedProduct?.id || "");
      //@ts-ignore
      formData.append("commission", data.commission);
      formData.append("commission_type", data?.commission_type);

      //@ts-ignore
      formData.append("lifeTime", data?.campaignLifeTime);
      formData.append("startDate", String(data.startDate));
      if (!data?.campaignLifeTime) {
        formData.append("endDate", String(data.endDate));
      }
      data.channels.forEach((channel) => {
        formData.append("channels[]", channel);
      });
      data.videoType.forEach((v: string, i: number) => {
        formData.append(`videoType[${i}]`, v);
      });
      data?.category?.forEach((opt: any, i: number) => {
        formData.append(`category[${i}]`, opt?.value);
      });
      data?.sub_category?.forEach((opt: any, i: number) => {
        formData.append(`subCategory[${i}]`, opt?.value);
      });
      data.tags.forEach((tag: string, i: number) => {
        formData.append(`tags[${i}]`, tag);
      });
      data?.references?.forEach((link: string, i: number) => {
        formData.append(`referenceLinks[${i}]`, link);
      });

      // If you're including images as an array
      if (mediaMixin.images && mediaMixin.images.length > 0) {
        mediaMixin.images.forEach((image: File, index: number) => {
          formData.append("creatorMaterial", image); // backend should expect array under 'images'
        });
      }
      if (mediaMixin?.video) {
        formData.append("creatorMaterial", mediaMixin.video);
      }

      // Make API call with formData
      let response: any;
      if (productId) {
        // const deletedImages: string[] =
        //   campaignData?.imageUrls?.filter(
        //     (url) => !mediaPreview.images.includes(url)
        //   ) || [];

        // // 2. If there was a video on the campaign but the preview no longer has one, mark that for deletion
        // const deletedVideo: string[] =
        //   campaignData?.videoUrl && !mediaPreview.video
        //     ? [campaignData.videoUrl]
        //     : [];

        // // 3. Combine into one array
        // const deletedFiles = [...deletedImages, ...deletedVideo];
        // if (deletedFiles && deletedFiles.length > 0) {
        //   formData.append("deleteMedias", JSON.stringify(deletedFiles));
        // }

        response = await updateCampaignProduct(formData);
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
      console.log("product", product);

      const images = product?.media?.nodes?.map(
        (v: any) => v?.image?.url && v?.image?.url
      );

      // productId({ ...product, media: images });
      handleProductSelect({ ...product, media: images });
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/product/${productId}`);

      console.log("response -->>", response);
      const product: any = response?.data?.data?.data;

      if (product) {
        const images = product.media;
        // // ✅ Update product state
        const updatedProduct = {
          id: product._id,
          productId: product._id,
          media: images,
          title: product.title,
          tags: product?.tags || [],
          description: product?.description || "", // Add description if available
          price: product?.price || 0,
          sku: product?.sku || "",
          totalInventory: product?.totalInventory || 0,
          variants: product?.variants?.nodes || [],
        };
        setSelectedProduct(updatedProduct);
        return product;
      } else {
        throw "Data not found";
      }
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
      // setNotFounded(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (fields.length === 0) {
      append(""); // adds an empty string if none exists
    }
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
    fetchCategory();
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, []);

  useEffect(() => {
    console.log("productId", params, productId, productId);
    if (productId) {
      (async () => {
        setLoading(true);
        try {
          const response = await fetchProductById();
          methods.setValue("tags", response.tags);
          methods.setValue(
            "category",
            response.category?.map((v: any) => ({
              label: v?.name,
              value: v?._id,
            }))
          );
          methods.setValue(
            "sub_category",
            categories
              ?.filter((ele) => response?.subCategory?.includes(ele?._id))
              ?.map((v: any) => ({
                label: v?.name,
                value: v?._id,
              }))
          );
          methods.setValue("name", response?.title);
          methods.setValue("description", response?.description || "-");
          methods.setValue("notes", response?.notes);
          methods.setValue("campaignLifeTime", Boolean(response?.lifeTime));
          methods.setValue("videoType", response?.videoType);
          methods.setValue("commission", response?.commission);
          methods.setValue("commission_type", response?.commission_type);
          methods.setValue("references", response?.referenceLinks);
          methods.setValue("channels", response?.channels);
          methods.setValue("couponCode", response?.couponCode);
          methods.setValue("discount_type", response?.discountType);
          methods.setValue("discount_value", response?.discount);
          //@ts-ignore
          methods.setValue("endDate", formatForDateInput(response?.endDate));
          methods.setValue(
            "startDate",
            //@ts-ignore
            formatForDateInput(response?.startDate)
          );
          methods.setValue("tearmAndCondition", true);
          methods.setValue("productId", response?._id);
          methods.setValue("price", 200);
          setMediaPriviewMixin((prev: any) => {
            prev.images = response.creatorMaterial.filter(
              (v: string) => !Boolean(v.endsWith(".mp4"))
            );
            prev.video = response?.creatorMaterial?.find((url: string) =>
              url.endsWith(".mp4")
            );
            return prev;
          });

          // setSelectedProduct(response.productId);
          setCampaignData(response);
        } catch (e) {
          console.log("while fetch campaign");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [productId]);

  const startDateRaw = methods.watch("startDate");
  const startDate = startDateRaw ? new Date(startDateRaw) : null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const endMinDate = startDate
    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // next day after startDate
    : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  console.log("selectedProduct", selectedProduct);

  const toggleChip = (value: string) => {
    const existingVal = methods.watch("videoType") || [];
    if (existingVal?.includes(value)) {
      methods.setValue(
        "videoType",
        existingVal?.filter((v: string) => v !== value)
      );
    } else {
      methods.setValue("videoType", [...(existingVal || []), value]);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 h-full px-4 py-3"
      >
        {loading && <Loader />}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="md:text-[20px] text-base text-500">
            {translate("Campaign_Details_Form")}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="text-lg font-medium text-gray-500">
                {translate("General_Information")}
              </div>
              <CampaignProductView
                images={
                  selectedProduct?.media?.length > 0
                    ? selectedProduct?.media
                    : []
                }
                title={selectedProduct?.title}
                description={selectedProduct?.description}
                // tags={
                //   Array.isArray(selectedProduct?.tags)
                //     ? selectedProduct?.tags
                //     : undefined
                // }
                price={
                  selectedProduct?.variants?.nodes?.length > 0
                    ? selectedProduct?.variants?.nodes[0]?.price || undefined
                    : undefined
                }
                totalInventory={selectedProduct?.totalInventory}
              />
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-2">
                {/* <div className="md:col-span-2 col-span-2"> */}
                <Input
                  label={translate("Tags")}
                  name="tags"
                  type="renderTagInputUpdated"
                  placeholder={translate("Enter_your_tags")}
                  inputClassName="h-[50]"
                />

                <div className="flex flex-col">
                  <label className={cn(labelStyle)}>
                    {translate("Campaign_Channels")}
                  </label>
                  <div className="flex items-center h-full">
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
                {/* </div> */}
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
              <div className="grid md:grid-cols-3 grid-cols-1 gap-3 mb-2">
                {/* {methods.watch("campaignLifeTime") ? null : ( */}
                {/* <div className="flex flex-col lg:flex-row gap-3"> */}
                <div className="flex flex-col w-full gap-1">
                  <Input
                    name="startDate"
                    type="date"
                    placeholder={translate("Select_date")}
                    label={translate("Campaign_Start_Date")}
                    minDate={tomorrow}
                    disabled={isDisabled}
                  />
                </div>
                {
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="endDate"
                      type="date"
                      placeholder={translate("Select_date")}
                      label={translate("Campaign_End_Date")}
                      minDate={endMinDate}
                      disabled={
                        isDisabled || Boolean(methods.watch("campaignLifeTime"))
                      }
                    />
                  </div>
                }
                {/* </div> */}
                {/* // )} */}

                <div className="flex flex-col gap-2 cursor-pointer">
                  <label className={cn(labelStyle, "opacity-0")}>
                    {translate("CampaignLifeTime")}
                  </label>
                  <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      {...methods.register("campaignLifeTime")}
                      checked={Boolean(methods.watch("campaignLifeTime"))}
                      onChange={(v) => {
                        methods.setValue(
                          "campaignLifeTime",
                          !Boolean(methods.watch("campaignLifeTime"))
                        );
                        // methods.trigger(["startDate", "endDate"]);
                      }}
                    />
                    <span className="text-sm">
                      {translate("Never_Expires")} ({" "}
                      {translate("CampaignLifeTime")} )
                      {/* {translate("CampaignLifeTime")}{" "}
                      <span className="text-primary-color font-medium">
                        {translate("CampaignLifeTime")}
                      </span>{" "}
                      &{" "}
                      <span className="text-primary-color font-medium">
                        {translate("CampaignLifeTime")}.
                      </span> */}
                    </span>
                  </label>
                  {/* <Input
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
                      methods.trigger(["startDate", "endDate"]);
                    }}
                    hideError={true}
                    disabled={isDisabled}
                  /> */}
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="text-lg font-medium text-gray-500">
                {translate("Creator_material")}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col w-full gap-2">
                  <label className={cn(labelStyle)}>
                    {translate("videoType")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {VIDEO_TYPE.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleChip(option.value)}
                        className={cn(
                          "text-sm px-3 py-1 rounded-full border transition",
                          methods.watch("videoType")?.includes(option?.value)
                            ? "bg-blue-600 text-primary border-primary"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                          // disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1">
                  <CreatorMaterial
                    onMediaChange={setMediaMixin}
                    mediaPreview={mediaPreviewMixin}
                    setMediaPriview={setMediaPriviewMixin}
                    disabled={isDisabled}
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label className={cn(labelStyle)}>
                    {translate("Reference_Links")}
                  </label>
                  <div className="flex flex-col w-full gap-1">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-3 mb-1 md:w-[50%]"
                      >
                        <label className={cn(labelStyle)}>{index + 1}.</label>
                        <div className="flex-1">
                          <Input
                            name={`references.${index}`}
                            type="text"
                            placeholder="https://example.com"
                            label={``}
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
                    {Boolean(get(methods.formState.errors, "references")) && (
                      <span className="text-red-600 text-sm p-2 block">
                        {methods.formState.errors["references"]?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex flex-col w-full gap-1">
                    {/* <div className="flex flex-col gap-1"> */}
                    <Input
                      type="textarea"
                      placeholder={translate("Type_product_note_here")}
                      label={translate("Product_Note")}
                      name="notes"
                      rows={5}
                      disabled={isDisabled}
                      required={false}
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
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="text-lg font-medium text-gray-500">
                {translate("CreatorCommission")}
              </div>
              <div className="flex flex-col gap-3">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-3">
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
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-gray-500">
                  {translate("Discount/Price Range")}
                </div>
                <button
                  type="button"
                  onClick={() => setShowDiscountSection(!showDiscountSection)}
                  className="text-gray-400 hover:text-gray-600 px-4 py-1"
                >
                  {showDiscountSection ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {showDiscountSection && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row gap-3">
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
              )}
            </div>

            <div className="flex flex-col gap-4 pb-5">
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
                          methods.trigger(["tearmAndCondition"]);
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
              {!isDisabled ? (
                <div className="flex gap-[10px] ">
                  <Button
                    type="button"
                    className="rounded-[10px] w-fit h-10 px-4 py-2 text-sm font-medium"
                    onClick={() => router?.push("/vendor/campaign")}
                  >
                    {translate("Cancel")}
                  </Button>
                  <ButtonOutline
                    type="submit"
                    variant="default"
                    className="rounded-[10px]"
                  >
                    {!productId
                      ? translate("Create_Campaign")
                      : translate("Edit_Campaign")}
                  </ButtonOutline>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
