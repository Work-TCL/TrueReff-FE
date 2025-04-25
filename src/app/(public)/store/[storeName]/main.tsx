"use client";
import React, { useEffect, useState } from "react";
import StoreDetailCard from "./StoreDetailCard";
import { useParams } from "next/navigation";
import { getCreatorStore } from "@/lib/web-api/my-store";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList from "./product-list";
import Loading from "@/app/vendor/loading";

export default function PublicCreatorStore() {
  const params = useParams();
  let storeName: any = params?.storeName;
  const [store, setStore] = useState({
    creatorId: "",
    name: "",
    description: "",
    tags: [],
    category: [],
    link: "",
    profile_image: "",
    banner_image: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchStoreDetail();
  }, []);
  async function fetchStoreDetail() {
    setLoading(true);
    try {
      const response: any = await getCreatorStore({
        storeName: storeName ?? "",
      });
      if (response?.data) {
        const storeData = response?.data;
        const data = {
          name: storeData?.storeName,
          description: storeData?.storeDescription,
          tags: storeData?.tags,
          category: storeData?.category?.map((ele: any) => ele?.name),
          link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/creator/store/${storeData?.storeName}`,
          profile_image: storeData?.profile_image,
          banner_image: storeData?.banner_image,
          creatorId: storeData?.creatorId?._id,
        };
        setStore({ ...data });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-3 gap-4 h-screen overflow-hidden p-4">
          <div className="col-span-1">
            <StoreDetailCard store={store} />
          </div>
          <div className="col-span-2 bg-white rounded-lg p-4 overflow-hidden flex">
            <ProductList />
          </div>
        </div>
      )}
    </>
  );
}
