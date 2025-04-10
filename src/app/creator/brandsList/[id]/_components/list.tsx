"use client";

import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import BrandProductTable from "./BrandProductTable";
import Loading from "@/app/vendor/loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FaSlidersH } from "react-icons/fa";
import Loader from "@/app/_components/components-common/layout/loader";
import { useTranslations } from "next-intl";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
export interface ICategory {
  _id: string,
  name: string,
  parentId: string | null,
  createdAt: string,
  updatedAt: string
}

export interface IProduct {
  _id: string,
  title: string,
  channelProductId: string,
  sku: string,
  description: string,
  media: string[],
  channelName: string,
  tags: string[],
  createdAt: string,
  updatedAt: string,
  category?: ICategory[],
  categories?: string[],
}
export interface IBrand {
  _id: string,
  vendorId: string,
  productId: IProduct,
  channelName: string,
  createdAt: string,
  updatedAt: string
}

export default function CreatorList() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const translate = useTranslations();
  const brandName = searchParams.get("brandName") ?? "";
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [brandProducts, setBrandProducts] = useState<IBrand[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;

  // Get Creator list
  const getBrandProductList = useCallback(async (page:number,isInternalLoader = false) => {
    isInternalLoader ? setInternalLoader(true) :  setLoading(true);
    try {
      const response = await axios.get(`/product/vendor-product/product/list/${params.id}?page=${page}&limit=${pageSize}`);
      if (response.status === 200) {
        const brandData = response.data.data;
        if (brandData && typeof brandData === "object") {
          const brandProductsArray = brandData.data || [];
          const brandProductsCount = brandData.count || 0;

          if (Array.isArray(brandProductsArray) && brandProductsArray?.length>0) {
            let result = brandProductsArray.map(ele => {
              let productId = ele?.productId
              let category = (productId?.category && productId?.category?.length > 0) ? productId?.category.filter((cat: ICategory) => cat.parentId === null).map((cat: ICategory) => cat?.name):[]
              return {...ele,productId: {...productId,categories: category}}
            })
            setBrandProducts([...result]);
            setTotalPages(Math.ceil(brandProductsCount / pageSize));
          } else {
            setBrandProducts([]);
            setCurrentPage(1);
          }
          setLoading(false);
          setInternalLoader(false);
        } else {
          setBrandProducts([]);
          setCurrentPage(1);
          setLoading(false);
          setInternalLoader(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
      setInternalLoader(false);
    }
  }, [axios, pageSize]);

  useEffect(() => {
    getBrandProductList(currentPage);
  }, []);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value)
  }
  const handlePageChange = (page:number) => {
    page !== currentPage && getBrandProductList(page,true);
    setCurrentPage(page);
  }
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      {loading ? <Loading/> : brandProducts?.length > 0 ? <><div className="text-[20px] text-500">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbPage className="cursor-pointer hover:text-[grey]" onClick={()=> router.push(`/creator/brandsList`)}>{brandName}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{translate("Product_Lists")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-[20px] text-500">
          <Input value={search} onChange={handleSearch} placeholder={translate("Search_product")} />
        </div>
        <div className="flex items-center gap-[10px]">
          <PiListChecksLight size={35} />
          <IoGridOutline size={30} />
          <Button variant="outline" className="text-black w-[100px] rounded-[4px]">
            <FaSlidersH /> {translate("Filters")}
          </Button>
        </div>
      </div>
      {internalLoader && <Loader />}
      <BrandProductTable data={brandProducts} brandName={brandName} />
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={handlePageChange} />
      </div></>:<EmptyPlaceHolder title={"No_Products_Available_Title"} description={"No_Products_Available_Description"}/>}
    </div>
  );
}
