"use client";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  ChartNoAxesCombined,
  CircleFadingPlus,
  Eye,
  ImageOff,
  IndianRupee,
  Pencil,
  PencilLine,
  Search,
  UserRoundPen,
} from "lucide-react";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { TablePagination } from "../../components-common/tables/Pagination";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import ProductCard, { calculateStatusChip } from "./product-card";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components-common/data-table";
import CategorySubCategorySelect from "../../components-common/category-dropdowns";
import { ViewToggle } from "../../components-common/view-toggle";
import { SearchInput } from "../../components-common/search-field";
import SingleSelect from "../../components-common/single-select";
import ProductManageMentFilter from "./viewProduct/productManagementFilter";
import ToolTip from "../../components-common/tool-tip";
import StatusBadge from "../../components-common/status-badge";
import { cn } from "@sohanemon/utils";
import { currency, formatNumber } from "@/lib/utils/constants";
import toast from "react-hot-toast";

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
  lifeTime: boolean;
  startDate: string;
  endDate: string;
  status: string;
  commission: number;
  commission_type: string;
  referenceLinks: string[];
  creatorMaterial: any[];
  videoType: string;
  channels: string[];
  notes: string;
  discount: number;
  discountType: string;
  couponCode: string;
  activeCollabCount: number;
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
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const pageLimit = 20;

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    categoryIds: string[] = [],
    status: string = ""
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `product/vendor-product/product/list?page=${page}&limit=${pageLimit}${
          searchValue ? `&search=${searchValue}` : ""
        }${categoryIds?.length > 0 ? `&categories=${categoryIds}` : ""}${
          status ? `&status=${status}` : ""
        }`
      );
      if (response.data.data?.list) {
        setProductList(
          response.data.data?.list.map((product: IProduct) => {
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
              <Avatar className="w-8 h-8 flex justify-center items-center">
                <ImageOff className="w-6 h-6 text-gray-400" />
              </Avatar>
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
    // {
    //   id: "categories",
    //   header: () => translate("Categories"),
    //   accessorKey: "categories",
    //   cell: ({ row }) => (
    //     <TruncateWithToolTip
    //       checkHorizontalOverflow={false}
    //       linesToClamp={2}
    //       text={row.original.categories ?? ""}
    //     />
    //   ),
    // },
    {
      id: "activeCollabCount",
      header: () => (
        <span className="flex items-center justify-center">
          {translate("Active_Collabs")}
        </span>
      ),
      accessorKey: "sku",
      cell: ({ row }) => (
        <span className="flex items-center justify-center">
          {formatNumber(row?.original?.activeCollabCount)}
        </span>
      ),
    },
    // {
    //   id: "status",
    //   header: () => translate("Status"),
    //   accessorKey: "status",
    //   cell: ({ row }) => {
    //     return(
    //     <div className="flex justify-center">
    //       <StatusBadge
    //         status={row?.original?.status}
    //       />
    //     </div>
    //     )
    //   },

    // },
    // {
    //   id: "endDate",
    //   header: () => translate("End_Date"),
    //   accessorKey: "endDate",
    //   // cell: ({ row }) => (
    //   //   <TruncateWithToolTip
    //   //     checkHorizontalOverflow={false}
    //   //     linesToClamp={2}
    //   //     text={row.original.tags?.join(", ") ?? ""}
    //   //   />
    //   // ),
    // },
    // {
    //   id: "tags",
    //   header: () => translate("Tags"),
    //   accessorKey: "tags",
    //   cell: ({ row }) =>
    //     row.original.tags?.length > 0 ? (
    //       <div className="flex gap-2 w-full">
    //         {row.original.tags.slice(0, 2).map((tag, index) => (
    //           <TruncateWithToolTip
    //             key={index}
    //             checkHorizontalOverflow={true}
    //             className={cn(
    //               "flex items-center gap-1 text-[10px] md:px-3 text-center px-1 py-0.5 rounded-full bg-muted text-muted-foreground border border-muted-foreground"
    //             )}
    //             text={`#${tag}`}
    //           />
    //         ))}
    //       </div>
    //     ) : (
    //       <span className="text-xs text-gray-400">-</span>
    //     ),
    // },
    {
      id: "commission",
      header: () => (
        <span className="flex items-center justify-center">
          {translate("Base_Commission")}
        </span>
      ),
      accessorKey: "commission",
      cell: ({ row }) => (
        <span className="w-full flex items-center justify-center">
          {row?.original?.commission_type === "FIXED_AMOUNT" ? (
            <IndianRupee size={15} />
          ) : (
            ``
          )}
          {row?.original?.commission}
          {row?.original?.commission_type === "PERCENTAGE" ? ` % ` : ``}
        </span>
      ),
    },
    {
      id: "price",
      header: () => (
        <span className="flex items-center justify-center">
          {translate("Product_Price")}
        </span>
      ),
      accessorKey: "price",
      cell: ({ row }) => (
        <span className="w-full flex items-center justify-center">
          <IndianRupee size={15} />{" "}
          {row?.original?.price ? row?.original?.price : ""}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="flex items-center justify-center">
          {translate("Status")}
        </span>
      ),
      accessorKey: "status",
      cell: ({ row }) => {
        const { chipText, chipColor } = calculateStatusChip(row.original);
        console.log("chipText", chipText, chipColor);

        return (
          <div className="flex items-center justify-center">
            <div
              className={`flex justify-center item min-w-[100px] w-fit md:text-[10px] text-[8px] px-2 py-1 rounded-full font-semibold uppercase ${chipColor} ${
                chipText === "Expired" ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (chipText === "Expired") {
                  router.push(`/vendor/campaign/product/${row?.original?._id}`);
                }
              }}
            >
              {chipText}
            </div>
          </div>
        );
      },
    },
    {
      id: "action",
      header: () => <div className="text-center">{translate("Action")}</div>,
      accessorKey: "",
      meta: {
        isColumnSticky: true,
        stickySide: "right",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3 justify-center">
          {/* View button (currently commented) */}
          <ToolTip content="Show Analytics" delayDuration={1000}>
            <ChartNoAxesCombined
              strokeWidth={1.5}
              color="#FF4979"
              className="cursor-pointer size-5 "
              onClick={() => router.push(`/vendor/vendor-analysis`)}
            />
          </ToolTip>

          <div
            onClick={() =>
              router.push(`/vendor/campaign/product/${row?.original?._id}`)
            }
            className="cursor-pointer"
          >
            <ToolTip content="Edit Product" delayDuration={1000}>
              <UserRoundPen
                strokeWidth={1.5}
                color="#3b82f6"
                className="cursor-pointer size-5"
              />
            </ToolTip>
          </div>
        </div>
      ),
    },
  ];

  const tableContent = () => {
    return <DataTable columns={productColumns} data={productList} />;
  };

  const handleSelectStatus = (selectedOptions: any) => {
    fetProductsList(1, true, search, selectedCategories, selectedOptions);
    setSelectedStatus(selectedOptions);
  };
  return (
    <div className="p-2 md:p-4 rounded-lg flex flex-col gap-2 md:gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
            />
            <div className="flex flex-row gap-2 justify-end items-center ml-auto">
              <ProductManageMentFilter
                onChange={handleSelectCategory}
                handleSelectStatus={handleSelectStatus}
              />
              {/* <ViewToggle viewMode={viewMode} setViewMode={setViewMode} /> */}
            </div>
          </div>
          {internalLoading && <Loader />}
          {productList?.length > 0 ? (
            <>
              {viewMode === "table" && tableContent()}
              {viewMode === "card" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 bg-white p-4 rounded-[20px] overflow-auto h-full">
                  {productList.map((item: any, i) => (
                    <div key={i} className="flex h-fit w-full">
                      <ProductCard key={i + "666"} item={item} />
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
              title={translate("No_Products_Available")}
              description={translate("No_Products_Available_Description")}
            />
          )}
        </>
      )}
    </div>
  );
}
