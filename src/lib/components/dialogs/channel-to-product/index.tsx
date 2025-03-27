"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import {
  channlesToProduct,
  IChannelsToProduct,
  IProfileUpdateSchema,
  profileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { translate } from "@/lib/utils/translate";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import Input, { inputStyle } from "@/app/_components/ui/form/Input";
import ButtonSubmit from "@/app/_components/ui/button";
import { getCategories } from "@/lib/web-api/auth";
import { ICategoryData } from "@/lib/types-api/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface IProduct {
  productId: string;
  channelName: string;
  handle: string;
  id: string;
  image: string;
  title: string;
  category: string;
  tags: string[];
  sku: string;
  price: string;
}

interface IProps {
  product: IProduct;
  onClose: any;
}

export default function ChannleToProduct({
  product,
  onClose = () => {},
}: IProps) {
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const schema = channlesToProduct;
  const methods = useForm<IChannelsToProduct>({
    defaultValues: {
      category: [],
      subCategory: [],
    },
    resolver: yupResolver(schema),
    mode: "onChange",
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
    } catch (error) {}
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
      const subCategoroies = methods.watch("subCategory") || [];
      methods.setValue(
        "subCategory",
        subCategoroies.filter((v: any) =>
          availableSubCategoriesIds.includes(v.value)
        )
      );
    })();
  }, [methods.watch("category")?.length]);

  const onSubmit = async (data: IChannelsToProduct) => {
    setLoading(true);

    try {
      const payload = {
        productId: product.productId,
        channelName: product.channelName,
        categories: data.category.concat(data.subCategory)?.map((v) => v.value),
      };

      let response: any = await axios.post(
        "/product/vendor-product/add",
        payload
      );
      if (response?.data) {
        response = response?.data;
      }

      if (response?.status === 201) {
        toast.success(response?.message);
        methods?.reset();
        onClose && onClose(true);
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
    <DialogLayout
      open={true}
      size="!max-w-[638px] w-full overflow-auto"
      title="Product To CRM"
      onClose={() => onClose()}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
        <div>
          <div
            className={cn(
              inputStyle,
              "mb-10 flex items-center text-nowrap overflow-hidden truncate justify-center"
            )}
          >
            <Avatar className="w-8 h-8 mr-3">
              <AvatarImage src={product.image} />
            </Avatar>
            {product.title}
          </div>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 text-left gap-3">
              <div className="md:col-span-1 col-span-2">
                <Input
                  label={translate("Category")}
                  placeholder={translate("Fashion_Beauty")}
                  name="category"
                  type="select-multiple"
                  options={parentCategory?.map((ele) => ({
                    value: ele?._id,
                    label: ele?.name,
                  }))}
                />
              </div>
              <div className="md:col-span-1 col-span-2">
                <Input
                  label={translate("Sub_category")}
                  placeholder={translate("Men_Fashion")}
                  name="subCategory"
                  type="select-multiple"
                  options={subCategory.map((ele) => ({
                    value: ele?._id,
                    label: ele?.name,
                  }))}
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onClose()}
                className="w-full h-full border-black bg-transparent text-base"
              >
                {translate("Cancel")}
              </Button>
              <ButtonSubmit type="submit" loading={loading}>
                {translate("Save")}
              </ButtonSubmit>
            </div>
          </form>
        </FormProvider>
      </div>
    </DialogLayout>
  );
}
