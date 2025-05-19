"use client";

import { Input } from "@/components/ui/input";
import BrandCard from "./_components/brandCard";
import { LoaderCircle, Search } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import Loading from "../loading";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { IoGridOutline } from "react-icons/io5";
import { PiListChecksLight } from "react-icons/pi";
import BrandListView from "./_components/brandList";
import { SearchInput } from "@/app/_components/components-common/search-field";
import BrandFilter from "./_components/filter";
import { useCreatorStore } from "@/lib/store/creator";
import ProductCard from "./_components/product-card";

export interface ICollaboration {
  _id: string;
  productId: string;
  collaborationStatus: string;
}
export interface IBrandProduct {
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[];
  price: number;
  channelName: string;
  category: ICategory[];
  subCategory: string[];
  tags: string[];
  lifeTime: boolean;
  startDate: string;
  endDate: string;
  status: string;
  commission: number;
  commission_type: string;
  referenceLinks: string[];
  creatorMaterial: string[];
  videoType: string;
  channels: string[];
  notes: string;
  discount: number;
  discountType: string;
  couponCode: string;
  createdAt: string;
  updatedAt: string;
  collaboration: ICollaboration;
  categories?: string[];
  tag?: string;
}
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
  media: string[];
  category: ICategory[];
}
export interface Brand {
  _id: string;
  business_name: string;
  profile_image: string;
}
export default function BrandList() {
  const { creator } = useCreatorStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [vendorId, setVendorId] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchProductList, setSearchProductList] = useState<IProduct[]>([]);
  const [productList, setProductList] = useState<IBrandProduct[]>([]);
  const [suggestedProductList, setSuggestedProductList] = useState<IBrandProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSuggestedPage, setCurrentSuggestedPage] = useState(1);
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [hasSuggestedMore, setHasSuggestedMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const itemsPerPage = 20;
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
  // Get Brand list
  const getBrandList = async (
    page: number,
    isInternalLoader: boolean = false,
    searchValue: string = ""
  ) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response: any = await axios.get(
        `/product/creator-product/product/search?page=${page}&limit=${itemsPerPage}${searchValue ? `&search=${searchValue}` : ""
        }`
      );
      if (response.status === 200) {
        const brandData = response.data.data?.vendorList;;
        const productData = response.data.data?.productList;;
        if (brandData?.length > 0) {
          setBrands(brandData);
        } else {
          setBrands([]);
        }
        if (productData?.length > 0) {
          setSearchProductList(productData);
        } else {
          setSearchProductList([]);
        }
        setLoading(false);
        setInternalLoader(false);
      } else {
        setLoading(false);
        setInternalLoader(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setInternalLoader(false);
    }
  };
  const getBrandProductList = async (
    page: number,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    vendorId: string = ""
  ) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response: any = await axios.get(
        `/product/creator-product/product/list-search?page=${page}&limit=${itemsPerPage}${(searchValue && !vendorId) ? `&search=${searchValue}` : ""
        }${vendorId ? `&vendorId=${vendorId}` : ""}`
      );
      if (response.status === 200) {
        if (response?.data?.data?.productList?.list?.length > 0) {
          const productData = response?.data?.data?.productList?.list;
          const productCount = response?.data?.data?.productList?.total;
          const data = productData?.map((ele: IBrandProduct) => {
            ele.categories = ele.category
              ?.map((ele: { name: string }) => ele?.name);
            ele.tag = ele.tags?.join(",");
            return { ...ele };
          })
          let more = [...productList,...data]?.length < productCount;
          setHasMore(more);
          more ? setProductList([...productList, ...data]) : setProductList([...data]);          
        } else {
          setProductList([]);
          setCurrentPage(1);
          setHasMore(false);
        }
        if (response?.data?.data?.suggestedList?.list?.length > 0) {
          const productData = response?.data?.data?.suggestedList?.suggestedProductList;
          const productCount = response?.data?.data?.suggestedList?.total;
          const data = productData?.map((ele: IBrandProduct) => {
            ele.categories = ele.category
              ?.map((ele: { name: string }) => ele?.name);
            ele.tag = ele.tags?.join(",");
            return { ...ele };
          })
          let more = [...suggestedProductList,...data]?.length < productCount;
          setHasSuggestedMore(more);
          more ? setSuggestedProductList([...suggestedProductList,...data]) : setSuggestedProductList(data);
        } else {
          setSuggestedProductList([]);
        }
        setLoading(false);
        setInternalLoader(false);
      } else {
        setLoading(false);
        setInternalLoader(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setInternalLoader(false);
    }
  };

  useEffect(() => {
    getBrandProductList(currentPage,true,search,vendorId);
  }, [currentPage]);
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      value && getBrandList(1, true, value);
      getBrandProductList(1, true, value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value); // call debounce on value
  };
  const handleOnFilter = (filterState: any) => {
    getBrandList(1, true, search);
  };
  const handleOnSearch = (vendor: Brand, isVendor: boolean = false) => {
    setSearch(vendor?.business_name);
    setBrands([]);
    setSearchProductList([])
    getBrandProductList(1, true, search, vendor?._id);
    setVendorId(vendor?._id);
    setCurrentPage(1);
  }
  return (
    <div className={`flex flex-col p-4 gap-4 h-full`}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={t("SearchBrand")}
              className="md:max-w-[700px]"
            />
            {/* <div className="flex md:flex-row flex-col gap-2 justify-end items-center">
              <BrandFilter onChange={handleOnFilter} />
              <PiListChecksLight
                className={`cursor-pointer md:size-[30px] size-6 ${
                  viewMode === "table" ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => setViewMode("table")}
              />
              <IoGridOutline
                className={`cursor-pointer md:size-[30px] size-6 ${
                  viewMode === "card" ? "text-blue-600" : "text-gray-400"
                }`}
                onClick={() => setViewMode("card")}
              />
            </div> */}
          </div>
          {(internalLoader && !hasMore) && <Loader />}
          <div className="flex flex-col gap-2">
            {brands?.length > 0 && brands?.map((brand: Brand, index: number) => (
              <div key={index} className="flex items-center cursor-pointer gap-4" onClick={() => handleOnSearch(brand)}>
                {brand?.profile_image && (
                  <img
                    src={brand?.profile_image}
                    alt={brand?.business_name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-black">{brand?.business_name}</span>
              </div>
            ))}
            {searchProductList?.length > 0 && searchProductList?.map((product: IProduct, index: number) => (
              <div key={index} className="flex items-center cursor-pointer gap-4">
                <img
                  src={product?.media?.length > 0 ? product?.media[0] : "/assets/product/image-square.svg"}
                  alt={"Product Image"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-black">{`${search} ${product?.title}`}</span>
              </div>
            ))}
          </div>
          {productList?.length > 0 ? (
            <div className="flex flex-col gap-3 rounded-[20px]">
              {search && <div className="font-bold">{`Showing results for "${search}"`}</div>}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 md:gap-4 h-full  overflow-auto">
                {productList.map((item: any, i) => (
                  <div key={i} className="flex h-fit w-full">
                    <ProductCard
                      item={item}
                      handleUpdateProduct={() => {
                        // setIsOpen({ show: true, creatorId });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyPlaceHolder
              title={t("No_Products_Available")}
              description={t("No_Products_Available_Description")}
            />
          )}
          {suggestedProductList?.length > 0 ? (
            <div className="flex flex-col gap-3 h-full bg-white rounded-[20px]">
              {search && <div className="font-bold">{`Showing related for "${search}"`}</div>}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2 md:gap-4 h-full  overflow-auto">
                {suggestedProductList.map((item: any, i) => (
                  <div key={i} className="flex h-fit w-full">
                    <ProductCard
                      item={item}
                      handleUpdateProduct={() => {getBrandProductList(currentPage, true, search, vendorId); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {(hasMore || hasSuggestedMore) && (
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
        </>
      )}
    </div>
  );
}
