"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ImageOff, Search } from "lucide-react";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { TablePagination } from "../../components-common/tables/Pagination";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import ProductCard from "./product-card";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
import CategorySubCategorySelect from "../../components-common/category-dropdowns";
import { ViewToggle } from "../../components-common/view-toggle";
import { SearchInput } from "../../components-common/search-field";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
  }, []);

  // Update the onClick handlers for pagination buttons
  const handlePageChange = (page: number) => {
    page !== currentPage &&
      fetProductsList(page, true, search, [...selectedCategories]);
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
    debouncedSearch(value, [...selectedCategories]);
  };
  const handleSelectCategory = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions);
    fetProductsList(1, true, search, [...selectedOptions]);
  };

  const productColumns: ColumnDef<IProduct>[] = [
    {
      id: "channelName",
      header: () => translate("Channel"),
      accessorKey: "channelName",
      cell: ({ row }) => row.original.channelName,
    },
    {
      id: "title",
      header: () => translate("Product_Name"),
      accessorKey: "title",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`/vendor/products/view/${product._id}`)}
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
        );
      },
    },
    {
      id: "categories",
      header: () => translate("Categories"),
      accessorKey: "categories",
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.categories ?? ""}
        />
      ),
    },
    {
      id: "subCategories",
      header: () => translate("Sub_category"),
      accessorKey: "subCategories",
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.subCategories ?? ""}
        />
      ),
    },
    {
      id: "tags",
      header: () => translate("Tags"),
      accessorKey: "tags",
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.tags?.join(", ") ?? ""}
        />
      ),
    },
    {
      id: "sku",
      header: () => translate("SKU"),
      accessorKey: "sku",
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.sku ?? ""}
        />
      ),
    },
    {
      id: "price",
      header: () => <>Selling {translate("Price")}</>,
      accessorKey: "price",
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.price ?? ""}
        />
      ),
    },
  ];

  const tableContent = () => {
    return <DataTable columns={productColumns} data={productList} />;
  };

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
            />
            <div className="flex flex-row gap-2 justify-end items-center ml-auto">
              <CategorySubCategorySelect onChange={handleSelectCategory} />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          {internalLoading && <Loader />}
          {productList?.length > 0 ? (
            <>
              {viewMode === "table" && tableContent()}
              {viewMode === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-white p-4 rounded-[20px] overflow-auto">
                  {productList.map((item: any, i) => (
                    <div key={i} className="flex h-full w-full">
                      <ProductCard item={item} />
                    </div>
                  ))}
                </div>
              )}
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
