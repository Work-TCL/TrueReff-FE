"use client";
import { Button as ButtonOutline } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  campaignProductValidationSchema,
  ICampaignProductValidationSchema,
} from "@/lib/utils/validations";
import toast from "react-hot-toast";
import { Input as InputRadix } from "@/components/ui/input";
import {
  cn,
  formatForDateInput,
  getErrorMessage,
} from "@/lib/utils/commonUtils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  createCampaignProduct,
  updateCampaignProduct,
} from "@/lib/web-api/campaign";
import Button from "../../ui/button";
import Loader from "../../components-common/layout/loader";
import { get } from "lodash";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import LightButton from "../../ui/button/variant/light-button";
import { labelStyle } from "../../ui/form/Input";
import axios from "@/lib/web-api/axios";
import { ICategoryData } from "@/lib/types-api/auth";
import { getCategories } from "@/lib/web-api/auth";
import CreatorMaterial from "./_components/creator-material";
import CampaignProductView from "./_components/product-view";
import { VIDEO_TYPE } from "@/lib/utils/constants";
import { CircleX, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import TagInput from "@/components/ui/tag-input";
import Link from "next/link";

const Input = dynamic(() => import("../../ui/form/Input"), { ssr: false });

interface IAddProductDetailProps {
  isDetailView?: boolean;
}

export interface IImage {
  id: number;
  src: string;
  alt: string;
}

export interface IVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  inventory_quantity: number;
  available_quantity: number;
  barcode: string | null;
  image_id: number | null;
}

