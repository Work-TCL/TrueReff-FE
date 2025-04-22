"use client";
import { Button } from "@/components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import Select from 'react-select';
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStoreSchema, ICreateStoreSchema } from "@/lib/utils/validations";
import { ICreateStoreRequest } from "@/lib/types-api/my-store";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { createStore, getCreatorStore, updateCreatorStore } from "@/lib/web-api/my-store";
import { fileUploadLimitValidator } from "@/lib/utils/constants";
import StoreDetailView from "./store-detail-view";
import Loader from "../../components-common/layout/loader";
import { useRouter, useSearchParams } from "next/navigation";

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "12px",
    height: '52.5px'
  })
};
export default function StoreSetUp(props: any) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isDetailView,setIsDetailView] = useState<boolean>(true); 
  const [isEdit,setIsEdit] = useState<boolean>(false);
  const [store,setStore] = useState(
          {   creatorId: "",
              name: "",
              description: "",
              tags: [],
              category: [],
              link: "",
              profile_image:"",
              banner_image: "",
              categories: []
          }
      );
  const methods = useForm<ICreateStoreSchema>({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      category: [],
      profile_image: "",
      banner_image: "",
    },
    resolver: yupResolver(createStoreSchema),
    mode: "onSubmit",
  });

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  async function fetchStoreDetail(){
    setLoading(true);
    try {
        const response: any = await getCreatorStore(
            {storeName:""}
        );
        console.log('response?.data',response)
        if (response?.data) {
            const storeData = response?.data;
            const data =  {
                name: storeData?.storeName,
                description: storeData?.storeDescription,
                tags: storeData?.tags,
                category: storeData?.category?.map((ele:any) => ele?.name),
                link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/creator/store/${storeData?.storeName}`,
                profile_image: storeData?.profile_image,
                banner_image: storeData?.banner_image,
                creatorId: storeData?.creatorId?._id,
                categories: storeData?.category?.map((cat:any) => ({value:cat?._id,label:cat?.name}))
            }
            setStore({...data});
            setIsDetailView(true);
        } else {
          setIsDetailView(false);
          setIsEdit(false);
          setStore({   creatorId: "",
            name: "",
            description: "",
            tags: [],
            category: [],
            link: "",
            profile_image:"",
            banner_image: "",
            categories:[]
        });
        }
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        // toastMessage.error(errorMessage);
        setIsDetailView(false);
          setIsEdit(false);
          setStore({   creatorId: "",
            name: "",
            description: "",
            tags: [],
            category: [],
            link: "",
            profile_image:"",
            banner_image: "",
            categories:[]
        });
    } finally {
        setLoading(false);
    }
  } 
  useEffect(() => {
    fetchCategory();
    fetchStoreDetail();
  }, []);
  const onSubmit = async (data: ICreateStoreSchema) => {
    setLoading(true);

    try {
      // const payload: ICreateStoreRequest = {
      const formData = new FormData();
        formData.append("storeName", data.name);
        formData.append("storeDescription", data.description);

      // Append array items one by one (for `category`)
      data.category.forEach((cat: any, index: number) => {
        formData.append(`category[${index}]`, cat.value);
      });

      // Append tags if they exist
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      // Append files if they exist
      if (bannerFile) {
        formData.append("banner_image", bannerFile);
      }
      if (profileFile) {
        formData.append("profile_image", profileFile);
      }
        if(!isEdit){
          const response: any = await createStore(
            formData
          );
          if (response?.status === 200) {
            router.push("/creator/store")
            toastMessage.success(response?.message);
          }
        } else {
          const response: any = await updateCreatorStore(
            formData
          );
          if (response?.status === 200) {
            router.push("/creator/store")
            toastMessage.success(response?.message);
          }
        }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedCategories(selectedIds);
    if(selectedIds){
      methods.setValue("category",selectedOptions);
      methods.setError("category",{
        type: "manual",
        message: "",
      })
    } else {
      methods.setError("category",{
        type: "manual",
        message: "Product Category is required.",
      })
    }
  }
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
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
      methods.setValue("profile_image",previewURL);
      methods.setError("profile_image",{
        type: "manual",
        message: "",
      })
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
      methods.setValue("banner_image",previewURL);
      methods.setError("banner_image",{
        type: "manual",
        message: "",
      })
    }
  };
  const handleOnEdit = () => {
    setProfilePreview(store?.profile_image);
    setBannerPreview(store?.banner_image);
    setSelectedCategories(store?.category?.map((ele:any) => {
      return parentCategory?.find((cat:any) => cat?.name === ele)?._id??""
    } ))
    methods.setValue("name",store?.name);
    methods.setValue("tags",store?.tags);
    methods.setValue("description",store?.description);
    methods.setValue("banner_image",store?.banner_image);
    methods.setValue("profile_image",store?.profile_image);
    methods.setValue("category",store?.categories);
    setIsDetailView(false);
    setIsEdit(true);
  }
  return (
    <>{loading && <Loader/> }{isDetailView ? <StoreDetailView
      handleOnEdit={handleOnEdit}
      store={store}
    />:<div className="flex flex-col gap-2 lg:gap-5 h-full p-2 lg:p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full h-full overflow-auto flex-1 flex flex-col gap-3 relative"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="md:text-xl text-base text-500">
              {translate("Add_Details_For_Store_Set_Up")}
            </div>
            <div className="flex gap-[10px]">
              <Button type="button" variant="outline" className="w-[140px] rounded-[12px]" onClick={()=> {setIsDetailView(true);setIsEdit(false);}}>
                {translate("Cancel")}
              </Button>
              <Button
                type='submit'
                variant="secondary"
                className="text-white w-[140px] rounded-[12px]"
              >
                {translate("Save")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            <div className="flex bg-white rounded-xl col-span-2 flex-col gap-2 lg:w-1/2 p-4">
              <div className="text-sm lg:text-lg">{translate("Banner_Image")}</div>
              <div className="text-sm text-gray-500">
                {translate("Store_Banner_Image")}<span className="text-[red]">*</span>
              </div>
              <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={bannerPreview || "/assets/product/image-square.svg"}
                    className={`w-full max-h-[200px] object-cover rounded-lg ${bannerPreview ? "":"opacity-50"}`}
                  />
                  <div className="text-gray-500">
                    {translate("Drag_and_drop_image_here,_or_click_Add_Image")}
                  </div>
                  <input
                  name="banner_image"
                    type="file"
                    id="banner-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "banner")} />
                  <Button type="button" variant="outline" onClick={() => {
                    document.getElementById("banner-image")?.click();
                  }}>{translate("Add_Image")}</Button>
                </div>
              </div>
              {methods?.formState?.errors?.banner_image?.message && <span className="text-red-600 text-sm">{methods?.formState?.errors?.banner_image?.message}</span>}
            </div>
            <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2 lg:w-1/2  p-4">
              <div className="text-sm lg:text-lg">{translate("Profile_Image")}</div>
              <div className="text-sm text-gray-500">
                {translate("Store_Profile_Image")}<span className="text-[red]">*</span>
              </div>
              <div className="flex justify-center items-center border rounded-lg p-5">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={profilePreview || "/assets/product/image-square.svg"}
                    className={`w-full max-h-[200px] object-cover rounded-lg ${profilePreview ? "":"opacity-50"}`}
                  />
                  <div className="text-gray-500">
                    {translate("Drag_and_drop_image_here,_or_click_Add_Image")}
                  </div>
                  <input
                    type="file"
                    name="profile_image"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "profile")}
                  />
                  <Button type="button" variant="outline" onClick={() => {
                    document.getElementById("profile-image")?.click();
                  }}>{translate("Add_Image")}</Button>
                </div>
              </div>
              {methods?.formState?.errors?.profile_image?.message && <span className="text-red-600 text-sm">{methods?.formState?.errors?.profile_image?.message}</span>}
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-4 gap-2">
            <div className="text-sm lg:text-lg">{translate("Category")}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1 gap-1">
                <label className="text-sm text-[#7E7E80]">
                  {translate("Product_Category")}<span className="text-[red]">*</span>
                </label>
                <Select
                  name="category"
                  styles={customStyles}
                  value={selectedCategories.map((id) => {
                    const match = parentCategory.find((cat) => cat._id === id);
                    return { value: id, label: match?.name || id };
                  })}
                  isMulti
                  onChange={handleSelectCategory}
                  options={parentCategory.map((ele) => ({
                    value: ele._id,
                    label: ele.name,
                  }))}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  className="basic-multi-select focus:outline-none focus:shadow-none"
                  placeholder="Product Categories"
                />
                {methods?.formState?.errors?.category?.message && <span className="text-red-600 text-sm p-2">{methods?.formState?.errors?.category?.message}</span>}
              </div>
              <div className="col-span-1">
                <Input
                  label="Tags"
                  name="tags"
                  type="tag"
                  placeholder="Enter your tags"
                />
              </div>
            </div>
            <div className="text-sm lg:text-lg">{translate("General_Information")}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Input
                  label="Store Name"
                  name="name"
                  type="text"
                  placeholder="Men’s Style Guide & Trends"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Store Link"
                  name="link"
                  type="text"
                  disabled
                  value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/creator/store/${methods.watch("name")}`}
                  placeholder="https://my-store.com"
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Input
                  label="Store Description"
                  name="description"
                  type="textarea"
                  rows={4}
                  placeholder="I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!"
                />
              </div></div>
          </div>
        </form>
      </FormProvider>
    </div>}
    </>
  );
}
