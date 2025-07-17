"use client";
import { useEffect, useState } from "react";
import {
  useParams,
} from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Heart, ShoppingCart,IndianRupee } from "lucide-react";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import Link from "next/link";
import { RiLoader3Fill } from "react-icons/ri";
import LoginDialog from "@/app/_components/components-common/dialogs/login";
import { toastMessage } from "@/lib/utils/toast-message";
import Loader from "@/app/_components/components-common/layout/loader";
import TrendingProductCard from "@/app/_components/components-common/product/trending.product-card";

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
  channelProductId: string;
  sku: string;
  description: string;
  media: string[];
  price: number;
  channelName: string;
  category: ICategory[];
  subCategory: string[];
  tags: string[];
  lifeTime: boolean;
  startDate: string; // ISO date string
  endDate: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  commission: number;
  commission_type: "PERCENTAGE" | "FLAT" | string;
  referenceLinks: string[];
  creatorMaterial: string[]; // can contain both images and videos
  videoType: string[];
  channels: string[];
  createdAt: string;
  updatedAt: string;
  crmLink?: string;
  channelProductVendor?: string;
  variants: any[];
  vendorId: string;
  freeProduct: boolean;
  notes: string;
  categories?: string;
  subCategories?: string;
  tag?: string;
  productType?: string;
  utmLink: string;
  isWishListed: boolean;
  discountType?: string;
  discount?: number;
}

export interface IRequest {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  requestFrom: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  requestId: IRequest;
}

const statusText: { [key: string]: string } = {
  REQUESTED: "Requested",
  REJECTED: "Rejected",
  PENDING: "Start Bargaining",
  LIVE: "Live",
  EXPIRED: "Expired",
  "": "Send_Request",
};

