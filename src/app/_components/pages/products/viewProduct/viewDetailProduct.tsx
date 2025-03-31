"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "./imagePreview";
import { ProductInfo } from "./productDetail";

//  Define Form Schema with Zod
const productSchema = Yup.object({
  productName: Yup.string(),
  category: Yup.string(),
  tags: Yup.string(),
  price: Yup.number(),
  discountType: Yup.string(),
  discountPercentage: Yup.number(),
  taxClass: Yup.string(),
  vatAmount: Yup.number(),
  variationType: Yup.string(),
  variation: Yup.string(),
});

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

export default function ViewProductDetail() {
  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "Tiffany Diamond Ring",
      category: "Jewelry",
      tags: "Elegant, Timeless",
      price: 400,
      discountType: "No discount",
      discountPercentage: 0,
      taxClass: "Tax Free",
      vatAmount: 12,
      variationType: "Color",
      variation: "Rose Gold",
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col w-full p-6 gap-6">
        {/* Breadcrumb and Button */}
        <div className="flex justify-between items-center">
          <p className="gray-color text-lg">
            Product List &gt; <span className="text">View product</span>
          </p>
          <Button variant="secondary" className="text-white">
            Start Bargaining
          </Button>
        </div>

        {/* Card Section */}
        <Card className="bg-white rounded-lg overflow-auto" >
          <CardContent >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductImageGallery images={images} />
              <ProductInfo />
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
