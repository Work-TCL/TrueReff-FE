"use client";
interface ProductImageGalleryProps {
  images: string[];
}
export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  return (
    <div className="flex flex-col col-span-3 md:col-span-1 gap-3 md:gap-6 p-1 md:p-6 bg-white border-0 md:border-r rounded-0 w-full">
      <div className="grid grid-cols-1 gap-2 md:gap-3">
        {images?.length > 0 && (
          <div
            key={images[0]}
            className="border border-border rounded-2xl p-2 max-h-[303px]"
          >
            <img
              src={images[0]}
              alt="Main product"
              width={620}
              height={303}
              className="rounded-md object-contain w-full h-full"
            />
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-auto max-h-[230px]">
          {images?.length > 1 &&
            images.slice(1).map((img, index) => (
              <div
                key={index}
                className="flex justify-center items-center border border-border rounded-2xl p-2"
              >
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  className="rounded-md object-contain w-[200px] h-[185px] product-img"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
