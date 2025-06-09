"use client";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Button from "@/app/_components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import { ImageOff, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import Loading from "@/app/creator/loading";
import { badgeColor, statusMessage } from "@/lib/utils/constants";
interface ICollaborateRequestFormProps {
  onClose: () => void;
  creatorId: string;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}
export default function CollaborateRequestForm({
  onClose,
  creatorId,
  submitting,
  setSubmitting,
}: ICollaborateRequestFormProps) {
  const translate = useTranslations();
  const [loading, setLoading] = useState(true);
  const { vendor } = useVendorStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetchProductsList();
  }, []);
  const fetchProductsList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `product/collaboration/vendor/creator/product/list/${creatorId}`
      );
      if (response?.status === 200) {
        console.log("response", response?.data?.data)
        if (response?.data?.data?.productList) {
          const productsArray: any[] = response?.data?.data?.productList;
          setProducts([...productsArray]);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  const handleSendRequest = async () => {
    setSubmitting(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/vendor/request-creator`,
        {
          creatorId: creatorId,
          productIds: selectedProducts
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
      <div
        className={`flex ${loading ? "" : "flex-col"
          } ${products?.length > 0 ? "" : "justify-center"
            } max-h-80 h-80 overflow-scroll`}
      >
        <div
          className={`flex flex-col gap-2 ${products?.length > 0 ? "" : "w-full"
            }`}
        >
          {loading ? (
            <Loading />
          ) : products?.length > 0 ? (
            products?.map((product: any, index: number) => {
              return (
                <div
                  className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg"
                  key={index}
                >
                  <div className="flex items-center gap-4" onClick={() =>
                        !submitting && handleOnSelectProduct(product?._id)
                      }>
                    <Input
                      type="radio"
                      name={`product-${index}`}
                      className="w-5 h-5 cursor-pointer accent-[#FF4979]"
                      checked={selectedProducts.includes(product?._id)}
                      disabled={
                        product?.collaborationStatus !== null || submitting
                      }
                      onChange={() => {}}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        {product?.media?.length > 0 ? (
                          <Avatar className={`w-8 h-8 ${product?.collaborationStatus !== null ? "opacity-50" : ""}`}>
                            <AvatarImage src={product?.media[0]} />
                          </Avatar>
                        ): <Avatar className={`w-8 h-8 flex justify-center items-center`}>
                        <ImageOff className="w-6 h-6 text-gray-400" />
                      </Avatar>}
                        <span className={`${product?.collaborationStatus !== null ? "text-gray-500" : "text-black"}`}>{product?.title}</span>
                      </div>
                    </div>
                  </div>
                  {product?.collaborationStatus && <div
                    className={`md:text-[10px] text-[8px] px-2 py-1 rounded-full font-semibold bg-opacity-10 ${badgeColor[product?.collaborationStatus]}`}
                  >
                    {statusMessage[product?.collaborationStatus]}
                  </div>}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col justify-center text-center items-center h-full">
              <Info
                height={30}
                width={30}
                className="mx-auto mb-2 text-gray-400"
              />
              <h2 className="text-lg font-semibold">
                {translate("No_Products_Available")}
              </h2>
              <p className="text-sm">
                {translate("No_Products_Available_Description")}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          className="w-50"
          loading={submitting}
          disabled={submitting || selectedProducts?.length === 0}
          onClick={handleSendRequest}
        >
          {translate("Collaborate_Now")}
        </Button>
      </div>
    </div>
  );
}
