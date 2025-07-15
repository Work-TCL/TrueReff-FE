"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  getAnalyticsCreatorsSearch,
  getAnalyticsVendorsSearch,
} from "@/lib/web-api/analytics"; // Adjust path
import {
  IAnalyticsBrandData,
  IAnalyticsCreatorData,
  IAnalyticsProductData,
} from "../../pages/creator_analysis/_components/types";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  HandleSearchBrand,
  HandleSearchCreator,
  HandleSearchProduct,
} from "../../pages/creator_analysis";

export const SearchSuggestionDropdown = () => {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<IAnalyticsBrandData[]>([]);
  const [creators, setCreators] = useState<IAnalyticsCreatorData[]>([]);
  const [products, setProducts] = useState<IAnalyticsProductData[]>([]);
  const pathName = usePathname();
  const mode = pathName === "/creator/creator-analysis" ? "creator" : "vendor";
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      await fetchSearchList(value);
    }, 500),
    [mode]
  );

  // Search input change
  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setCreators([]);
      setBrands([]);
      setProducts([]);
      return;
    }

    debouncedSearch(value);
  };

  // API call logic
  const fetchSearchList = async (value: string) => {
    setIsLoading(true);
    try {
      if (mode === "creator") {
        const res = await getAnalyticsCreatorsSearch(value);
        setBrands(Array.isArray(res?.vendorList) ? res.vendorList : []);
        setProducts(Array.isArray(res?.productList) ? res.productList : []);
      }
      if (mode === "vendor") {
        const res = await getAnalyticsVendorsSearch(value);
        setCreators(Array.isArray(res?.creatorList) ? res.creatorList : []);
        setProducts(Array.isArray(res?.productList) ? res.productList : []);
      }
    } catch (error) {
      console.error("Error while searching:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetDropdown = (text: string = "") => {
    setSearch(text);
    setBrands([]);
    setCreators([]);
    setProducts([]);
  };

  const onSelectBrand = (brand: IAnalyticsBrandData) => {
    resetDropdown(brand.business_name);
    HandleSearchBrand.next(brand);
  };
  const onSelectCreator = (creator: IAnalyticsCreatorData) => {
    resetDropdown(creator.name);
    HandleSearchCreator.next(creator);
  };
  const onSelectProduct = (product: IAnalyticsProductData) => {
    resetDropdown(product.title);
    HandleSearchProduct.next(product);
  };

  const showDropdown =
    brands.length > 0 || creators.length > 0 || products.length > 0;

  return (
    <div
      className="md:max-w-[350px] sm:max-w-full max-w-xs flex flex-col w-full gap-4 relative 
  transition-all duration-300 ease-in-out sm:h-fit h-[2rem]"
    >
      {/* Search Input */}
      <div className="w-full rounded-xl bg-[#F2F4F5] flex items-center gap-2 px-4">
        <Search className="text-[#7E7E80] font-thin sm:text-base" />
        <input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={
            mode === "creator"
              ? `${t("Search_Brand_Product")}...`
              : `${t("Search_Creator_Product")}...`
          }
          className="w-full py-2 rounded-xl bg-[#F2F4F5] placeholder:text-[#7E7E80] placeholder:text-sm focus-visible:outline-1 focus-visible:outline-none text-sm text-ellipsis"
        />
        {search && (
          <X
            className="text-[#7E7E80] font-thin cursor-pointer"
            onClick={() => resetDropdown("")}
          />
        )}
      </div>

      {/* Results Dropdown */}
      {(showDropdown || isLoading) && (
        <div className="absolute top-full mt-2 bg-white shadow-md rounded-xl w-full z-50 max-h-80 overflow-y-auto p-2 flex flex-col gap-2">
          {isLoading && (
            <div className="text-sm text-gray-500 px-2 py-1">Loading...</div>
          )}

          {creators.map((creator, index) => (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => onSelectCreator(creator)}
            >
              <img
                src={
                  creator?.profile_image || "/assets/product/image-square.svg"
                }
                alt={creator?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-black">{creator?.name}</span>
            </div>
          ))}

          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => onSelectBrand(brand)}
            >
              <img
                src={brand?.profile_image || "/assets/product/image-square.svg"}
                alt={brand?.business_name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-black">{brand?.business_name}</span>
            </div>
          ))}

          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => onSelectProduct(product)}
            >
              <img
                src={product?.media?.[0] || "/assets/product/image-square.svg"}
                alt={product?.title}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-black">{product?.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
