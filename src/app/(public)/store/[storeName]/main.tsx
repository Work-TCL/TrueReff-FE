"use client";
import React, { useEffect, useState } from "react";
import StoreDetailCard from "./StoreDetailCard";
import { useParams, useRouter } from "next/navigation";
import { getCreatorStore } from "@/lib/web-api/my-store";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import ProductList from "./product-list";
import Loading from "@/app/vendor/loading";
import NotFound from "@/app/_components/components-common/404";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import Button from "@/app/_components/ui/button";
import StoreSetup from "@/app/_components/pages/creator-registration/components/store-setup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  creatorStoreSetUpSchema,
  ICreatorStoreSetUpSchema,
} from "@/lib/utils/validations";
import { fileUploadLimitValidator } from "@/lib/utils/constants";
import { creatorRegister, getCategories } from "@/lib/web-api/auth";
import { useCreatorStore } from "@/lib/store/creator";
import { useSession } from "next-auth/react";
import { ICategoryData } from "@/lib/types-api/auth";
import { useAuthStore } from "@/lib/store/auth-user";
import { Info } from "lucide-react";
import ToolTip from "@/app/_components/components-common/tool-tip";

interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // You can use `Date` if you parse it into a Date object
  updatedAt: string; // You can use `Date` if you parse it into a Date object
}
export interface IStore {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  dob: string; // You can use `Date` if you parse it into a Date object
  gender: string;
  state: string;
  city: string;
  category: ICategory[];
  sub_category: string[];
  tags: string[];
  channels: any[];
  completed_step: number;
  status: string;
  createdAt: string; // You can use `Date` if you parse it into a Date object
  updatedAt: string; // You can use `Date` if you parse it into a Date object
  instagram_link: string;
  youtube_link: string;
  banner_image: string;
  profile_image: string;
  store_description: string;
  store_name: string;
  store_link?: string;
  facebook_link?: string;
  twitter_link?: string;
}
interface IPublicCreatorStoreProps {
  isCreator?: boolean;
}
export default function PublicCreatorStore({
  isCreator,
}: IPublicCreatorStoreProps) {
  const router = useRouter();
  const params = useParams();
  const { account } = useAuthStore();
  const translate = useTranslations();
  let storeName: any = params?.storeName;
  const { creator, setCreatorData } = useCreatorStore();
  const { update } = useSession();
  const [notFounded, setNotFounded] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [store, setStore] = useState({
    _id: "",
    accountId: "",
    full_name: "",
    user_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    state: "",
    city: "",
    category: [],
    sub_category: [],
    tags: [],
    channels: [],
    completed_step: 0,
    status: "",
    createdAt: "",
    updatedAt: "",
    instagram_link: "",
    youtube_link: "",
    banner_image: "",
    profile_image: "",
    store_description: "",
    store_name: "",
    store_link: "",
    facebook_link: "",
    twitter_link: "",
    showTrending: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoader, setSaveLoader] = useState<boolean>(false);
  useEffect(() => {
    fetchStoreDetail();
  }, []);
  async function fetchStoreDetail() {
    setLoading(true);
    try {
      const response: any = await getCreatorStore({
        storeName: storeName ?? "",
      });
      if (response?.data) {
        const storeData = response?.data;
        const data = {
          ...storeData,
          store_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${storeData?.store_name}`,
        };
        setStore({ ...data });
        setLoading(false);
      } else {
        setLoading(false);
        throw "This Store is not Exist";
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setNotFounded(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  const [showProfile, setShowProfile] = useState(true);
  const [showTrending, setShowTrending] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const storeMethods = useForm<ICreatorStoreSetUpSchema>({
    defaultValues: {
      store_name: "",
      store_description: "",
      tags: [],
      category: [],
      sub_category: [],
      profile_image: "",
      banner_image: "",
    },
    resolver: yupResolver(creatorStoreSetUpSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  useEffect(() => {
    if (store) {
      storeMethods.setValue("store_name", store?.store_name);
      storeMethods.setValue("store_description", store?.store_description);
      storeMethods.setValue("tags", store?.tags);
      storeMethods.setValue("banner_image", store?.banner_image);
      storeMethods.setValue("profile_image", store?.profile_image);
      storeMethods.setValue("showTrending",store?.showTrending)
      setShowTrending(store?.showTrending);
      setProfilePreview(store?.profile_image);
      setBannerPreview(store?.banner_image);
    }
  }, [store]);
  useEffect(() => {
    if (isCreator && account?.role === "creator") {
      fetchCategory();
    }
  }, [isCreator]);
  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
    } catch (error: any) {
      console.log("Error Fetching channels", error.message);
    }
  };
  useEffect(() => {
    if (isCreator && account?.role === "creator") {
      if (store?.category?.length > 0) {
        let parentCategory = categories
          ?.filter((ele: ICategoryData) =>
            creator?.category?.includes(ele?._id)
          )
          ?.map((ele: ICategoryData) => ({
            value: ele?._id,
            label: ele?.name,
          }));
        storeMethods.setValue("category", parentCategory);
      }
      if (store?.sub_category?.length > 0) {
        let subCategory = categories
          ?.filter((ele: ICategoryData) =>
            creator?.sub_category?.includes(ele?._id)
          )
          ?.map((ele: ICategoryData) => ({
            value: ele?._id,
            label: ele?.name,
          }));
        storeMethods.setValue("sub_category", subCategory);
      }
    }
  }, [categories, store?.category, store?.sub_category]);
  const onStoreSetUpSubmit = async (data: ICreatorStoreSetUpSchema) => {
    setSaveLoader(true);
    try {
      const formData = new FormData();
      formData.append("store_name", data?.store_name);
      formData.append("store_description", data?.store_description);
      formData.append("showTrending", data?.showTrending ? "true" : "false");
      data.category.length > 0 &&
        data.category.forEach((ele, index) => {
          formData.append(`category[${index}]`, ele?.value);
        });
      data.sub_category.length > 0 &&
        data.sub_category.forEach((ele, index) => {
          formData.append(`sub_category[${index}]`, ele?.value);
        });
      data.tags.length > 0 &&
        data.tags.forEach((ele, index) => {
          formData.append(`tags[${index}]`, ele);
        });
      if (bannerFile) {
        formData.append("banner_image", bannerFile);
      }
      if (profileFile) {
        formData.append("profile_image", profileFile);
      }
      const response: any = await creatorRegister(formData, 3, true);
      if (response?.status === 200) {
        await update({
          user: {
            creator: response?.data,
          },
        });
        setStore(response?.data);
        setCreatorData("creator", {
          creatorId: response?.data?._id,
          accountId: response?.data?.accountId,
          full_name: response?.data?.full_name,
          user_name: response?.data?.user_name,
          email: response?.data?.email,
          phone: response?.data?.phone,
          dob: response?.data?.dob,
          gender: response?.data?.gender,
          state: response?.data?.state,
          city: response?.data?.city,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          tags: response?.data?.tags,
          channels: response?.data?.channels,
          completed_step: response?.data?.completed_step,
          status: response?.data?.status,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          completed: response?.data?.completed,
          instagram_link: response?.data?.instagram_link,
          youtube_link: response?.data?.youtube_link,
          banner_image: response?.data?.banner_image,
          profile_image: response?.data?.profile_image,
          store_description: response?.data?.store_description,
          store_name: response?.data?.store_name,
        });
        setIsEdit(false);
        router.push(`/creator/store/${response?.data?.store_name}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setSaveLoader(false);
    }
  };
  const handleOnClick = () => {
    setIsEdit(true);
  };
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement> | any,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
      storeMethods.setValue("profile_image", previewURL);
      storeMethods.setError("profile_image", {
        type: "manual",
        message: "",
      });
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
      storeMethods.setValue("banner_image", previewURL);
      storeMethods.setError("banner_image", {
        type: "manual",
        message: "",
      });
    }
  };
  const handleShowTrending = () => {
    setShowTrending(!showTrending);
    storeMethods.setValue("showTrending",!showTrending)
    if (isCreator && account?.role === "creator" && store?.store_name) {
      onStoreSetUpSubmit({
        ...store,
        category:
          store?.category?.length > 0
            ? categories
                ?.filter((ele: ICategoryData) =>
                  creator?.category?.includes(ele?._id)
                )
                ?.map((ele: ICategoryData) => ({
                  value: ele?._id,
                  label: ele?.name,
                }))
            : [],
        sub_category:
          store?.sub_category?.length > 0
            ? categories
                ?.filter((ele: ICategoryData) =>
                  creator?.sub_category?.includes(ele?._id)
                )
                ?.map((ele: ICategoryData) => ({
                  value: ele?._id,
                  label: ele?.name,
                }))
            : [],
            showTrending: !showTrending
      });
    }
  };
  if (!storeName) {
    return <NotFound />;
  }
  return (
    <>
      {loading ? (
        <Loading className="h-screen" />
      ) : notFounded ? (
        <div className="grid grid-cols-1 h-screen p-4">
          <EmptyPlaceHolder
            title={translate("No_Store_Available_Title")}
            description={translate("No_Store_Available_Description")}
          />
        </div>
      ) : isEdit ? (
        <div className="bg-pink-blue-gradient min-h-screen w-full overflow-y-auto px-3 pb-3">
          <FormProvider {...storeMethods}>
            <form
              onSubmit={storeMethods.handleSubmit(onStoreSetUpSubmit)}
              className="md:pt-6 mt-3 max-w-[1200px] bg-white rounded-lg mx-auto w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
            >
              <StoreSetup
                handleImageSelect={handleImageSelect}
                profilePreview={profilePreview}
                bannerPreview={bannerPreview}
                methods={storeMethods}
                categories={categories}
                showTrending={showTrending}
                setShowTrending={setShowTrending}
              />
              <div className="flex justify-end gap-2 bg-white mb-2">
                <Button
                  type="button"
                  className={cn(
                    "w-fit bg-white border text-black font-medium md:px-8 px-4",
                    "block sm:text-base text-sm"
                  )}
                  size="small"
                  // loading={saveLoader}
                  disabled={saveLoader}
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  {translate("Cancel")}
                </Button>
                <Button
                  type="submit"
                  className={cn(
                    "w-fit font-medium md:px-8 px-4",
                    "block sm:text-base text-sm"
                  )}
                  size="small"
                  loading={saveLoader}
                  disabled={saveLoader}
                >
                  {translate("Save_and_Continue")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      ) : (
        <div className="bg-pink-blue-gradient min-h-screen w-full overflow-y-auto">
          {isCreator && account?.role === "creator" && (
            <div className="flex flex-col-reverse md:flex-row justify-end items-end md:items-center gap-2 p-2">
              <div className="flex gap-4">
                <div className="text-xs md:text-lg font-medium flex items-center space-x-2 text-gray-500">
                  <span>{translate("Trending_Products")}</span>{" "}
                  <ToolTip
                    position="top"
                    content={
                      <div className="max-w-[200px] text-wrap p-2 rounded-lg">
                        {
                          "Enable this option to display trending products in your store. Trending products are popular items that attract more customers and increase engagement. Turning this on helps highlight these products to boost visibility and sales."
                        }
                      </div>
                    }
                  >
                    <Info className="size-4 md:size-5"/>
                  </ToolTip>
                </div>
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    checked={showTrending}
                    className="sr-only peer"
                    onChange={() => handleShowTrending()}
                  />
                  <div
                    className={`relative w-11 h-6 ${
                      showTrending ? "bg-primary" : "bg-gray-200"
                    } rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}
                  ></div>
                </label>
              </div>
              <Button
                type="button"
                // disabled={channels?.length === 0}
                className="w-fit text-xs md:text-lg font-medium px-4 py-2 md:py-3 md:px-6"
                size="small"
                onClick={handleOnClick}
              >
                {translate("Edit_Store")}
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-2 md:gap-3 max-w-[1200px] mx-auto p-3 md:p-4">
            {/* Sticky Profile with hide-on-scroll */}
            <div
              className="sticky top-0 z-10 transition-transform duration-500"
              style={{
                transform: showProfile ? "translateY(0)" : "translateY(-100%)",
              }}
            >
              <StoreDetailCard store={store} />
            </div>

            {/* Scrollable Product List */}
            <div className="min-h-[calc(100vh-80px)] bg-white rounded-2xl overflow-y-auto">
              <ProductList
                storeName={storeName ?? ""}
                showTrending={showTrending}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