export interface IProduct {
  id: number;
  name: string;
  handle: string;
  description_html: string;
  vendor: string;
  product_type: string;
  status: string;
  tags: string;
  images: IImage[];
  variants: IVariant[];
  title?: string;
  description?: string;
}
const types = {
  FIXED_AMOUNT: "FIXED_AMOUNT",
  PERCENTAGE: "PERCENTAGE",
};
const typOptions = [
  {
    label: "Fixed Amount",
    value: "FIXED_AMOUNT",
  },
  {
    label: "Percentage",
    value: "PERCENTAGE",
  },
];
export default function CreateProductCampaign(props: IAddProductDetailProps) {
  const translate = useTranslations();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId: any = params?.productId !== "add" ? params?.productId : null;
  const shopifyId: any = searchParams?.get("productId");
  const channelType: any = searchParams?.get("channelType");
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
  const [showDiscountSection, setShowDiscountSection] = useState(false);
  const [showCreatorMeterial, setShowCreatorMeterial] = useState(false);

  const fetchCategory = useCallback(async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0,type: "vendor" });
      let data = response?.data?.data;

      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));

      const selectedSubCategories = data
        ?.filter((ele) => campaignData?.subCategory?.includes(ele?._id))
        ?.map((v) => ({
          label: v?.name,
          value: v?._id,
        }));

      methods.setValue("sub_category", selectedSubCategories);
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
    }
  }, [campaignData]); // dependencies

  const methods = useForm<ICampaignProductValidationSchema>({
    defaultValues: {
      blocking_commission_days: "1",
      tags: [],
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

  const validateCommissionGroup = (data: any) => {
    let price =
      selectedProduct?.variants?.length > 0
        ? selectedProduct?.variants[0]?.price
        : 0;
    let discountError = "";
    let commissionError = "";
    // If the first character is "0" and the length is greater than 1, remove the first character
    const commissionValue = data?.commission;
    const discountValue = data?.discount_value;
    if (!isNaN(commissionValue)) {
      if (data?.commission_type === types.PERCENTAGE) {
        // For percentage-based commission, calculate the maximum offer
        const maxOffer = (parseFloat(price) * commissionValue) / 100;
        if (price && maxOffer > parseFloat(price)) {
          methods.setError("commission", {
            type: "manual",
            message: "Commission cannot exceed the product price.",
          });
          commissionError = "Commission cannot exceed the product price.";
        } else {
          commissionError = "";
          methods.setError("commission", {
            type: "manual",
            message: "",
          });
        }
      }
      if (data.commission_type === types.FIXED_AMOUNT) {
        // For fixed amount, ensure the offer does not exceed the product price

        if (price && commissionValue > parseFloat(price)) {
          methods.setError("commission", {
            type: "manual",
            message: "Commission cannot exceed the product price.",
          });
          commissionError = "Commission cannot exceed the product price.";
        } else {
          commissionError = "";
          methods.setError("commission", {
            type: "manual",
            message: "",
          });
        }
      }
    }
    if (discountValue && !isNaN(discountValue) && showDiscountSection) {
      if (data.discount_type === types.PERCENTAGE) {
        // For percentage-based commission, calculate the maximum offer
        const maxOffer = (parseFloat(price) * discountValue) / 100;
        if (price && maxOffer > parseFloat(price)) {
          discountError = "Discount cannot exceed the product price.";
          methods.setError("discount_value", {
            type: "manual",
            message: "Discount cannot exceed the product price.",
          });
        } else {
          discountError = "";
          methods.setError("discount_value", {
            type: "manual",
            message: "",
          });
        }
      } else if (data.discount_type === types.FIXED_AMOUNT) {
        // For fixed amount, ensure the offer does not exceed the product price
        if (price && discountValue > parseFloat(price)) {
          discountError = "Discount cannot exceed the product price.";
          methods.setError("discount_value", {
            type: "manual",
            message: "Discount cannot exceed the product price.",
          });
        } else {
          discountError = "";
          methods.setError("discount_value", {
            type: "manual",
            message: "",
          });
        }
      }
    }

    const isValid = discountError === "" && commissionError === "";
    return isValid;
  };

  const onSubmit = async (data: ICampaignProductValidationSchema) => {
    if (!selectedProduct) {
      toast.error("select product required.");
      return;
    }
    setLoading(true);
    try {
      const isSkipDiscountGroup = !showDiscountSection; // discount_type, discount_value, couponCode
      const isSkipMetirialGroup = !showCreatorMeterial; // referenceLinks, creatorMaterial
      const isValid = await validateCommissionGroup(data);

      if (isValid) {
        const formData: FormData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("channelName", channelType);
        // formData.append("videoType", );
        if (data?.notes) formData.append("notes", data?.notes);
        if (data.discount_type && !isSkipDiscountGroup)
          formData.append("discountType", data.discount_type);
        if (data.discount_value && !isSkipDiscountGroup)
          formData.append("discount", data.discount_value.toString());
        formData.append("productId", selectedProduct?.id || "");
        //@ts-ignore
        formData.append("commission", data.commission);
        formData.append("commission_type", data?.commission_type);
        formData.append("blockedDays", data?.blocking_commission_days);
        if (data?.couponCode && !isSkipDiscountGroup) {
          formData.append("couponCode", data?.couponCode || "");
        }

        //@ts-ignore
        formData.append("freeProduct", data?.freeProduct);
        //@ts-ignore
        formData.append("lifeTime", Boolean(data?.campaignLifeTime));
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
        data?.tags ? data?.tags.forEach((tag: string, i: number) => {
          formData.append(`tags[${i}]`, tag);
        }) : null;
        if (!isSkipMetirialGroup) {
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

        if (response?.status === 201 || response?.status === 200) {
          toast.success(response?.message);
          methods?.reset();
          router?.push("/vendor/products");
          return true;
        }
        throw response;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleProductSelect = (product: IProduct) => {
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
      console.log("channels",channels)
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
        `channel/${channelType}/product?productId=${shopifyId}`
      );

      const product: any = response?.data?.data;

      // productId({ ...product, media: images });
      if (channelType === "shopify") {
        const images = product?.images
          ?.filter((v: any) => v?.src)
          ?.map((v: any) => v?.src);
        handleProductSelect({
          ...product,
          title: product?.name,
          description: product?.description_html,
          media: [...images],
        });
      } else if (channelType === "wordpress") {
        handleProductSelect({
          ...product,
          title: product?.name,
          description: product?.description,
          media: product?.images,
          variants:
            product?.variations?.length > 0
              ? product?.variations?.map((ele: any) => {
                  const attrs = ele.attributes ?? {};
                  // Grab all keys that have a value
                  const values = Object.keys(attrs)
                    .filter((key) => attrs[key] != null)
                    .map((key) => attrs[key]);
                  return {
                    ...ele,
                    title: `${values.join("/")}`,
                  };
                })
              : [],
        });
      }

      setLoading(false);
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
  // useEffect(() => {
  //   if (fields.length === 0) {
  //     append(""); // adds an empty string if none exists
  //   }
  // }, []);

  const watchedCategories = methods.watch("category");

  const updateSubCategories = async () => {
    const categoriesId = watchedCategories?.map((v: any) => v.value) || [];
    console.log("watchedCategories", categories, categoriesId);

    const optionsSubCategory = categories.filter((ele) =>
      categoriesId.includes(ele?.parentId?._id)
    );

    setSubCategory(optionsSubCategory);

    const availableSubCategoriesIds = optionsSubCategory.map((v) => v?._id);
    const selectedSubCategories = methods.watch("sub_category") || [];

    methods.setValue(
      "sub_category",
      []
    );
  };
  useEffect(() => {
    updateSubCategories();
  }, [watchedCategories?.length, categories?.length, campaignData]);

  useEffect(() => {
    fetchCategory();
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, []);

  useEffect(() => {
    if (productId && !campaignData && categories) {
      setTimeout(async () => {
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
          methods.setValue("freeProduct", Boolean(response?.freeProduct));
          methods.setValue("videoType", response?.videoType);
          methods.setValue("commission", response?.commission);
          methods.setValue("commission_type", response?.commission_type);
          methods.setValue("references", response?.referenceLinks);
          methods.setValue("channels", response?.channels);
          methods.setValue("couponCode", response?.couponCode);
          methods.setValue("discount_type", response?.discountType);
          methods.setValue("discount_value", response?.discount);
          methods.setValue(
            "blocking_commission_days",
            String(response?.blockedDays || 1)
          );
          if (response?.discount) {
            setShowDiscountSection(true);
          }
          if (
            response?.couponCode ||
            response?.discountType ||
            response?.discount
          ) {
            setShowDiscountSection(true);
          }
          if (
            response?.referenceLinks?.length > 0 ||
            response.creatorMaterial?.length > 0
          ) {
            setShowCreatorMeterial(true);
          }
          //@ts-ignore
          methods.setValue("endDate", formatForDateInput(response?.endDate));
          const incomingDate = new Date(response?.startDate);
          const today = new Date();

          // Strip time from today's date (set to 00:00:00)
          today.setHours(0, 0, 0, 0);

          // If incomingDate is before today, set it to today
          const finalDate = incomingDate < today ? today : incomingDate;
          methods.setValue(
            "startDate",
            //@ts-ignore
            formatForDateInput(finalDate)
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
      }, 0);
    }
  }, [productId, categories]);

  useEffect(() => {
    if (categories && campaignData) {
      const selectedSubCategories = categories
        ?.filter((ele) => campaignData?.subCategory?.includes(ele?._id))
        ?.map((v) => ({
          label: v?.name,
          value: v?._id,
        }));

      methods.setValue("sub_category", selectedSubCategories);
    }
  }, [categories?.length, campaignData]);
console.log("methods",methods.formState.errors)
  const startDateRaw = methods.watch("startDate");
  const startDate = startDateRaw ? new Date(startDateRaw) : null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());

  const endMinDate = startDate
    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // next day after startDate
    : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

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
  const handleTagChange = (value: string[]) => {
    methods.setValue("tags", value);
    methods.trigger("tags");
  };

  const handleChangeCategory = (value: string[], type: "category" | "sub_category") => {
   const categoriesId = value?.map((v: any) => v.value) || [];

    const optionsSubCategory = categories.filter((ele) =>
      categoriesId.includes(ele?.parentId?._id)
    );

    setSubCategory(optionsSubCategory);

    const availableSubCategoriesIds = optionsSubCategory.map((v) => v?._id);
    const selectedSubCategories = methods.watch("sub_category") || [];

    methods.setValue(
      "sub_category",
      []
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 h-full px-4 py-3"
      >
        {loading && <Loader />}
        {/* <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="md:text-[20px] text-base text-500">
            {translate("Campaign_Details_Form")}
          </div>
        </div> */}
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="text-lg font-medium text-gray-500">
                {/* {translate("General_In/formation")} */}
                {translate("Product_Information")}
              </div>
              <CampaignProductView
                images={
                  selectedProduct?.media?.length > 0
                    ? selectedProduct?.media
                    : []
                }
                title={selectedProduct?.title}
                description={selectedProduct?.description}
                price={
                  selectedProduct?.variants?.length
                    ? selectedProduct?.variants[0]?.price
                    : selectedProduct?.price
                }
                variants={selectedProduct?.variants}
                totalInventory={
                  selectedProduct?.variants?.length
                    ? selectedProduct?.variants[0]?.inventory_quantity
                    : undefined
                }
              />
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2
"
              >
                <div className="md:col-span-1 col-span-2">
                  <TagInput
                    labelClassName={labelStyle}
                    value={methods.watch("tags")??[]}
                    onChange={handleTagChange}
                    error={methods.formState.errors["tags"]?.message}
                    isRequired={false}
                  />
                </div>

                <div className="md:col-span-1 col-span-2">
                  <label className={cn(labelStyle)}>
                    {translate("Campaign_Channels")}
                  </label>
                  <div className="py-3">
                    <div className="flex flex-row flex-wrap lg:gap-6 gap-3">
                      {!isDisabled ? (
                        <div className="flex gap-1 cursor-pointer">
                          <Input
                            name="channels"
                            type="toggle"
                            placeholder={translate("Add_link")}
                            //@ts-ignore
                            label={
                              <div className="flex items-center">
                                <div>
                                  <img
                                    src="/assets/creator/Instagram-icon.svg"
                                    width={30}
                                    height={30}
                                  />
                                </div>
                                <div>{translate("Instagram")}</div>
                              </div>
                            }
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
                            type="toggle"
                            placeholder={translate("Add_link")}
                            //@ts-ignore
                            label={
                              <div className="flex items-center">
                                <div>
                                  <img
                                    src="/assets/creator/Youtube-icon.svg"
                                    width={30}
                                    height={30}
                                  />
                                </div>
                                <div>{translate("You_tube")}</div>
                              </div>
                            }
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
                      {/* {!isDisabled ? (
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
                      ) : null} */}
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
                      <span className="text-red-600 text-sm p-2 block mt-2">
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
                    onChange={(v: any) => {
                      handleChangeCategory(v, "category");
                    }}
                    autoFocus={false}
                    max={1}
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
                    required={false}
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
                  <label
                    className={cn(labelStyle, "opacity-0 md:block hidden")}
                  >
                    {translate("CampaignLifeTime")}
                  </label>
                  <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
                    <label className="inline-flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        className="sr-only peer hidden"
                        checked={Boolean(methods.watch("campaignLifeTime"))}
                        onChange={(v) => {
                          methods.setValue(
                            "campaignLifeTime",
                            !Boolean(methods.watch("campaignLifeTime"))
                          );
                          // methods.trigger(["startDate", "endDate"]);
                        }}
                      />
                      <div
                        className={`relative w-9 h-5 ${
                          Boolean(methods.watch("campaignLifeTime"))
                            ? "bg-primary"
                            : "bg-gray-200"
                        } rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}
                      ></div>
                    </label>
                    <span className="text-sm">
                      {translate("Never_Expires")} ({" "}
                      {translate("CampaignLifeTime")} )
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-3">
              <div className="text-lg font-medium text-gray-500">
                {translate("campaignObjective")}
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
                        onClick={() => {
                          toggleChip(option.value);
                          methods.trigger("videoType");
                        }}
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
                  {Boolean(get(methods.formState.errors, "videoType")) && (
                    <span className="text-red-600 text-sm p-2 block">
                      {methods.formState.errors["videoType"]?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex flex-col w-full gap-1">
                    {/* <div className="flex flex-col gap-1"> */}
                    <Input
                      type="textarea"
                      placeholder={translate("Type_campaign_goals_note_here")}
                      label={translate("Campaign_Goals")}
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
                      type="react-select"
                      placeholder={translate("Select_Commission_Type")}
                      // @ts-ignore
                      label={
                        <span className="flex items-center gap-1">
                          {translate("Commission_Type")}
                          <TooltipProvider key={`Commission_Type`}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent
                                className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                                side="top"
                              >
                                {translate("commisionTooltip")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      }
                      lableClassName="flex"
                      options={typOptions}
                      disabled={isDisabled}
                      required={false}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="commission"
                      type="number"
                      placeholder={"Enter Your Commission"}
                      label={translate("commission")}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="blocking_commission_days"
                      type="number"
                      placeholder={"Enter Blocking Commission Days"}
                      label={translate("blocking_commission_days")}
                      disabled={isDisabled}
                      min={1}
                      defaultValue={1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value < 1) {
                          methods.setValue("blocking_commission_days", e.target.value);
                          methods.setError("blocking_commission_days", {
                            type: "manual",
                            message: "Blocking commission days must be between 1 and 30",
                          });
                        } else if (value > 30) {
                          methods.setValue("blocking_commission_days", e.target.value);
                          methods.setError("blocking_commission_days", {
                            type: "manual",
                            message: "Blocking commission days must be between 1 and 30",
                          });
                        } else {
                          methods.setValue("blocking_commission_days", e.target.value);
                          methods.setError("blocking_commission_days", {
                            type: "manual",
                            message: "",
                          });
                        }
                      }}
                      max={30}
                    />
                  </div>
                  <div className="mt-2 flex flex-col gap-2 cursor-pointer">
                    <label
                      htmlFor="freeProduct"
                      className="text-xs flex items-center gap-2 text-gray-600"
                    >
                      <InputRadix
                        type="radio"
                        name={`freeProduct`}
                        className="w-5 h-5 cursor-pointer accent-[#FF4979]"
                        checked={Boolean(methods.watch("freeProduct"))}
                        onClick={() =>
                          methods.setValue(
                            "freeProduct",
                            !Boolean(methods.watch("freeProduct"))
                          )
                        }
                        onChange={() => {}}
                      />
                      {/* <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        {...methods.register("freeProduct")}
                        checked={Boolean(methods.watch("freeProduct"))}
                        onChange={(v) => {
                          methods.setValue(
                            "freeProduct",
                            !Boolean(methods.watch("freeProduct"))
                          );
                          // methods.trigger(["startDate", "endDate"]);
                        }}
                      /> */}
                      <span
                        className="text-sm cursor-pointer flex items-center gap-1"
                        onClick={(v) => {
                          methods.setValue(
                            "freeProduct",
                            !Boolean(methods.watch("freeProduct"))
                          );
                        }}
                      >
                        {translate("free_promotional_product")}
                        <TooltipProvider key={`free_promotional_product`}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent
                              className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                              side="top"
                            >
                              {translate("freeProductTooltip")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px]">
              <div className="text-lg font-medium text-gray-500 flex items-center gap-x-2">
                {translate("Creator_material")}{" "}
                <TooltipProvider key={`Creator_material`}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info />
                    </TooltipTrigger>
                    <TooltipContent
                      className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                      side="top"
                    >
                      {translate("campaignMaterialTolltip")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    value=""
                    checked={showCreatorMeterial}
                    className="sr-only peer"
                    onChange={() =>
                      setShowCreatorMeterial(!showCreatorMeterial)
                    }
                  />
                  <div
                    className={`relative w-11 h-6 ${
                      showCreatorMeterial ? "bg-primary" : "bg-gray-200"
                    } rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}
                  ></div>
                </label>
              </div>
              <div
                className={`flex flex-col gap-3 transition-all duration-500 ease-in-out overflow-hidden ${
                  showCreatorMeterial
                    ? "max-h-[1000px] opacity-100 pt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
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
                        className="flex items-start gap-3 mb-1 lg:w-[50%]"
                      >
                        <label className={cn(labelStyle, "py-[15px] h-fit")}>
                          {index + 1}.
                        </label>
                        <div className="flex-1">
                          <Input
                            name={`references.${index}`}
                            type="text"
                            placeholder="https://example.com"
                            label={``}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:underline h-fit my-[15px] cursor-pointer"
                        >
                          <span className="md:inline-block hidden">Remove</span>
                          <span className="md:hidden">
                            <CircleX />
                          </span>
                        </button>
                      </div>
                    ))}
                    <LightButton
                      type="button"
                      onClick={() => append("")}
                      className="text-blue-600 me-auto mt-2 mb-3 cursor-pointer"
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
              </div>
            </div>
            <div className="hidden flex-col bg-white rounded-xl p-[24px]">
              <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-gray-500 flex items-center gap-1">
                  {translate("additional_offers")}
                  <TooltipProvider key={`additional_offers`}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info />
                      </TooltipTrigger>
                      <TooltipContent
                        className="z-[99] px-3 py-2 w-auto max-w-[80vw] rounded-md border border-gray-color bg-white text-[14px] md:max-w-[300px] overflow-hidden"
                        side="top"
                      >
                        {translate("additionTooltip")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    value=""
                    checked={showDiscountSection}
                    className="sr-only peer"
                    onChange={() =>
                      setShowDiscountSection(!showDiscountSection)
                    }
                  />
                  <div
                    className={`relative w-11 h-6 ${
                      showDiscountSection ? "bg-primary" : "bg-gray-200"
                    } rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}
                  ></div>
                </label>
              </div>
              {/* {showDiscountSection && ( */}
              <div
                className={`
                flex flex-col gap-3 transition-all duration-500 ease-in-out overflow-hidden
                ${
                  showDiscountSection
                    ? "max-h-[1000px] opacity-100 pt-3"
                    : "max-h-0 opacity-0"
                }
              `}
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="couponCode"
                      type="text"
                      placeholder={"Enter your coupon code"}
                      label={translate("couponCode")}
                      required={false}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="discount_type"
                      type="react-select"
                      placeholder={translate("Select_Discount_Type")}
                      label={translate("Discount_Type")}
                      options={typOptions}
                      disabled={isDisabled}
                      required={false}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <Input
                      name="discount_value"
                      type="number"
                      placeholder={"Enter Your Discount"}
                      label={translate("Discount")}
                      disabled={isDisabled}
                      required={false}
                    />
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>

            <div className="flex flex-col gap-4 pb-5">
              <div className="pt-2">
                <div className="flex flex-col md:flex-row gap-6">
                  {!isDisabled ? (
                    <div className="flex gap-1 cursor-pointer items-center">
                      <div className="mb-1">
                        <Input
                          name="tearmAndCondition"
                          type="checkbox"
                          // label={translate("campaignTerms")}
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
                      <div>
                        {translate("campaignTerms_m")}{" "}
                        <Link
                          href={`/terms?next=${encodeURIComponent(pathname)}`}
                          target="_blank"
                          className="text-blue underline"
                        >
                          {translate("TermsCondition")}
                        </Link>
                        .
                      </div>
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
                    onClick={() => router?.push("/vendor/products")}
                  >
                    {translate("Cancel")}
                  </Button>
                  <ButtonOutline
                    type="submit"
                    variant="default"
                    className="rounded-[10px]"
                  >
                    {!productId
                      ? translate("Add_Product")
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
