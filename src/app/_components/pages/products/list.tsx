"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";

import { Eye, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { getCategories } from "@/lib/web-api/auth";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
const Select = dynamic(() => import('react-select'), { ssr: false });


export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}

export interface IProduct {
  _id: string;
  title: string;
  channelProductId: string;
  vendorId: string;
  sku: string;
  description: string;
  media: string[]; // assuming media is an array of image/video URLs or paths
  channelName: string; // extend as needed
  category: ICategory[];
  tags: string[]; // if tags are strings
  createdAt: string; // or Date
  updatedAt: string;
  categories?: string;
  tag?: string;
  price?: string;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
};

export default function ProductList() {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [cursors, setCursors] = useState<{
    next: string | null;
    previous: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    next: null,
    previous: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    ItemPerPage: number,
    cursor: string | null = null,
    isInternalLoader: boolean = false,
    searchValue:string = "",
    categoryIds: string[] = []
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `product/vendor-product/product/list?per_page=${ItemPerPage}${
          cursor ? `&cursor=${cursor}` : ""
        }${searchValue ? `&search=${searchValue}`:""}`
      );
      if (response.data.data?.data) {
        setProductList(
          response.data.data?.data.map((product: IProduct) => {
            let categories =
              product.category?.length > 0
                ? product.category
                    .map((cat: ICategory) => cat?.name)
                    ?.join(", ")
                : "";
            let tag = product.tags?.length > 0 ? product.tags?.join(", ") : "";
            return { ...product, categories, tag };
          })
        );
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setInternalLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(20);
  }, []);
  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setCategories(data);
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Update the onClick handlers for pagination buttons
  const handleNextPage = () => {
    if (cursors.next && cursors.hasNextPage) {
      fetProductsList(20, cursors.next, true);
    }
  };

  const handlePreviousPage = () => {
    if (cursors.previous && cursors.hasPreviousPage) {
      fetProductsList(20, cursors.previous, true);
    }
  };
  const debouncedSearch = useCallback(
        debounce((value: string,categoryIds:string[]) => {
          fetProductsList(20, cursors.previous, true, value,categoryIds);
        }, 500),
        []
      );
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      setSearch(value);
      debouncedSearch(value,[...selectedCategories,...selectedSubCategories]);
    };
    const handleSelectCategory = (selectedOptions: any) => {
      const selectedIds = selectedOptions.map((opt: any) => opt.value);
      setSelectedCategories(selectedIds);
      
      const optionsSubCategory = categories.filter((ele) =>
        selectedIds.includes(ele?.parentId || "")
      );
      setSubCategory(optionsSubCategory);
  
      // Filter selected subcategories to only include available ones
      const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
      let selectedSubCategory = selectedSubCategories.filter((id) => availableSubCategoriesIds.includes(id))
      setSelectedSubCategories(selectedSubCategory);
      fetProductsList(20, cursors.previous, true, search,[...selectedIds, ...selectedSubCategory]);
    }
    const handleSelectSubCategory = (selectedOptions: any) => {
      const selectedIds = selectedOptions.map((opt: any) => opt.value);
      setSelectedSubCategories(selectedIds);
      fetProductsList(20, cursors.previous, true, search,[...selectedCategories,...selectedIds]);
    }
  return (
     <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
       <div className="flex justify-between items-center gap-2">
        <div
          className={`relative`}
        >
          <Input
            value={search}
            onChange={handleSearch}
            placeholder={translate("Search_Product")}
            className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
          />
          <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />
        </div>
        <div className="hidden md:flex-row flex-col gap-2 w-full justify-end">
          <Select
            styles={customStyles}
            value={selectedCategories.map((id) => {
              const match = parentCategory.find((cat) => cat._id === id);
              return { value: id, label: match?.name || id };
            })}
            isMulti
            onChange={handleSelectCategory}
            options={parentCategory.map((ele) => ({
              value: ele._id,
              label: ele.name,
            }))}
            isOptionDisabled={() => selectedCategories.length >= 3}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder="Parent Categories (max 3)"
          />
          <Select
            styles={customStyles}
            placeholder="Subcategories (max 3)"
            value={selectedSubCategories.map((id) => {
              const match = subCategory.find((cat) => cat._id === id);
              return { value: id, label: match?.name || id };
            })}
            isMulti
            onChange={handleSelectSubCategory}
            options={subCategory.map((ele) => ({
              value: ele._id,
              label: ele.name,
            }))}
            isOptionDisabled={() => selectedSubCategories.length >= 3}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            classNamePrefix="select"
          />
        </div>
      </div>
      {internalLoading && <Loader />}
      {loading ? (
        <Loading />
      ) : productList?.length > 0 ? (
        <>          
          <div className="overflow-auto flex-1">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
              <TableHeader className="bg-stroke">
                <TableRow>
                  <CustomTableHead className="w-1/6">
                    {translate("Channel")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/4">
                    {translate("Product_Name")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/6">
                    {translate("Categories")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/4">
                    {translate("Tags")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/4">
                    {translate("SKU")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/6">
                    Selling {translate("Price")}
                  </CustomTableHead>
                  <CustomTableHead className="w-1/6 text-center">
                    {translate("Action")}
                  </CustomTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product, index) => (
                  <TableRow key={index} className=" bg-white">
                    <CustomTableCell>{product.channelName}</CustomTableCell>
                    <CustomTableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          {product.media?.length > 0 && (
                            <AvatarImage src={product.media[0]} />
                          )}
                        </Avatar>
                        {product.title}
                      </div>
                    </CustomTableCell>
                    <CustomTableCell>{product.categories}</CustomTableCell>
                    <CustomTableCell>{product.tags.join(", ")}</CustomTableCell>
                    <CustomTableCell>{product.sku}</CustomTableCell>
                    <CustomTableCell>{product.price}</CustomTableCell>
                    <CustomTableCell>
                      <Eye color="#FF4979" className="cursor-pointer" onClick={() => router.push(`/vendor/products/view/${product._id}`)}/>
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          {cursors.next || cursors.previous ? ( // Only show pagination if either cursor is available
            <div className="flex justify-end items-center mt-1">
              <Pagination className="flex justify-end mt-1">
                <PaginationContent className="flex items-center gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                        !cursors.hasPreviousPage
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      showArrow={false}
                      onClick={handlePreviousPage}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                        !cursors.hasNextPage
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      showArrow={false}
                      onClick={handleNextPage}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>{" "}
            </div>
          ) : null}
        </>
      ) : (
        <EmptyPlaceHolder
          title={"No_Products_Available_Title"}
          description={"No_Products_Available_Description"}
        />
      )}
    </div>
  );
}