const buttonColor: { [key: string]: string } = {
  LIVE: "bg-[#098228] text-[#098228]",
  REQUESTED: "bg-[#FF9500] text-[#FF9500]",
  EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
  REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
  PENDING: "bg-[#000] text-[#FFF]",
  "": "bg-[#000] text-[#FFF]",
};
type ViewProductDetailProps = {
  isFromPublic?: boolean;
};
export default function ViewProductDetail({
  isFromPublic,
}: ViewProductDetailProps) {
  const translate = useTranslations();
  const { account } = useAuthStore();
  const params = useParams();
  const productId = params?.productId;
  const [notFounded, setNotFounded] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [loginPopUp, setLoginPopUp] = useState<boolean>(false);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [trendingProductList, setTrendingProductList] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 6;
  const [productData, setProductData] = useState<IProduct>({
    variants: [],
    _id: "",
    title: "",
    channelProductId: "",
    vendorId: "",
    sku: "",
    description: "",
    media: [],
    price: 0,
    channelName: "",
    category: [],
    subCategory: [],
    tags: [],
    lifeTime: false,
    startDate: "",
    endDate: null,
    freeProduct: false,
    status: "",
    commission: 0,
    commission_type: "",
    referenceLinks: [],
    creatorMaterial: [],
    videoType: [],
    channels: [],
    notes: "",
    createdAt: "",
    updatedAt: "",
    utmLink: "",
    isWishListed: false,
  });
  const [selectedVariant, setSelectedVariant] = useState({
    title: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProductById = async (isLoader: boolean = true) => {
    isLoader && setLoading(true);
    try {
      const response = await axios.get(
        `/auth/creator-store/product/${productId}`
      );
      const product: any = response?.data?.data;
      if (product) {
        setProductData(product);
        setSelectedVariant(
          product?.variants?.length > 0
            ? product?.variants[0]
            : { title: "", price: "" }
        );
      }
    } catch (error: any) {
      // toast.error(error?.message || "Product Fetch Failed.");
      setNotFounded(true);
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };
  const addToWishlist = async () => {
    setLoader(true);
    try {
      if (account?.id) {
        const payload = {
          collaborationId: productId,
          userId: account?.id,
        };
        const response = await axios.post(
          `/product/wishlist/add-remove`,
          payload
        );
        if (response?.status === 200) {
          toastMessage.success(response?.data?.message);
          fetchProductById(false);
        }
      } else {
        setLoginPopUp(true);
        setLoader(false);
      }
    } catch (error: any) {
      // toast.error(error?.message || "Product Fetch Failed.");
    }
  };

  const fetchTrendingProductsList = async (
    page: number = currentPage,
    isInternalLoader: boolean = false,
    searchValue: string = "",
    categoryIds: string[] = []
  ) => {
    isInternalLoader ? setInternalLoading(true) : setLoading(true);
    try {
      const response = await axios.get(
        `/auth/creator-store/trending-suggested-product-list?limit=${pageLimit}&page=${page}&collaborationId=${productId}`
      );

      if (response.data.data?.list?.length > 0) {
        setTrendingProductList(
          response.data.data?.list.map((product: any) => {
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
        // setTotalPages(Math.ceil(response.data.data?.count / pageLimit));
        // setCurrentPage(page);
      }
      setLoading(false);
      setInternalLoading(false);
    } catch (error) {
      setLoading(false);
      //   setTrendingProductList([]);
      // setTotalPages(0);
      setCurrentPage(1);
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductById();
      fetchTrendingProductsList();
    }
  }, [productId]);
  // Product id required condition removed as it is not required.
  if (notFounded) {
    return (
      <div className="grid grid-cols-1 h-screen p-4">
        <EmptyPlaceHolder title={translate("Collaboration_Not_Found")} />
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loading className="h-screen" />
      ) : (
        <div className="flex flex-col  w-full p-3 md:p-6 gap-4 h-[100vh]">
          {/* Card Section */}
          <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-6 gap-4 md:mx-auto">
            <div className="col-span-2">
              <div className="flex bg-white p-2 rounded-xl shadow-md">
                {/* Left Thumbnails */}
                <div
                  className={`flex flex-col gap-2 overflow-y-auto max-h-[400px] ${
                    productData?.media?.length > 1 && "pr-2"
                  }`}
                >
                  {productData?.media?.length > 1 &&
                    [...productData?.media].map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`cursor-pointer border hover:border-gray-400 rounded-md p-1 w-[100px] h-[100px] overflow-hidden ${
                          selectedImage === index
                            ? "border-black"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          loader={({ src }) => src}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          width={60}
                          height={60}
                          className="rounded w-[100px] h-[100px] object-contain"
                        />
                      </div>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 flex items-center justify-center">
                  <Image
                    loader={({ src }) => src}
                    src={
                      productData?.media?.length > 0
                        ? productData?.media[selectedImage]
                        : "/assets/product/image-square.svg"
                    }
                    alt="Main Preview"
                    width={400}
                    height={400}
                    className="rounded-xl md:max-h-[500px] max-h-[400px] object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <div className="w-full p-4 bg-white rounded-xl shadow border space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    {productData?.channelProductVendor}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {productData?.title}
                  </h2>
                  {productData?.description && (
                    <p className="text-gray-500 text-xs">
                      {productData?.description}
                    </p>
                  )}
                </div>
                <div className="">
                  <div className="flex items-center gap-2 ">
                    <span className="flex items-center text-xl font-bold">
                      {productData?.discountType === "FIXED_AMOUNT" ? <IndianRupee className="size-[14] sm:size-[16] md:size-[18]" />:""}
                      {selectedVariant?.price
                        ? selectedVariant?.price
                        : productData?.price}
                    </span>
                    <span className="flex items-center text-green-600 text-sm font-semibold">{productData?.discountType === "FIXED_AMOUNT" ? <IndianRupee className="size-[12] sm:size-[14] md:size-[14]" />:""}{`${
                      productData?.discount
                    }${
                      productData?.discountType === "PERCENTAGE" ? "%" : ""
                    } off`}</span>
                  </div>
                </div>
                {productData.category?.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {translate("Category")}
                    </p>
                    <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
                      {productData.category.map((category, idx) => (
                        <span
                          key={idx}
                          className="sm:text-base text-sm  font-medium text-gray-700 flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-muted-foreground"
                        >
                          {category?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productData.tags?.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {translate("Tags")}
                    </p>
                    <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
                      {productData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-background py-1 px-2 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {productData?.variants?.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                      {translate("Variants")}
                    </h3>
                    <div className="flex gap-3 sm:text-sm text-xs text-gray-700">
                      {productData?.variants?.length > 0 &&
                        productData?.variants?.map((variant: any, index) => (
                          <span
                            key={index}
                            className={`${
                              selectedVariant?.title === variant?.title
                                ? "bg-gray-darken text-white"
                                : "border bg-white text-black"
                            } py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 hover:text-white transition-colors`}
                            onClick={() =>
                              setSelectedVariant({
                                title: variant?.title,
                                price: variant?.price,
                              })
                            }
                          >
                            {variant?.title}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={addToWishlist}
                    className="flex items-center w-full justify-center group gap-1 mt-2 px-4 py-3 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                  >
                    {loader ? (
                      <RiLoader3Fill className="absolute animate-spin duration-300 text-xl" />
                    ) : productData?.isWishListed ? (
                      <span
                        className={`flex gap-2 items-center  ${
                          loader ? "opacity-0" : ""
                        }`}
                      >
                        <Heart
                          className="fill-primary group-hover:fill-white"
                          size={15}
                        />{" "}
                        {translate("Remove_from_Wishlist")}
                      </span>
                    ) : (
                      <>
                        <Heart size={15} /> {translate("Add_to_Wishlist")}
                      </>
                    )}
                  </button>
                  <Link
                    href={productData?.utmLink}
                    className="flex items-center w-full justify-center gap-1 mt-2 px-4 py-3 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                    target={"_blank"}
                  >
                    <ShoppingCart size={15} /> {translate("Shop_Now")}{" "}
                  </Link>
                </div>
                <div className=" border-t text-sm pt-4 text-gray-800">
                  <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                    {translate("Product_Details")}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      [
                        translate("Brand"),
                        productData?.channelProductVendor ?? "-",
                      ],
                      [
                        translate("Product_Type"),
                        productData?.productType ?? "-",
                      ],
                      [translate("Model_Name"), selectedVariant?.title ?? "-"],
                      [
                        translate("Category"),
                        <div className="flex space-x-2">
                          {productData.category?.length > 0
                            ? productData.category.map((category, idx) => (
                                <span
                                  key={idx}
                                  className="text-sm  font-medium text-gray-700 flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground border border-muted-foreground"
                                >
                                  {category?.name}
                                </span>
                              ))
                            : "-"}
                        </div>,
                      ],
                      [
                        translate("Tags"),
                        <div className="flex space-x-2">
                          {productData.tags?.length > 0
                            ? productData.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-background py-1 px-2 rounded"
                                >
                                  #{tag}
                                </span>
                              ))
                            : "-"}
                        </div>,
                      ],
                    ].map(([label, value], index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-48 text-gray-500 capitalize">
                          {label}:
                        </span>
                        <span className="text-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {productData?.description && (
                  <div className=" border-t text-sm pt-4 text-gray-800">
                    <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
                      {translate("Information")}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {[
                        [
                          translate("Description"),
                          <p>{productData?.description}</p>,
                        ],
                      ].map(([label, value], index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-48 text-gray-500 capitalize">
                            {label}:
                          </span>
                          <span className="text-black">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {internalLoading && <Loader />}
            {trendingProductList?.length > 0 && (
              <div className="col-span-6 bg-white p-5 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">
                  {translate("Trending_Products")}
                </h3>
                <div
                  className={`grid grid-cols-2 sm:grid-cols-4 ${
                    trendingProductList?.length > 10 && "animate-marquee"
                  } md:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-7 whitespace-nowrap gap-2 py-2 text-sm font-medium px-1 md:px-2`}
                >
                  {[...trendingProductList].map((item: any) => (
                    <div key={item?._id} className="flex h-full w-full">
                      <TrendingProductCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {loginPopUp && (
        <LoginDialog
          title={"Login_Required"}
          description="Login_Required_Description"
          onClose={() => setLoginPopUp(false)}
        />
      )}
    </>
  );
}
