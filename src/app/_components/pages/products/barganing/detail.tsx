import { translate } from "@/lib/utils/translate";
import { IProduct } from "../viewProduct/viewDetailProduct";

export default function BargainingDetailView({productData}:{productData:IProduct}) {
  const images = [
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
    "/assets/product/diamondRing.webp",
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <p className="text-text font-medium text-sm">Product Image</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3 overflow-auto max-h-[210px] pr-2">
            {productData?.images?.length > 0 &&
              productData?.images.map((img, index) => (
                <div
                  key={index}
                  className="border border-border rounded-2xl p-2"
                >
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={200}
                    height={185}
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <p className="text-text font-medium text-sm">General Information</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Name")}
            </label>
            <input
              name="product_name"
              className="p-2 border text-sm rounded-md w-full"
              value={productData?.name}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Category")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.category}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Tags")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.tags?.join(", ")}
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-font-grey">
            {translate("Description")}
          </label>
          <textarea
            rows={4}
            className="p-2 text-sm border rounded-md w-full"
            value={productData?.description}
            disabled
          />
        </div>
        <div className="flex h-[45%] flex-col w-full items-start gap-3">
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]">Base Price:</span>{" "}
              <span className="text-lg font-normal text-text">${productData?.price}</span>
            </p>

            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="text-lg font-normal text-text">No discount</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="text-lg font-normal text-text">0</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Tax Class: </span>{" "}
              <span className="text-lg font-normal text-text">Tax Free</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> VAT Amount: </span>{" "}
              <span className="text-lg font-normal text-text">12%</span>
            </p>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Variation: </span>{" "}
              <span className="text-lg font-normal text-text">Rose Gold</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Variation Type: </span>{" "}
              <span className="text-lg font-normal text-text">Color</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
