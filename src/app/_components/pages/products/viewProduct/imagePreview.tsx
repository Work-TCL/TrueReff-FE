"use client";

import Image from "next/image";
interface ProductImageGalleryProps {
  images: string[];
}
export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white border-0 border-r rounded-0 w-full">
      <div className="grid grid-cols-1 gap-3">
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
              <div key={index} className="border border-border rounded-2xl p-2">
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
  );
}
