"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import ProductCard from "@/app/_components/components-common/product/product-card";
import { ICategory, IProducts } from "./all-product-list";
import { LoaderCircle } from "lucide-react";

export default function ProductList({ category }: { category:string; }) {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProducts[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageLimit = 20;
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
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
  }, [loadingRef, hasMore, isLoading]);
  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false
  ) => {
    isInternalLoader ? setInternalLoading(false) : setLoading(true);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/product/all?limit=${pageLimit}&page=${page}&category=${category}`
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
        setIsLoading(false);
        setProductList(prev => {
          let data = [...prev, ...productData];
          const more = data?.length < response.data.data?.count;
          setHasMore(more);
          return data;
        })      
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setCurrentPage(1);
      setInternalLoading(false);
      setHasMore(false);
      setIsLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    if(category){
      fetProductsList(currentPage);
    }
  }, [category]);

  // Update the onClick handlers for pagination buttons
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetProductsList(page, true);
  };


  return (
    <div className="bg-white p-2 md:p-4 rounded-[20PX] flex flex-col gap-3 h-[calc(100vh-145px)] w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          {internalLoading && <Loader />}
          {productList?.length > 0 ? (
            <div className="flex flex-col h-full overflow-auto">
              <h3 className="font-semibold">{translate("Product_List")}</h3>
              <div className="md:max-h-screen overflow-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-2 bg-white pt-2 pb-3 px-1 md:px-2">
                {productList.map((item: any) => (
                  <div key={item?._id} className="flex h-full w-full">
                    <ProductCard
                      item={item?.product}
                      id={item?._id}
                      isWishListed={item?.isWishListed}
                      refreshData={() => fetProductsList(currentPage,true)}
                    />
                  </div>
                ))}
              </div>
              {/* Pagination */}
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
          )}</div>
            </div>
          ) : (
            <EmptyPlaceHolder
              title={translate("No_Products_Available_Category")}
              description={translate("No_Products_Available_Description_Category")}
            />
          )}
        </>
      )}
    </div>
  );
}
