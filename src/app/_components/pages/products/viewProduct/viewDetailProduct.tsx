"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "./imagePreview";
import { ProductInfo } from "./productDetail";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Loader from "@/app/_components/components-common/layout/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { translate } from "@/lib/utils/translate";
import { useSession } from "next-auth/react";

interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
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
  tags: string[];
  category?: string;
}
export default function ViewProductDetail() {
  const axios = useAxiosAuth();
  const session = useSession();
  const user = session?.data?.user ?? { type: "vendor" };
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId;
  const channelType = params?.channelType;
  const searchParams = useSearchParams();
  const shopifyId = searchParams.get("id");
  const brandName = searchParams.get("brandName");

  const [loading, setLoading] = useState<boolean>(false);

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
    category: "",
  });
  // Update fetProductsList to set both cursors
  const fetchShopifyProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product?productId=${shopifyId}`
      );

      const product: any = response?.data?.data;

      const images = product?.featuredMedia?.preview?.image?.url;
      const imagess = product?.media?.nodes?.map((ele:any) => ele?.image.url);
      // ✅ Update product state
      const updatedProduct = {
        productId: product.id,
        images: imagess,
        name: product.title,
        tags: product?.tags || [],
        description: product?.description || "", // Add description if available
        price: product?.price || 0,
        sku: product?.sku || "",
        barcode: product?.variants?.nodes[0]?.barcode || "",
        quantity: product?.quantity || 0,
        totalInventory: product?.totalInventory || 0,
        variants: product?.variants?.nodes || [],
      };

      setProductData(updatedProduct);
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
      const images = product.media;
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
        variants: product?.variants?.nodes || [],
        category: product?.category
          ?.filter((ele: ICategory) => ele?.parentId === null)
          ?.map((ele: ICategory) => ele?.name)
          ?.join(", "),
      };

      setProductData(updatedProduct);
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, [shopifyId]);

  useEffect(() => {
    if (productId) {
      fetchProductById();
    }
  }, [productId]);

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      {loading && <Loader />}
      {/* Breadcrumb and Button */}
      <div className="flex md:flex-row flex-col items-start justify-between md:items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            {(channelType || brandName) && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className="cursor-pointer hover:text-[grey]"
                    onClick={() => router.push("/creator/brandsList/")}
                  >
                    {channelType || brandName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage
                className="cursor-pointer hover:text-[grey]"
                onClick={() =>
                  router.push(
                    productId
                      ? `/creator/brandsList/${params.id}?brandName=${brandName}`
                      : `/vendor/products/${params?.channelType}`
                  )
                }
              >
                {translate("Product_List")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{translate("View_Product")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="secondary"
          className="text-white"
          onClick={() =>
            router.push(
              user?.type === "creator"
                ? "/creator/collaboration"
                : "/vendor/creators/collaboration"
            )
          }
        >
          Start Bargaining
        </Button>
      </div>

      {/* Card Section */}
      <Card className="bg-white rounded-lg overflow-auto">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductImageGallery images={productData?.images} />
            <ProductInfo productData={productData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
