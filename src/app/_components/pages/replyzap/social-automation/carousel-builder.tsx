"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IMediaTemplateCard } from "@/lib/web-api/replayzap";
import axios from "@/lib/web-api/axios";
import { ImageOff, Plus, Trash2 } from "lucide-react";

interface IProduct {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price?: number;
  vendor?: { business_name: string };
  collaboration?: {
    utmLink: string | null;
    couponCode: string;
    discountValue: number;
    discountType: string;
  };
}

interface ICarouselBuilderProps {
  cards: IMediaTemplateCard[];
  onChange: (cards: IMediaTemplateCard[]) => void;
}

export default function CarouselBuilder({
  cards,
  onChange,
}: ICarouselBuilderProps) {
  const translate = useTranslations();
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("/product/collaboration/creator/list?page=1&limit=100&status=ACTIVE");
      if (response.status === 200) {
        const collaborations = response.data?.data?.list || [];
        // Map collaborations to product format with collaboration details
        const mapped: IProduct[] = collaborations
          .filter((c: any) => c.productId && c.utmLink)
          .map((c: any) => ({
            _id: c.productId._id,
            title: c.productId.title ?? "",
            description: c.productId.description ?? "",
            media: Array.isArray(c.productId.media) ? c.productId.media : [],
            price: c.productId.price,
            vendor: c.vendorId ? { business_name: c.vendorId.business_name ?? "" } : undefined,
            // Default every collaboration field so a missing value from the
            // backend never propagates as `undefined` into ReplyZap's payload.
            collaboration: {
              utmLink: c.utmLink ?? null,
              couponCode: c.couponCode ?? "",
              discountValue: typeof c.commissionValue === "number" ? c.commissionValue : 0,
              discountType: c.commissionType ?? "",
            },
          }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error("[carousel-builder] failed to fetch collaborations:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addCard = () => {
    const newCard: IMediaTemplateCard = {
      id: cards.length + 1,
      imageUrl: "",
      headline: "{{product_name}}",
      description: "{{price}} - {{description}}",
      buttons: [{ id: 1, title: "Shop Now", url: "" }],
    };
    onChange([...cards, newCard]);
  };

  const removeCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index);
    onChange(updated.map((c, i) => ({ ...c, id: i + 1 })));
  };

  const updateCard = (
    index: number,
    field: keyof IMediaTemplateCard,
    value: any
  ) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updateButtonField = (
    cardIndex: number,
    btnIndex: number,
    field: "title" | "url",
    value: string
  ) => {
    const updated = [...cards];
    const buttons = [...updated[cardIndex].buttons];
    buttons[btnIndex] = { ...buttons[btnIndex], [field]: value };
    updated[cardIndex] = { ...updated[cardIndex], buttons };
    onChange(updated);
  };

  const handleProductSelect = (cardIndex: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const updated = [...cards];
    updated[cardIndex] = {
      ...updated[cardIndex],
      productId: product._id,
      imageUrl: product.media?.[0] || "",
      buttons: [
        {
          id: 1,
          title: updated[cardIndex].buttons[0]?.title || "Shop Now",
          url: product.collaboration?.utmLink || "",
        },
      ],
    };
    onChange(updated);
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-gray-light text-sm focus:outline-none focus:border-gray-light";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          {translate("Carousel_Cards")}
        </h4>
        <button
          type="button"
          onClick={addCard}
          className="flex items-center gap-1 text-sm text-primary-color hover:opacity-80"
        >
          <Plus size={16} />
          {translate("Add_Card")}
        </button>
      </div>

      {cards.map((card, index) => (
        <div
          key={card.id}
          className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              {translate("Card")} {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeCard(index)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Product Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-semibold">
              {translate("Select_Product")}
            </label>
            <select
              onChange={(e) => handleProductSelect(index, e.target.value)}
              className={`${inputClass} appearance-none bg-white`}
              value={card.productId || ""}
            >
              <option value="" disabled>
                {translate("Select_Product_Placeholder")}
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          {/* Image Preview */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-semibold">
              {translate("Image_URL")}
            </label>
            <div className="flex gap-2 items-start">
              <input
                type="text"
                value={card.imageUrl}
                onChange={(e) => updateCard(index, "imageUrl", e.target.value)}
                placeholder="https://..."
                className={`${inputClass} flex-1`}
              />
              {card.imageUrl ? (
                <img
                  src={card.imageUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover border shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg border bg-gray-100 flex items-center justify-center shrink-0">
                  <ImageOff size={16} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-semibold">
              {translate("Card_Headline")}
            </label>
            <input
              type="text"
              value={card.headline}
              onChange={(e) => updateCard(index, "headline", e.target.value)}
              placeholder="{{product_name}}"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-semibold">
              {translate("Card_Description")}
            </label>
            <input
              type="text"
              value={card.description}
              onChange={(e) => updateCard(index, "description", e.target.value)}
              placeholder="{{price}} - {{description}}"
              className={inputClass}
            />
          </div>

          {/* Button */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-semibold">
              {translate("Button")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={card.buttons[0]?.title || ""}
                onChange={(e) =>
                  updateButtonField(index, 0, "title", e.target.value)
                }
                placeholder={translate("Button_Text")}
                className={`${inputClass} w-1/3`}
              />
              <input
                type="text"
                value={card.buttons[0]?.url || ""}
                onChange={(e) =>
                  updateButtonField(index, 0, "url", e.target.value)
                }
                placeholder={translate("Button_URL_Placeholder")}
                className={`${inputClass} flex-1`}
                readOnly
              />
            </div>
            <p className="text-xs text-gray-400">
              {translate("UTM_Link_Auto")}
            </p>
          </div>
        </div>
      ))}

      {cards.length === 0 && (
        <button
          type="button"
          onClick={addCard}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-400 hover:border-primary-color hover:text-primary-color transition-all"
        >
          <Plus size={20} className="mx-auto mb-2" />
          {translate("Add_First_Card")}
        </button>
      )}
    </div>
  );
}
