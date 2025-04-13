"use client";
import React, { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Button from "@/app/_components/ui/button";
import { useParams } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useVendorStore } from "@/lib/store/vendor";
interface ICollaborateRequestFormProps {
  onClose: () => void;
  creatorId: string;
}
export default function CollaborateRequestForm({ onClose,creatorId }: ICollaborateRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();
  const {vendor} = useVendorStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productCount, setProductCount] = useState<number>(0);
  useEffect(() => {
    fetchProductsList(1)
  }, [])
  const fetchProductsList = async (page: number, isInternalLoader: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`product/vendor-product/product/list?page=${page}&limit=10`);
      if (response?.status === 200) {
        if (response?.data?.data?.data) {
          const productsArray: any[] = response?.data?.data?.data;
          const count = response?.data?.data?.count;
          setProductCount(count);
          setProducts([...products, ...productsArray]);
          setLoading(false);
        } else {
        }
      }
    }
    catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  }
  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          "productIds": selectedProducts,
          "creatorId": creatorId,
          "vendorId": vendor?.vendorId
      }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.message) {
            toast.success(data[0]?.message);
            setSelectedProducts([]);
        }
        onClose();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  const handleOnSelectProduct = (productId:string) => {
    if(selectedProducts.includes(productId)){
      let filter = selectedProducts.filter((ele:any) => ele !== productId);
      setSelectedProducts([...filter]);
    } else {
      setSelectedProducts(prev => [...prev,productId]);
    }
  }
  return (
    <>
      <div className="flex max-h-80 overflow-scroll">
        <div className="flex flex-col gap-2">
          {products?.length > 0 && products?.map((product: any, index: number) => {
            return (
              <div className="flex items-center gap-4" key={index}>
                <Input type="checkbox" name="product" className="w-5 h-5" onChange={() => handleOnSelectProduct(product?._id)}/>
                <div><div
                  className="flex items-center gap-2"
                >
                  {product?.media?.length > 0 && <Avatar className="w-8 h-8">
                    <AvatarImage src={product?.media[0]} />
                  </Avatar>}
                  {product?.title}
                </div></div>
              </div>
            )
          })}
        </div>
      </div>
      <Button
        type="button"
        className="mt-3"
        loading={loading}
        disabled={selectedProducts?.length === 0}
        onClick={handleSendRequest}
      >
        {"Collaborate Now"}
      </Button>
    </>
  );
}
