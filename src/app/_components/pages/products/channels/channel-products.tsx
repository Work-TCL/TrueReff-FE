"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CircleFadingPlus, ImageOff } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/app/vendor/loading";
import ChannleToProduct from "@/lib/components/dialogs/channel-to-product";
import { useTranslations } from "next-intl";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useRouter } from "next/navigation";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import ToolTip from "@/app/_components/components-common/tool-tip";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/app/_components/components-common/data-table";
import { SearchInput } from "@/app/_components/components-common/search-field";

interface IProduct {
  handle: string;
  id: string;
  image: string;
  title: string;
  category: string;
  tags: string[];
  sku: string;
  price: string;
}
interface IProps {
  channelName: string;
}
export default function ChannelProductList({
  channelName = "shopify",
}: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentData, setCurrentData] = useState<IProduct | null>(null);
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

  const translate = useTranslations();

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    ItemPerPage: number,
    cursor: string | null = null,
    isInternalLoader = false,
    searchValue: string = ""
  ) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product/list?per_page=${ItemPerPage}${
          cursor ? `&cursor=${cursor}` : ""
        }${searchValue ? `&search=${searchValue}` : ""}`
      );
      if (response.data.data.products) {
        setProductList(response.data.data.products);
        setCursors({
          next: response.data.data.page_info.next_cursor,
          previous: response.data.data.page_info.previous_cursor,
          hasNextPage: response.data.data.page_info.has_next_page,
          hasPreviousPage: response.data.data.page_info.has_previous_page,
        });
      }
      setLoading(false);
      setInternalLoader(false);
    } catch (error) {
      setLoading(false);
      setInternalLoader(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(20);
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
    debounce((value: string) => {
      fetProductsList(20, cursors.previous, true, value);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "id",
      header: () => translate("Product_ID"),
      cell: ({ row }) => {
        const product = row.original;
        return product.id.split("/").pop();
      },
    },
    {
      accessorKey: "title",
      header: () => translate("Product_Name"),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`shopify/view?id=${product.id}`)}
          >
            {product.image ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.image} />
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
      accessorKey: "category",
      header: () => translate("Categories"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.category ?? ""}
        />
      ),
    },
    {
      accessorKey: "tags",
      header: () => translate("Tags"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.tags?.join(", ") ?? ""}
        />
      ),
    },
    {
      accessorKey: "sku",
      header: () => translate("SKU"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.sku ?? ""}
        />
      ),
    },
    {
      accessorKey: "price",
      header: () => <>Selling {translate("Price")}</>,
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.price ?? ""}
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">{translate("Action")}</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-center items-center gap-3">
            {/* View button (currently commented) */}
            {/* <ToolTip content="View Product" delayDuration={1000}>
            <Eye
              strokeWidth={1.5}
              color="#FF4979"
              className="cursor-pointer"
              onClick={() => router.push(`shopify/view?id=${product.id}`)}
            />
          </ToolTip> */}

            <div
              onClick={() => setCurrentData(product)}
              className="cursor-pointer"
            >
              <ToolTip content="Add Product to CRM" delayDuration={1000}>
                <CircleFadingPlus
                  strokeWidth={1.5}
                  color="#3b82f680"
                  className="cursor-pointer"
                />
              </ToolTip>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
              className="p-3 rounded-lg bg-white pl-10  w-full gray-color" // Add padding to the left for the icon
            />
          </div>
          {internalLoader && <Loader />}
          {productList?.length > 0 ? (
            <>
              <DataTable columns={columns} data={productList} />
              {currentData !== null && (
                <ChannleToProduct
                  product={{
                    productId: currentData.id,
                    channelName: channelName,
                    handle: currentData.handle,
                    id: currentData.id,
                    image: currentData.image,
                    title: currentData.title,
                    category: currentData.category,
                    tags: currentData.tags,
                    sku: currentData.sku,
                    price: currentData.price,
                  }}
                  onClose={(refresh = false) => {
                    setCurrentData(null);
                    if (refresh) {
                      fetProductsList(20, null, true);
                    }
                  }}
                />
              )}
              {/* Pagination */}
              {cursors.next || cursors.previous ? ( // Only show pagination if either cursor is available
                <div className="flex justify-center items-center">
                  <Pagination className="flex justify-center mt-1">
                    <PaginationContent className="flex items-center gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
                            !cursors.hasPreviousPage
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
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
                              : "cursor-pointer"
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
              title={translate("No_Products_Available")}
              description={translate("No_Products_Available_Description")}
            />
          )}
        </>
      )}
    </div>
  );
}
