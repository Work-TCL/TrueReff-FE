"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import Loader from "@/app/_components/components-common/layout/loader";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import ProductCard from "@/app/_components/components-common/product/product-card";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface ICategory {
    _id: string;
    name: string;
    parentId: string | null;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
}

export interface IVariant {
    sku: string;
    price: string; // Price as a string
    title: string;
}

export interface IProduct {
    _id: string;
    title: string;
    channelProductId: string;
    channelProductVendor: string;
    vendorId: string;
    sku: string;
    description: string;
    media: string[]; // Array of image/video URLs
    price: number; // Price as a number
    channelName: string;
    variants: IVariant[]; // Array of product variants
    category: ICategory; // Category object
    subCategory: string[]; // Array of sub-category IDs
    tags: string[]; // Array of tags
    lifeTime: boolean;
    startDate: string | null; // ISO date string or null
    endDate: string | null; // ISO date string or null
    freeProduct: boolean;
    status: string; // e.g., "ACTIVE"
    commission: number; // Commission value
    commission_type: "PERCENTAGE" | "FIXED_AMOUNT"; // Commission type
    referenceLinks: string[]; // Array of reference links
    creatorMaterial: string[]; // Array of creator materials
    videoType: string[]; // Array of video types
    channels: string[]; // Array of channel names
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface IProducts {
    _id: string;
    utmLink: string; // UTM link for tracking
    crmLink: string; // CRM link for product details
    product: IProduct; // Product object
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

export default function ProductList({ category, setActiveCategoryTabId }: { category: ICategory, setActiveCategoryTabId: (value: string) => void; }) {
    const translate = useTranslations();
    const [loading, setLoading] = useState<boolean>(true);
    const [internalLoading, setInternalLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<IProducts[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 20;
    let sliderRef = useRef<any>(null);
    const next = () => {
        // @ts-ignore
        sliderRef && sliderRef?.slickNext();
    };
    const previous = () => {
        // @ts-ignore
        sliderRef && sliderRef?.slickPrev();
    };
    var settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: false,
        pauseOnHover: true,
        centerMode: false,
        variableWidth: false,
        responsive: [
            {
                breakpoint: 1442,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // Update fetProductsList to set both cursors
    const fetProductsList = async (
        page: number = currentPage,
        isInternalLoader: boolean = false
    ) => {
        isInternalLoader ? setInternalLoading(false) : setLoading(true);
        try {
            const response = await axios.get(
                `/product/all?limit=${pageLimit}&page=${page}&category=${category?._id}`
            );

            if (response.data.data?.list?.length > 0) {
                const productData = response.data.data?.list.map((product: any) => {
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
                setProductList([...productData]);
                setCurrentPage(page);
            }
            setLoading(false);
            setInternalLoading(false);
        } catch (error) {
            setLoading(false);
            setProductList([]);
            setCurrentPage(1);
            setInternalLoading(false);
        }
    };

    // Update useEffect to fetch the initial product list
    useEffect(() => {
        if (category) {
            fetProductsList(currentPage);
        }
    }, [category]);

    // Update the onClick handlers for pagination buttons
    const handlePageChange = (page: number) => {
        page !== currentPage &&
            fetProductsList(page, true);
    };


    return (
        <div className="bg-white p-2 md:p-4 rounded-[20PX] flex flex-col gap-3 h-full w-full">
            {loading ? (
                <div className="h-[300px]"><Loading height="fit" /></div>
            ) : (
                <>
                    {internalLoading && <Loader />}
                    {productList?.length > 0 ? (
                        <div className="flex flex-col h-full overflow-auto gap-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{category?.name} {translate("Products")}</h3>
                                <button
                                    onClick={() => setActiveCategoryTabId(category?._id)}
                                    className="whitespace-nowrap  border border-secondary bg-white text-secondary hover:bg-secondary hover:text-white rounded-md transition-all sm:py-2 py-1 sm:px-[10px] px-1 text-xs sm:text-sm"
                                >
                                    {translate("View_Collection")}
                                </button>
                            </div>
                            <div className={`slider-wrapper relative ${productList?.length > 6 ? "mx-4" : ""}`}>
                                <Slider
                                    ref={(slider) => {
                                        // @ts-ignore
                                        sliderRef = slider;
                                    }}
                                    {...settings}
                                >
                                    {productList.map((item: any) => (
                                        <div key={item?._id} className="flex px-2 h-full w-full">
                                            <ProductCard
                                                item={item?.product}
                                                id={item?._id}
                                                isWishListed={item?.isWishListed}
                                                refreshData={() => fetProductsList(currentPage,true)}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                               {productList?.length > 6 && <> <button
                                    className="button absolute left-[-14px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
                                    onClick={previous}
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    className="button absolute right-[-14px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
                                    onClick={next}
                                >
                                    <ChevronRight />
                                </button></>}</div>
                        </div>
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
