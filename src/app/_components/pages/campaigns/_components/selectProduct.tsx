"use client";
import Loader from "@/app/_components/components-common/layout/loader";
import { IProduct } from "@/lib/types-api/vendor";
import { getProductLists } from "@/lib/web-api/vendor";
import React, { useState, useEffect, useRef } from "react";

type ProductSelectDropdownProps = {
  onSelect?: (product: IProduct) => void;
  selectedProduct: IProduct | null;
};

const LIMIT: number = 20;

const ProductSelectDropdown: React.FC<ProductSelectDropdownProps> = ({
  onSelect,
  selectedProduct,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(0);
  const [nextStart, setNexStart] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<IProduct[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleSelect = (product: IProduct) => {
    onSelect?.(product);
    setIsOpen(false);
  };

  const handleLoadProducts = async () => {
    setLoading(true);
    try {
      const response: any = await getProductLists({
        start: limit,
        limit: LIMIT,
      });
      setNexStart(Boolean(response?.count > limit && response?.count > LIMIT));
      setVisibleProducts(visibleProducts.concat(response.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error while load products", error);
    } finally {
    }
  };
  const handleScroll = () => {
    const container = dropdownRef.current;
    if (
      !isLoading &&
      nextStart &&
      container &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10
    ) {
      setLimit((prev) => prev + LIMIT);
      handleLoadProducts();
    }
  };

  useEffect(() => {
    setLimit(0);
  }, [search]);

  useEffect(() => {
    handleLoadProducts();
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full border px-4 py-2 rounded-lg text-left bg-white shadow-sm hover:border-gray-400"
      >
        {!selectedProduct ? (
          "Select a product"
        ) : (
          <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
            <img
              src={selectedProduct?.media[0]}
              alt={selectedProduct?.title}
              className="w-12 h-12 rounded mr-3"
            />
            <span>{selectedProduct?.title}</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={handleSearch}
              className="w-full p-3 placeholder:pl-3 pl-5 border rounded-full outline-none"
            />
          </div>
          <div
            ref={dropdownRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto"
          >
            {visibleProducts.map((product, i) => (
              <div
                key={`${i}-${product._id}`}
                onClick={() => handleSelect(product)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={product.media[0]}
                  alt={product.title}
                  className="w-12 h-12 rounded mr-3"
                />
                <span>{product.title}</span>
              </div>
            ))}
            {(isLoading || nextStart) && (
              <div className="flex items-center justify-center p-2 hover:bg-gray-100 cursor-pointer relative">
                {isLoading && <Loader fixed={false} small={true} />}
              </div>
            )}
            {visibleProducts.length === 0 && (
              <div className="p-6 text-gray-500 text-sm text-center">
                No products found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelectDropdown;
