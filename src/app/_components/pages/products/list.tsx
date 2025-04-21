"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";

import { Eye, ImageOff, Search } from "lucide-react";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { getCategories } from "@/lib/web-api/auth";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { TablePagination } from "../../components-common/tables/Pagination";
import ToolTip from "../../components-common/tool-tip";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
const Select = dynamic(() => import("react-select"), { ssr: false });

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
  subCategories?: string;
  tag?: string;
  price?: string;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "8px",
  }),
};

export default function ProductList() {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 20;

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    categoryIds: string[] = []
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `product/vendor-product/product/list?page=${page}&limit=${pageLimit}${
          searchValue ? `&search=${searchValue}` : ""
        }${categoryIds?.length > 0 ? `&categories=${categoryIds}` : ""}`
      );
      if (response.data.data?.data) {
        setProductList(
          response.data.data?.data.map((product: IProduct) => {
            let categories =
              product.category?.length > 0
                ? product.category
                    .filter((cat: ICategory) => cat.parentId === null)
                    .map((cat: ICategory) => cat?.name)
                    ?.join(", ")
                : "";
            let subCategories =
              product.category?.length > 0
                ? product.category
                    .filter((cat: ICategory) => cat.parentId !== null)
                    .map((cat: ICategory) => cat?.name)
                    ?.join(", ")
                : "";
            let tag = product.tags?.length > 0 ? product.tags?.join(", ") : "";
            return { ...product, categories, tag, subCategories };
          })
        );
        setTotalPages(Math.ceil(response.data.data?.count / pageLimit));
        setCurrentPage(page);
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      setProductList([]);
      setTotalPages(0);
      setCurrentPage(1);
      setInternalLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(currentPage);
    fetchCategory();
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

  // Update the onClick handlers for pagination buttons
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetProductsList(page, true, search, [
        ...selectedCategories,
        ...selectedSubCategories,
      ]);
  };

  const debouncedSearch = useCallback(
    debounce((value: string, categoryIds: string[]) => {
      fetProductsList(1, true, value, categoryIds);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value, [...selectedCategories, ...selectedSubCategories]);
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
    let selectedSubCategory = selectedSubCategories.filter((id) =>
      availableSubCategoriesIds.includes(id)
    );
    setSelectedSubCategories(selectedSubCategory);
    fetProductsList(1, true, search, [...selectedIds, ...selectedSubCategory]);
  };
  const handleSelectSubCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedSubCategories(selectedIds);
    fetProductsList(1, true, search, [...selectedCategories, ...selectedIds]);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <div className={`relative`}>
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_Product")}
                className="p-3 rounded-lg bg-white pl-10 max-w-[320px] w-full gray-color" // Add padding to the left for the icon
              />
              <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />
            </div>
            <div className="flex md:flex-row flex-col gap-2 w-full justify-end">
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
          {productList?.length > 0 ? (
            <>
              <div className="overflow-auto">
                <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                  <TableHeader className="bg-stroke">
                    <TableRow>
                      <CustomTableHead className="w-1/7">
                        {translate("Channel")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/4">
                        {translate("Product_Name")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/7">
                        {translate("Categories")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/7">
                        {translate("Sub_category")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/4">
                        {translate("Tags")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/4">
                        {translate("SKU")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/7">
                        Selling {translate("Price")}
                      </CustomTableHead>
                      <CustomTableHead className="w-1/7 text-center">
                        {translate("Action")}
                      </CustomTableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productList.map((product, index) => (
                      <TableRow
                        key={index}
                        className=" bg-white hover:bg-gray-100"
                      >
                        <CustomTableCell>{product.channelName}</CustomTableCell>
                        <CustomTableCell>
                          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/vendor/products/view/${product._id}`)}>
                            {product.media?.length > 0 && product.media[0] ? (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={product.media[0]} />
                              </Avatar>
                            ) : (
                              <ImageOff className="w-6 h-6 text-gray-400" />
                            )}
                            <TruncateWithToolTip
                              checkHorizontalOverflow={false}
                              linesToClamp={2}
                              text={product.title ?? ""}
                            />
                          </div>
                        </CustomTableCell>
                        <CustomTableCell>
                          <TruncateWithToolTip
                            checkHorizontalOverflow={false}
                            linesToClamp={2}
                            text={product?.categories ?? ""}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <TruncateWithToolTip
                            checkHorizontalOverflow={false}
                            linesToClamp={2}
                            text={product.subCategories ?? ""}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <TruncateWithToolTip
                            checkHorizontalOverflow={false}
                            linesToClamp={2}
                            text={product.tags.join(", ") ?? ""}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <TruncateWithToolTip
                            checkHorizontalOverflow={false}
                            linesToClamp={2}
                            text={product.sku ?? ""}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <TruncateWithToolTip
                            checkHorizontalOverflow={false}
                            linesToClamp={2}
                            text={product.price ?? ""}
                          />
                        </CustomTableCell>
                        <CustomTableCell>
                          <ToolTip content="View Product" delayDuration={1000}>
                            <Eye
                              strokeWidth={1.5}
                              color="#FF4979"
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/vendor/products/view/${product._id}`
                                )
                              }
                            />
                          </ToolTip>
                        </CustomTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              {totalPages > 1 &&<TablePagination
                totalPages={totalPages}
                activePage={currentPage}
                onPageChange={handlePageChange}
              />}
            </>
          ) : (
            <EmptyPlaceHolder
              title={"No_Products_Available_Title"}
              description={"No_Products_Available_Description"}
            />
          )}
        </>
      )}
    </div>
  );
}
