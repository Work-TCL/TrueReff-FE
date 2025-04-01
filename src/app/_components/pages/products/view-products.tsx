"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { translate } from "@/lib/utils/translate";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Loader from "../../components-common/layout/loader";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProductSchema, productSchema } from "@/lib/utils/validations";
import Input from "../../ui/form/Input";
import AnchorButton from "../../ui/button/variant";

interface IAddProductDetailProps {
  type?: "view";
}

interface IProduct {
  productId: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  quantity: number;
  totalInventory: number;
  variants: any[];
  tags: any[];
}

export default function ProductView({ type = "view" }: IAddProductDetailProps) {
  const axios = useAxiosAuth();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const status = {
    edit: false,
    create: false,
    view: type === "view",
  };

  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled = type === "view";

  const methods = useForm<IProductSchema>({
    defaultValues: {
      images: [],
      name: "",
      description: "",
      price: 0,
      discount: 0,
      sku: "",
      barcode: "",
      quantity: 0,
      totalInventory: 0,
      variants: [],
      category: [],
      tags: [],
    },
    resolver: yupResolver(productSchema),
    mode: "onChange",
  });

  const [productData, setProductData] = useState<IProduct>({
    productId: "",
    images: [],
    name: "",
    description: "",
    price: 0,
    sku: "",
    barcode: "",
    quantity: 0,
    totalInventory: 0,
    variants: [],
    tags: [],
  });

  const [variants, setVariants] = useState([
    { variationType: "", variation: "" },
  ]);
  const handleAddVariant = () => {
    // setVariants([...variants, { variationType: "", variation: "" }]);
  };
  const handleDelete = (ind: number) => {
    setVariants([...variants.filter((ele, index) => index !== ind)]);
  };

  // Update fetProductsList to set both cursors
  const fetchShopifyProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`product/${productId}`);

      const product: any = response?.data?.data?.data;
      const images = product?.media;
      setProductData({
        productId: product.id,
        images: images,
        name: product.title,
        description: "",
        price: 0,
        sku: "",
        barcode: "",
        quantity: 0,
        totalInventory: product?.totalInventory,
        tags: product?.tags || [],
        variants: product?.variants || [],
      });
      // ✅ Update product state
      const updatedProduct = {
        productId: product.id,
        images: images,
        name: product.title,
        tags: product?.tags || [],
        description: product?.description || "", // Add description if available
        price: product?.price || 0,
        sku: product?.sku || "",
        barcode: product?.variants?.nodes[0]?.barcode || "",
        quantity: product?.quantity || 0,
        totalInventory: product?.totalInventory || 0,
        variants: product?.variants || [],
      };

      setProductData(updatedProduct);

      methods.reset(updatedProduct);
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    if (productId) {
      fetchShopifyProductById();
    }
  }, [productId]);

  const onSubmit = (data: IProductSchema) => {
    setLoading(true);
    try {
      console.log("data");
    } catch (error) {
      toast.error("product save filed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col gap-5 h-full px-4 py-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="text-[20px] text-500">
            {status.view ? (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/vendor/products`}>
                      {translate("Product_List")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{translate("View_Product")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : status.edit ? (
              translate("Edit_Product_Details")
            ) : (
              translate("Add_New_Product_Details")
            )}
          </div>
          <div className="flex gap-[10px]">
            <AnchorButton
              size="small"
              href="/vendor/products/add"
              className="flex items-center !text-base"
            >
              <FaPlus className="mr-2" /> {translate("Add_product")}
            </AnchorButton>
          </div>
          {!status.view && (
            <div className="flex gap-[10px]">
              <Button variant="outline" className="w-[140px] rounded-[12px]">
                {translate("Cancel")}
              </Button>
              <Button
                variant="secondary"
                className="text-white w-[140px] rounded-[12px]"
              >
                {translate(status.edit ? "Edit" : "Save")}
              </Button>
            </div>
          )}
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row gap-5 w-full"
          >
            <div className="flex flex-col lg:w-3/4 gap-5">
              <div className="bg-white rounded-xl p-[24px] flex flex-col gap-2">
                <div className="text-[16px]">{translate("Product_Image")}</div>
                {status.view ? (
                  <div className="flex gap-2">
                    {productData.images.map((url, index) => (
                      <img
                        src={url}
                        className="w-[100px] h-[100px] border rounded"
                        key={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Photo")}
                    </label>
                    <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src="/assets/product/image-square.svg"
                          className="w-[50px] h-[50px]"
                        />
                        <div>
                          {translate(
                            "Drag_and_drop_image_here,_or_click_Add_Image"
                          )}
                        </div>
                        <Button variant="outline">
                          {translate("Add_Image")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                <div className="text-[16px]">
                  {translate("General_Information")}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Product_Name")}
                  </label>
                  <Input
                    name="name"
                    type="text"
                    placeholder={translate("Type_product_name_ here")}
                    disabled={isDisabled}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Description")}
                  </label>
                  <Input
                    name="description"
                    type="textarea"
                    placeholder={translate("Type_product_description_here")}
                    rows={5}
                    disabled={isDisabled}
                  />
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                <div className="text-[16px]">{translate("Pricing")}</div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Base_Price")}
                  </label>
                  <Input
                    name="price"
                    type="number"
                    placeholder={translate("Type_base_price_here")}
                    disabled={isDisabled}
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="flex flex-col w-full lg:w-1/2 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Discount_Type")}
                    </label>
                    <Input
                      name="discount_type"
                      type="select"
                      placeholder={translate("Discount_Type")}
                      options={[
                        {
                          label: "Apple",
                          value: "apple",
                        },
                        {
                          label: "Banana",
                          value: "banana",
                        },
                        {
                          label: "Blueberry",
                          value: "blueberry",
                        },
                        {
                          label: "Grapes",
                          value: "grapes",
                        },
                        {
                          label: "Pineapple",
                          value: "pineapple",
                        },
                      ]}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-1/2 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Discount_Percentage_Doller")}
                    </label>
                    <Input
                      name="discount"
                      type="number"
                      placeholder={translate("Type_discount_percentage")}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="flex flex-col w-full lg:w-1/2 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Tax_Class")}
                    </label>
                    <Input
                      name="tax"
                      type="select"
                      placeholder={translate("Select_a_Tax_Class")}
                      options={[
                        {
                          label: "Apple",
                          value: "apple",
                        },
                        {
                          label: "Banana",
                          value: "banana",
                        },
                        {
                          label: "Blueberry",
                          value: "blueberry",
                        },
                        {
                          label: "Grapes",
                          value: "grapes",
                        },
                        {
                          label: "Pineapple",
                          value: "pineapple",
                        },
                      ]}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-1/2 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("VAT_Amount_Doller")}
                    </label>
                    <Input
                      name="vatAmount"
                      type="number"
                      placeholder={translate("Type_VAT_amount")}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                <div className="text-[16px]">{translate("Inventory")}</div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex flex-col w-full md:w-1/3 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("SKU")}
                    </label>
                    <Input
                      name="sku"
                      type="text"
                      placeholder={`${translate("Type_product_SKU_here")}...`}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/3 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Barcode")}
                    </label>
                    <Input
                      name="barcode"
                      type="text"
                      placeholder={`${translate("Product_barcode")}...`}
                      disabled={isDisabled}
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/3 gap-1">
                    <label className="text-[12px] text-[#7E7E80]">
                      {translate("Quantity")}
                    </label>
                    <Input
                      name="quantity"
                      type="number"
                      placeholder={`${translate(
                        "Type_product_quantity_here"
                      )}...`}
                      disabled={isDisabled}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
                <div className="text-[16px]">{translate("Variation")}</div>
                {variants.map((ele, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex flex-col w-full md:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">
                          {translate("Variation_Type")}
                        </label>
                        <Input
                          name="variationType"
                          type="select"
                          placeholder={translate("Select_a_variation_type")}
                          options={[
                            {
                              label: "Apple",
                              value: "apple",
                            },
                            {
                              label: "Banana",
                              value: "banana",
                            },
                            {
                              label: "Blueberry",
                              value: "blueberry",
                            },
                            {
                              label: "Grapes",
                              value: "grapes",
                            },
                            {
                              label: "Pineapple",
                              value: "pineapple",
                            },
                          ]}
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="flex flex-col w-full md:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">
                          {translate("Variation")}
                        </label>
                        <Input
                          name={`variants[${index}].sku`}
                          type="text"
                          disabled={isDisabled}
                          placeholder={`${translate("Variation")}...`}
                        />
                      </div>
                      {!status.view && (
                        <div
                          className="flex items-end cursor-pointer"
                          onClick={() => handleDelete(index)}
                        >
                          <img
                            src="/assets/product/delete-icon.svg"
                            className="w-[42px] h-[42px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!status.view && (
                  <div className="flex">
                    <Button variant="outline" onClick={handleAddVariant}>
                      <FaPlus /> {translate("Add_variant")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col lg:w-1/4">
              <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                <div className="text-[16px]">{translate("Category")}</div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Product_Category")}
                  </label>
                  <Input
                    name="category"
                    type="select-multiple"
                    placeholder={translate("Select_a_category")}
                    options={[
                      {
                        label: "Apple",
                        value: "apple",
                      },
                      {
                        label: "Banana",
                        value: "banana",
                      },
                      {
                        label: "Blueberry",
                        value: "blueberry",
                      },
                      {
                        label: "Grapes",
                        value: "grapes",
                      },
                      {
                        label: "Pineapple",
                        value: "pineapple",
                      },
                    ]}
                    disabled={isDisabled}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Product_Tags")}
                  </label>
                  <Input
                    name="tags"
                    type="tag"
                    placeholder={translate("Select_tags")}
                    options={[
                      {
                        label: "Apple",
                        value: "apple",
                      },
                      {
                        label: "Banana",
                        value: "banana",
                      },
                      {
                        label: "Blueberry",
                        value: "blueberry",
                      },
                      {
                        label: "Grapes",
                        value: "grapes",
                      },
                      {
                        label: "Pineapple",
                        value: "pineapple",
                      },
                    ]}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
