"use client";

import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { translate } from "@/lib/utils/translate";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import BrandProductTable from "./BrandProductTable";
import Loading from "@/app/vendor/loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FaSlidersH } from "react-icons/fa";
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
  const brandName = searchParams.get("brandName") ?? "";
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  // Get Creator list
  const getCreatorList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/product/vendor-product/product/list/${params.id}?page=${currentPage}&limit=${pageSize}`);
      if (response.status === 200) {
        const brandData = response.data.data;
        if (brandData && typeof brandData === "object") {
          const brandsArray = brandData.data || [];
          const brandsCount = brandData.count || 0;

          if (Array.isArray(brandsArray)) {
            let result = brandsArray.map(ele => {
              let productId = ele?.productId
              let category = (productId?.category && productId?.category?.length > 0) ? productId?.category.filter((cat: ICategory) => cat.parentId === null).map((cat: ICategory) => cat?.name):[]
              return {...ele,productId: {...productId,categories: category}}
            })
            setBrands([...result]);
            setTotalPages(Math.ceil(brandsCount / pageSize));
          } else {
            setBrands([]);
            setCurrentPage(1);
          }
          setLoading(false);
        } else {
          setBrands([]);
          setCurrentPage(1);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [axios, pageSize]);

  useEffect(() => {
    getCreatorList();
  }, [currentPage]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value)
  }
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4">
      <div className="text-[20px] text-500">
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
      {loading && <Loading />}
      {!loading && <BrandProductTable data={brands} brandName={brandName} />}
      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <TablePagination totalPages={totalPages} activePage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
