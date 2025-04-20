"use client";
import React, { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Button from "@/app/_components/ui/button";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import { Info, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Loading from "@/app/creator/loading";
interface ICollaborateRequestFormProps {
  onClose: () => void;
  creatorId: string;
  submitting:boolean; 
  setSubmitting: (value: boolean) => void
}
export default function CollaborateRequestForm({
  onClose,
  creatorId,
  submitting, setSubmitting
}: ICollaborateRequestFormProps) {
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const translate = useTranslations();
  const [loading, setLoading] = useState(true);
  const { vendor } = useVendorStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productCount, setProductCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          setCurrentPage((prev) => prev + 1);
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
  useEffect(() => {
    fetchProductsList(currentPage);
  }, [currentPage]);
  const fetchProductsList = async (
    page: number,
    isLoadMore: boolean = false
  ) => {
    isLoadMore ? setLoading(true) : setIsLoading(true);
    try {
      const response = await axios.get(
        `product/vendor-product/product/list?page=${page}&limit=10`
      );
      if (response?.status === 200) {
        if (response?.data?.data?.data) {
          const productsArray: any[] = response?.data?.data?.data;
          const count = response?.data?.data?.count;
          setProductCount(count);
          setProducts([...products, ...productsArray]);
          setHasMore(
            (products.length + productsArray.length) < count
          );
          setLoading(false);
          setIsLoading(false);
        } else {
          setLoading(false);
          setIsLoading(false);
          setHasMore(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setIsLoading(false);
      setHasMore(false)
    }
  };
  const handleSendRequest = async () => {
    setSubmitting(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: selectedProducts,
          creatorId: creatorId,
          vendorId: vendor?.vendorId,
        }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.message) {
          toast.success(data[0]?.message);
          setSelectedProducts([]);
        }
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };
  const handleOnSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      let filter = selectedProducts.filter((ele: any) => ele !== productId);
      setSelectedProducts([...filter]);
    } else {
      setSelectedProducts((prev) => [...prev, productId]);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className={`flex ${loading ? '' : 'flex-col'} max-h-80 h-80 overflow-scroll`}>
        <div className={`flex flex-col gap-2 ${products?.length > 0 ? "" : "w-full"}`}>
          {loading ? <Loading /> : products?.length > 0 ?
            products?.map((product: any, index: number) => {
              return (
                <div className="flex items-center gap-4" key={index}>
                  <Input
                    type="checkbox"
                    name="product"
                    className="w-5 h-5 cursor-pointer"
                    checked={selectedProducts.includes(product?._id)}
                    disabled={submitting}
                    onChange={() => handleOnSelectProduct(product?._id)}
                  />
                  <div onClick={() => !submitting && handleOnSelectProduct(product?._id)}>
                    <div className="flex items-center gap-2">
                      {product?.media?.length > 0 && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={product?.media[0]} />
                        </Avatar>
                      )}
                      {product?.title}
                    </div>
                  </div>
                </div>
              );
            }) :
            <div className="flex flex-col justify-center text-center items-center h-full">
              <Info height={30} width={30} className="mx-auto mb-2 text-gray-400" />
              <h2 className="text-lg font-semibold">
                {translate("No_Products_Available_Title")}
              </h2>
              <p className="text-sm">
                {translate("No_Products_Available_Description")}
              </p>
            </div>}
        </div>
        {hasMore && (
          <div
            className="flex justify-center py-2 text-gray-400"
            ref={loadingRef}
          >
            <LoaderCircle className="animate-spin" color="#ff4979" size={40} />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          className="w-50"
          loading={submitting}
          disabled={submitting || selectedProducts?.length === 0}
          onClick={handleSendRequest}
        >
          {"Collaborate Now"}
        </Button>
      </div>
    </div>
  );
}
