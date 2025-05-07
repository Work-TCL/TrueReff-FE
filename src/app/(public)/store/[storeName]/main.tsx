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
import NotFound from "@/app/_components/components-common/404";

export default function PublicCreatorStore() {
  const params = useParams();
  let storeName: any = params?.storeName;
  const [notFounded, setNotFounded] = useState(false);
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
          link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${storeData?.storeName}`,
          profile_image: storeData?.profile_image,
          banner_image: storeData?.banner_image,
          creatorId: storeData?.creatorId?._id,
        };
        setStore({ ...data });
      } else {
        throw "This Store is not Exist";
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
      setNotFounded(true);
    } finally {
      setLoading(false);
    }
  }

  if (notFounded || !storeName) {
    return <NotFound />;
  }
  return (
    <>
      {loading ? (
        <Loading className="h-screen" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 gap-y-4 md:h-screen overflow-auto md:overflow-hidden p-4">
          <div className="col-span-1 overflow-auto">
            <StoreDetailCard store={store} />
          </div>
          <div className="col-span-2 md:overflow-hidden flex lg:min-h-full min-h-96">
            <ProductList storeName={storeName ?? ""} />
          </div>
        </div>
      )}
    </>
  );
}
