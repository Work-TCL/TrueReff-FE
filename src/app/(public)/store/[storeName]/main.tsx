"use client";
import React, { useEffect, useState } from "react";
import StoreDetailCard from "./StoreDetailCard";
import { useParams } from "next/navigation";
import { getCreatorStore } from "@/lib/web-api/my-store";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import ProductList from "./product-list";
import Loading from "@/app/vendor/loading";
import NotFound from "@/app/_components/components-common/404";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";

interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // You can use `Date` if you parse it into a Date object
  updatedAt: string; // You can use `Date` if you parse it into a Date object
}
export interface IStore {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  dob: string; // You can use `Date` if you parse it into a Date object
  gender: string;
  state: string;
  city: string;
  category: ICategory[];
  sub_category: string[];
  tags: string[];
  channels: string[];
  completed_step: number;
  status: string;
  createdAt: string; // You can use `Date` if you parse it into a Date object
  updatedAt: string; // You can use `Date` if you parse it into a Date object
  instagram_link: string;
  youtube_link: string;
  banner_image: string;
  profile_image: string;
  store_description: string;
  store_name: string;
  store_link?: string;
  facebook_link?: string;
  twitter_link?: string;
}
export default function PublicCreatorStore() {
  const params = useParams();
  const translate = useTranslations();
  let storeName: any = params?.storeName;
  const [notFounded, setNotFounded] = useState(false);
  const [store, setStore] = useState({
    _id: "",
    accountId: "",
    full_name: "",
    user_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    state: "",
    city: "",
    category: [],
    sub_category: [],
    tags: [],
    channels: [],
    completed_step: 0,
    status: "",
    createdAt: "",
    updatedAt: "",
    instagram_link: "",
    youtube_link: "",
    banner_image: "",
    profile_image: "",
    store_description: "",
    store_name: "",
    store_link: "",
    facebook_link: "",
  twitter_link: ""
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
          ...storeData,
          store_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${storeData?.store_name}`,
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
  const [showProfile, setShowProfile] = useState(true);
const [lastScrollTop, setLastScrollTop] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop) {
      setShowProfile(false); // scrolling down
    } else {
      setShowProfile(true); // scrolling up
    }

    setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollTop]);

  if (!storeName) {
    return <NotFound />;
  }
  return (
    <>
      {loading ? (
        <Loading className="h-screen" />
      ) : notFounded ? <div className="grid grid-cols-1 h-screen p-4"><EmptyPlaceHolder title={translate("No_Store_Available_Title")} description={translate("No_Store_Available_Description")} /></div> : (
        <div className="bg-custom-gradient min-h-screen w-full overflow-y-auto">
        <div className="flex flex-col gap-3 max-w-[1200px] mx-auto p-4">
          {/* Sticky Profile with hide-on-scroll */}
          <div className="sticky top-0 z-10 transition-transform duration-500" style={{ transform: showProfile ? "translateY(0)" : "translateY(-100%)" }}>
            <StoreDetailCard store={store} />
          </div>
      
          {/* Scrollable Product List */}
          <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <ProductList storeName={storeName ?? ""} />
          </div>
        </div>
      </div>
      
      )}
    </>
  );
}
