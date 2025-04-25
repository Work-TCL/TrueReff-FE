"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";

import { ImageOff, Search } from "lucide-react";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { getCategories } from "@/lib/web-api/auth";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import Loader from "@/app/_components/components-common/layout/loader";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import ProductCard from "@/app/_components/components-common/product/product-card";
const Select = dynamic(() => import("react-select"), { ssr: false });

export interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // or Date if parsed
  updatedAt: string; // or Date
}

export interface IProduct {
  vendor: any;
  collaboration: any;
  request: any;
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

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
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
      //   const response = await axios.get(
      //     `product/vendor-product/product/list?page=${page}&limit=${pageLimit}${
      //       searchValue ? `&search=${searchValue}` : ""
      //     }${categoryIds?.length > 0 ? `&categories=${categoryIds}` : ""}`
      //   );
      let response = {
        data: {
          data: {
            data: [
              {
                _id: "67fdea4336446d624d836320",
                title: "The Archived Snowboard",
                channelProductId: "gid://shopify/Product/7856547102777",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-archived-snowboard",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_52f8e304-92d9-4a36-82af-50df8fe31c69.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a522d3f810c558818ab",
                    name: "category 1 sub(1)",
                    parentId: "67db0a252d3f810c5588189a",
                    createdAt: "2025-03-19T18:17:54.142Z",
                    updatedAt: "2025-03-19T18:17:54.142Z",
                  },
                ],
                tags: [
                  "Archived",
                  "Premium",
                  "Snow",
                  "Snowboard",
                  "Sport",
                  "Winter",
                ],
                createdAt: "2025-04-15T05:10:27.771Z",
                updatedAt: "2025-04-15T05:10:27.771Z",
              },
              {
                _id: "67fdea5136446d624d83632a",
                title: "Selling Plans Ski Wax",
                channelProductId: "gid://shopify/Product/7856547266617",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "selling-plans-ski-wax",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/snowboard_wax.png?v=1740639562",
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/wax-special.png?v=1740639562",
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/sample-normal-wax.png?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a2f2d3f810c558818a0",
                    name: "category 3",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:19.011Z",
                    updatedAt: "2025-03-19T18:17:19.011Z",
                  },
                  {
                    _id: "67db0a522d3f810c558818ab",
                    name: "category 1 sub(1)",
                    parentId: "67db0a252d3f810c5588189a",
                    createdAt: "2025-03-19T18:17:54.142Z",
                    updatedAt: "2025-03-19T18:17:54.142Z",
                  },
                  {
                    _id: "67db0a722d3f810c558818b4",
                    name: "category 3 sub(1)",
                    parentId: "67db0a2f2d3f810c558818a0",
                    createdAt: "2025-03-19T18:18:26.223Z",
                    updatedAt: "2025-03-19T18:18:26.223Z",
                  },
                ],
                tags: ["Accessory", "Sport", "Winter"],
                createdAt: "2025-04-15T05:10:41.436Z",
                updatedAt: "2025-04-15T05:10:41.436Z",
              },
              {
                _id: "67fdea6136446d624d836334",
                title: "The Out of Stock Snowboard",
                channelProductId: "gid://shopify/Product/7856547299385",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-out-of-stock-snowboard",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a322d3f810c558818a3",
                    name: "category 4",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:22.403Z",
                    updatedAt: "2025-03-19T18:17:22.403Z",
                  },
                  {
                    _id: "67db0a412d3f810c558818a6",
                    name: "category 4 sub(1)",
                    parentId: "67db0a322d3f810c558818a3",
                    createdAt: "2025-03-19T18:17:37.581Z",
                    updatedAt: "2025-03-19T18:17:37.581Z",
                  },
                ],
                tags: ["Accessory", "Sport", "Winter"],
                createdAt: "2025-04-15T05:10:57.452Z",
                updatedAt: "2025-04-15T05:10:57.452Z",
              },
              {
                _id: "67fdf9c136446d624d836542",
                title: "The Hidden Snowboard",
                channelProductId: "gid://shopify/Product/7856547332153",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-hidden-snowboard",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a522d3f810c558818ab",
                    name: "category 1 sub(1)",
                    parentId: "67db0a252d3f810c5588189a",
                    createdAt: "2025-03-19T18:17:54.142Z",
                    updatedAt: "2025-03-19T18:17:54.142Z",
                  },
                ],
                tags: ["Premium", "Snow", "Snowboard", "Sport", "Winter"],
                createdAt: "2025-04-15T06:16:33.352Z",
                updatedAt: "2025-04-15T06:16:33.352Z",
              },
              {
                _id: "6802843bc3b3ac185de07a0a",
                title: "The Collection Snowboard: Hydrogen",
                channelProductId: "gid://shopify/Product/7856547233849",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-collection-snowboard-hydrogen",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_0a40b01b-5021-48c1-80d1-aa8ab4876d3d.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a2f2d3f810c558818a0",
                    name: "category 3",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:19.011Z",
                    updatedAt: "2025-03-19T18:17:19.011Z",
                  },
                  {
                    _id: "67db0a522d3f810c558818ab",
                    name: "category 1 sub(1)",
                    parentId: "67db0a252d3f810c5588189a",
                    createdAt: "2025-03-19T18:17:54.142Z",
                    updatedAt: "2025-03-19T18:17:54.142Z",
                  },
                  {
                    _id: "67db0a752d3f810c558818b7",
                    name: "category 3 sub(2)",
                    parentId: "67db0a2f2d3f810c558818a0",
                    createdAt: "2025-03-19T18:18:29.015Z",
                    updatedAt: "2025-03-19T18:18:29.015Z",
                  },
                ],
                tags: ["Accessory", "Sport", "Winter"],
                createdAt: "2025-04-18T16:56:27.720Z",
                updatedAt: "2025-04-18T16:56:27.720Z",
              },
              {
                _id: "6805cd7cb0021a73fc9224fd",
                title: "The 3p Fulfilled Snowboard",
                channelProductId: "gid://shopify/Product/7856547397689",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-3p-fulfilled-snowboard",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a2c2d3f810c5588189d",
                    name: "category 2",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:16.624Z",
                    updatedAt: "2025-03-19T18:17:16.624Z",
                  },
                  {
                    _id: "67db0a5c2d3f810c558818ae",
                    name: "category 2 sub(1)",
                    parentId: "67db0a2c2d3f810c5588189d",
                    createdAt: "2025-03-19T18:18:04.818Z",
                    updatedAt: "2025-03-19T18:18:04.818Z",
                  },
                  {
                    _id: "67db0a612d3f810c558818b1",
                    name: "category 2 sub(2)",
                    parentId: "67db0a2c2d3f810c5588189d",
                    createdAt: "2025-03-19T18:18:09.657Z",
                    updatedAt: "2025-03-19T18:18:09.657Z",
                  },
                ],
                tags: ["Accessory", "Sport", "Winter"],
                createdAt: "2025-04-21T04:45:48.503Z",
                updatedAt: "2025-04-21T04:45:48.503Z",
              },
              {
                _id: "6805e524b0021a73fc9226d4",
                title: "The Multi-managed Snowboard",
                channelProductId: "gid://shopify/Product/7856547430457",
                vendorId: "67fddfb2b8f800fa8b7221d0",
                sku: "the-multi-managed-snowboard",
                description: "",
                media: [
                  "https://cdn.shopify.com/s/files/1/0712/7996/8313/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a.jpg?v=1740639562",
                ],
                channelName: "shopify",
                category: [
                  {
                    _id: "67db0a252d3f810c5588189a",
                    name: "category 1",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:09.650Z",
                    updatedAt: "2025-03-19T18:17:09.650Z",
                  },
                  {
                    _id: "67db0a2f2d3f810c558818a0",
                    name: "category 3",
                    parentId: null,
                    createdAt: "2025-03-19T18:17:19.011Z",
                    updatedAt: "2025-03-19T18:17:19.011Z",
                  },
                  {
                    _id: "67db0a722d3f810c558818b4",
                    name: "category 3 sub(1)",
                    parentId: "67db0a2f2d3f810c558818a0",
                    createdAt: "2025-03-19T18:18:26.223Z",
                    updatedAt: "2025-03-19T18:18:26.223Z",
                  },
                  {
                    _id: "67db0a752d3f810c558818b7",
                    name: "category 3 sub(2)",
                    parentId: "67db0a2f2d3f810c558818a0",
                    createdAt: "2025-03-19T18:18:29.015Z",
                    updatedAt: "2025-03-19T18:18:29.015Z",
                  },
                ],
                tags: ["Premium", "Snow", "Snowboard", "Sport", "Winter"],
                createdAt: "2025-04-21T06:26:44.519Z",
                updatedAt: "2025-04-21T06:26:44.519Z",
              },
            ],
            count: 7,
          },
        },
      };
      if (response.data.data?.data) {
        setProductList(
          response.data.data?.data.map((product: any) => {
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

  const tableContent = () => {
    return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index} className=" bg-white hover:bg-gray-100">
                <CustomTableCell>{product.channelName}</CustomTableCell>
                <CustomTableCell>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      router.push(`/vendor/products/view/${product._id}`)
                    }
                  >
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
                <CustomTableCell className="text-center">
                  <TruncateWithToolTip
                    checkHorizontalOverflow={false}
                    linesToClamp={2}
                    text={product.price ?? ""}
                  />
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <div className="relative md:text-[20px] text-base text-500 max-w-[350px] w-full ">
              <Input
                value={search}
                onChange={handleSearch}
                placeholder={translate("Search_Product")}
                className="p-3 rounded-lg bg-white pl-10  w-full gray-color" // Add padding to the left for the icon
              />
              <Search className="absolute shrink-0 size-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-color" />
            </div>
            <div className="flex md:flex-row flex-col gap-2 w-full justify-end items-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-[20px] max-h-screen overflow-auto">
                {productList.map((item: any, i) => (
                  <div key={i} className="flex h-full w-full">
                    <ProductCard
                      item={item}
                      productDetailLink="/product-detail"
                    />
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
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
