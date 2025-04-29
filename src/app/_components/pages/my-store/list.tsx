"use client";
import ProductTable from "./product-table";
import axios from "@/lib/web-api/axios";
import ProductCard from "./product-card";
import ProductLayout from "../../components-common/table-and-card-layout/TabeluCardLayout";
import { useAuthStore } from "@/lib/store/auth-user";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  sku: string;
  description: string;
  media: string[];
  channelName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  tag: string;
  category?: ICategory[];
  categories: string;
  collaborationStatus: string;
  crmLink: string;
}

const fetchProductData = async (page: number, pageSize: number) => {
  const response = await axios.get(
    `/auth/creator-store/product-list?limit=${pageSize}&page=${page}`
  );

  const productData = response.data.data.products;
  const productsArray = productData || [];
  const productsCount = response.data.data?.total || 0;

  const processedData = productsArray.map((ele: IProduct) => ({
    ...ele,
    tag: ele.tags.join(", "),
    categories: ele?.category?.length
      ? ele.category
          .filter((c) => c.parentId === null)
          .map((c) => c.name)
          .join(", ")
      : "",
  }));
  return { data: processedData, total: productsCount };
};

const fetchProductDataVendor = async (page: number, pageSize: number) => {
  const response = await axios.get(
    `/product/list?page=${page}&limit=${pageSize}`
  );
  const productData = response.data.data;
  const productsArray = productData?.data || [];
  const productsCount = productData?.count || 0;

  const processedData = productsArray.map((ele: IProduct) => ({
    ...ele,
    tag: ele.tags.join(", "),
    categories: ele?.category?.length
      ? ele.category
          .filter((c: any) => c.parentId === null)
          .map((c: any) => c.name)
          .join(", ")
      : "",
  }));

  return { data: processedData, total: productsCount };
};

export default function ProductList() {
  const { account: user } = useAuthStore();

  return (
    <ProductLayout
      fetchData={
        user?.role === "vendor" ? fetchProductDataVendor : fetchProductData
      }
      CardComponent={ProductCard}
      TableComponent={ProductTable}
    />
  );
}
