"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";

import { LoaderCircle } from "lucide-react";
import ProductCard from "../../dashboard/_component/product-card";
export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface IVariant {
  sku: string;
  price: string; // Price as a string
  title: string;
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  channelProductVendor: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[]; // Array of image/video URLs
  price: number; // Price as a number
  channelName: string;
  variants: IVariant[]; // Array of product variants
  category: ICategory; // Category object
  subCategory: string[]; // Array of sub-category IDs
  tags: string[]; // Array of tags
  lifeTime: boolean;
  startDate: string | null; // ISO date string or null
  endDate: string | null; // ISO date string or null
  freeProduct: boolean;
  status: string; // e.g., "ACTIVE"
  commission: number; // Commission value
  commission_type: "PERCENTAGE" | "FIXED_AMOUNT"; // Commission type
  referenceLinks: string[]; // Array of reference links
  creatorMaterial: string[]; // Array of creator materials
  videoType: string[]; // Array of video types
  channels: string[]; // Array of channel names
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IProducts {
  _id: string;
  utmLink: string; // UTM link for tracking
  crmLink: string; // CRM link for product details
  product: IProduct; // Product object
  creatorId: string;
  vendorId: string;
  requestedBy: string;
  collaborationStatus: string;
  utmLinkIdentifier: string;
  commissionValue: number;
  commissionType: string;
  startAt: null,
  expiresAt: null,
  bids: string[],
  "negotiation": {
    "agreedByVendor": boolean,
    "agreedByCreator": boolean
  },
  "createdAt": string;
  "updatedAt": string;
  "isWishListed": boolean,
  "categories": string;
  "tag": string;
  "subCategories": string;
}
export default function ProductList() {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProducts[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 20;
  const [hasMore, setHasMore] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          setCurrentPage((prev) => {
            handlePageChange(prev + 1)
            return prev + 1
          });
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadingRef, hasMore, loading]);
  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `/product/wishlist/list?limit=${pageLimit}&page=${page}`
      );

      if (response.data.data?.list?.length > 0) {
        const productData = response.data.data?.list.map((product: any) => {
          let categories =
            product.category?.length > 0
              ? product.category
                .filter((cat: ICategory) => cat.parentId === null)
                .map((cat: ICategory) => cat?.name)
                ?.join(", ")
              : "";
          let subCategories =
            product.category?.length > 0
              ? product.category
                .filter((cat: ICategory) => cat.parentId !== null)
                .map((cat: ICategory) => cat?.name)
                ?.join(", ")
              : "";
          let tag = product.tags?.length > 0 ? product.tags?.join(", ") : "";
          return { ...product, categories, tag, subCategories };
        })
        setProductList(prev => {
          let data = [...prev, ...productData];
          const more = data?.length < response.data.data?.count;
          setHasMore(more);
          return data;
        })
      } else {
        setHasMore(false);
        setProductList([]);
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setCurrentPage(1);
      setInternalLoading(false);
      setHasMore(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(currentPage);
  }, []);

  // Update the onClick handlers for pagination buttons
  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
    page !== currentPage &&
      fetProductsList(page, true);
  };


  return (
    <div className="p-2 md:p-4">
      <div className="bg-white p-2 md:p-4 rounded-[20PX] flex flex-col gap-3 h-[calc(100vh-95px)] w-full">
        {loading ? (
          <Loading />
        ) : (
          <>
            {internalLoading && <Loader />}
            {productList?.length > 0 ? (
              <div className="flex flex-col h-full overflow-auto">
                <h3 className="font-semibold">{translate("Product_List")}</h3>
                <div className=" md:max-h-screen overflow-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 bg-white pt-2 pb-3 px-1 md:px-2">
                    {productList.map((item: any, index: number) => (
                      <div key={index} className="flex h-full w-full">
                        <ProductCard
                          item={item?.product}
                          id={item?._id}
                          isWishListed={item?.isWishListed}
                          refreshData={() => {
                            let productData = productList?.findIndex(ele => ele?._id === item?._id);
                            productList.splice(productData,1);
                            setProductList([...productList])
                          }}
                        />
                      </div>
                    ))}

                  </div>
                  {(hasMore) && (
                    <div
                      className="flex justify-center py-2 text-gray-400"
                      ref={loadingRef}
                    >
                      <LoaderCircle
                        className="animate-spin"
                        color="#ff4979"
                        size={40}
                      />
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <EmptyPlaceHolder
              title={translate("No_Products_In_Wishlist")}
              description={translate("No_Products_In_Wishlist_Description")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
