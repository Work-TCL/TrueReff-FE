"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
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
import ChannelBar from "./chaneelBar";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import { toastMessage } from "@/lib/utils/toast-message";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";

export interface IProduct {
  id: number;
  name: string;
  handle: string;
  category: string;
  sub_category: string;
  price: string;
  main_image: string;
  total_variants: number;
  status: string;
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
  const [activeChannelTabId, setActiveChannelTabId] = useState("");
  const [channels, setChannels] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20;
  const translate = useTranslations();

  // Fetch Chanel list
  useEffect(() => {
    startTransition(async () => {
      const res: any[] = await getConnectedChannelsList();
      if (Array.isArray(res)) {
        setChannels(res);
        setActiveChannelTabId(res?.[0]?.channelType);
      }
    });
  }, []);

  // Update fetProductsList to set both cursors
  const fetProductsList = async (
    page: number = 1,
    isInternalLoader = false,
    searchValue: string = ""
  ) => {
    isInternalLoader ? setInternalLoader(true) : setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product/list?limit=${pageSize}&page=${page}${searchValue ? `&search=${searchValue}` : ""}`
      );
      if (response?.data?.data?.list?.length > 0) {
        const dataCount = response.data.data.count;
        setProductList(response.data.data.list);
        setCurrentPage(page);
        setTotalPages(Math.ceil(dataCount / pageSize));  
      }
      setLoading(false);
      setInternalLoader(false);
    } catch (error) {
      setLoading(false);
      setInternalLoader(false);
      setCurrentPage(1);
      setTotalPages(0);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    fetProductsList(1);
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetProductsList(1, true, value);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };
  const handlePageChange = (page: number) => {
    page !== currentPage &&
    fetProductsList(page, true, search);
  };

  const handleOnCheckExists = async (productId: number) => {
    setInternalLoader(true);
    try {
      const response = await axios.post(
        `/product/vendor-product/check-existing-product`, { productId: productId }
      );
      if (response?.status === 200) {
        router?.push(
          `/vendor/campaign/product/add?productId=${productId}`
        )
      }
      // setPlusLoading(false);
    } catch (error: any) {
      if (error?.status === 409) {
        toastMessage.info("Product already exists in the platform")
      }
      setInternalLoader(false);
    }
  }

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "id",
      header: () => translate("Product_ID"),
      cell: ({ row }) => {
        const product = row.original;
        return product.id;
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
            onClick={() =>
              router.push(
                `channel-products/view?id=${product.id}&channelName=${activeChannelTabId} `
              )
            }
          >
            {product.main_image ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={product.main_image} />
              </Avatar>
            ) : (
              <ImageOff className="w-6 h-6 text-gray-400" />
            )}
            <TruncateWithToolTip
              checkHorizontalOverflow={false}
              linesToClamp={2}
              text={product.name ?? ""}
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
      accessorKey: "sub_category",
      header: () => translate("Sub_Category"),
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={row.original.sub_category ?? ""}
        />
      ),
    },
    {
      accessorKey: "total_variants",
      header: () => translate("Variants"),
    },
    {
      accessorKey: "price",
      header: () => <>Selling {translate("Price")}</>,
      cell: ({ row }) => (
        <TruncateWithToolTip
          checkHorizontalOverflow={false}
          linesToClamp={2}
          text={`₹ ${row.original.price ?? ""}`}
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
              onClick={() =>
                handleOnCheckExists(product.id)
              }
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
          <ChannelBar
            channels={channels}
            activeChannelTabId={activeChannelTabId}
            setActiveChannelTabId={setActiveChannelTabId}
          />
          {/* <div className="flex justify-between items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_Product")}
              // className="p-3 rounded-lg bg-white pl-10  w-full gray-color" // Add padding to the left for the icon
            />
          </div> */}
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
                    image: currentData.main_image,
                    title: currentData.name,
                    category: currentData.category,
                    tags: [],
                    sku: "",
                    price: currentData.price,
                  }}
                  onClose={(refresh = false) => {
                    setCurrentData(null);
                    if (refresh) {
                      fetProductsList(currentPage, true,search);
                    }
                  }}
                />
              )}
              {/* Pagination */}
              <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
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
