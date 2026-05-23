"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCreatorStore } from "@/lib/store/creator";
import {
  getReplyZapSessionToken,
  getReplyZapAutomation,
  saveReplyZapAutomation,
  IAutomationData,
  IMediaTemplateCard,
} from "@/lib/web-api/replayzap";
import { toastMessage } from "@/lib/utils/toast-message";
import { getToken } from "@/lib/utils/commonUtils";
import BackButton from "../../../ui/back-button";
import Loader from "../../../components-common/layout/loader";
import CarouselBuilder from "./carousel-builder";
import CarouselPreview from "./carousel-preview";
import { Tag, X } from "lucide-react";

interface IAutomationFormProps {
  connectionId: string;
  mediaId: string;
}

function parseKeywords(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    // Postgres array literal e.g. {"nice","foo"} or {nice,foo}
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1);
      if (!inner) return [];
      const matches = inner.match(/"((?:[^"\\]|\\.)*)"|[^,]+/g) || [];
      return matches
        .map((m) => m.replace(/^"|"$/g, "").replace(/\\"/g, '"').trim())
        .filter(Boolean);
    }
    // Try JSON array
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    } catch {
      // fall through
    }
    return [trimmed];
  }
  return [];
}

const PRODUCT_VARIABLES = [
  { key: "{{product_name}}", label: "Product Name" },
  { key: "{{price}}", label: "Price" },
  { key: "{{description}}", label: "Description" },
  { key: "{{brand_name}}", label: "Brand Name" },
  { key: "{{coupon_code}}", label: "Coupon Code" },
  { key: "{{discount}}", label: "Discount" },
];

const KEYWORD_MAX_LENGTH = 100;
const KEYWORDS_MAX_COUNT = 50;

export default function AutomationForm({
  connectionId,
  mediaId,
}: IAutomationFormProps) {
  const translate = useTranslations();
  const { creator } = useCreatorStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [triggerType, setTriggerType] = useState<"all_comments" | "keywords">(
    "all_comments"
  );
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [commentReplyText, setCommentReplyText] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [sendOnce, setSendOnce] = useState(true);
  const [templateType, setTemplateType] = useState<"text" | "media">("text");
  const [carouselCards, setCarouselCards] = useState<IMediaTemplateCard[]>([]);
  const [endUserId, setEndUserId] = useState<string | null>(null);

  const fetchAutomation = useCallback(async () => {
    if (!creator?.creatorId) return;
    try {
      setLoading(true);
      const session = await getReplyZapSessionToken(creator.creatorId);
      setEndUserId(session.endUserId);
      const data = await getReplyZapAutomation(
        session.endUserId,
        connectionId,
        mediaId
      );
      if (data) {
        setEnabled(data.isCommentReplyEnabled);
        setTriggerType(
          (data.triggerType as "all_comments" | "keywords") || "all_comments"
        );
        setKeywords(parseKeywords(data.includeKeywords));
        setCommentReplyText(data.commentReplyText || "");
        setSendOnce(data.sendOnce);
        if (data.dmTemplate) {
          setTemplateType(data.dmTemplate.templateType || "text");
          setDmMessage(data.dmTemplate.text?.message || "");
          if (data.dmTemplate.mediaTemplates) {
            setCarouselCards(data.dmTemplate.mediaTemplates);
          }
        }
      }
    } catch {
      // No existing automation — use defaults
    } finally {
      setLoading(false);
    }
  }, [creator?.creatorId, connectionId, mediaId]);

  useEffect(() => {
    fetchAutomation();
  }, [fetchAutomation]);

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    e.preventDefault();

    if (trimmed.length > KEYWORD_MAX_LENGTH) {
      toastMessage.error(translate("Keyword_Too_Long"));
      return;
    }
    if (keywords.length >= KEYWORDS_MAX_COUNT) {
      toastMessage.error(translate("Too_Many_Keywords"));
      return;
    }
    if (!keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Returns an error message, or null when everything is valid. Centralising
  // this means we never accidentally fire a save with half-built data.
  const validate = (): string | null => {
    if (!enabled) return null; // disabled automation has no content rules

    if (triggerType === "keywords" && keywords.length === 0) {
      return translate("Keywords_Required");
    }

    if (templateType === "text") {
      if (!dmMessage.trim()) return translate("DM_Message_Required");
    }

    if (templateType === "media") {
      if (carouselCards.length === 0) {
        return translate("Carousel_At_Least_One_Card");
      }
      for (let i = 0; i < carouselCards.length; i++) {
        const card = carouselCards[i];
        if (!card.productId) {
          return translate("Card_Needs_Product", { index: i + 1 });
        }
        if (!card.imageUrl?.trim()) {
          return translate("Card_Needs_Image", { index: i + 1 });
        }
        if (!card.headline?.trim()) {
          return translate("Card_Needs_Headline", { index: i + 1 });
        }
        const btn = card.buttons?.[0];
        if (!btn?.title?.trim() || !btn?.url?.trim()) {
          return translate("Card_Needs_Button", { index: i + 1 });
        }
      }
    }

    return null;
  };

  const handleSave = async () => {
    // Race guard: ignore double-clicks while a save is in flight.
    if (saving) return;
    if (!endUserId) return;

    const validationError = validate();
    if (validationError) {
      toastMessage.error(validationError);
      return;
    }

    const automationData: IAutomationData = {
      isCommentReplyEnabled: enabled,
      triggerType,
      includeKeywords: triggerType === "keywords" ? keywords : undefined,
      commentReplyText: commentReplyText || undefined,
      sendOnce,
      dmTemplate:
        templateType === "media"
          ? {
              templateType: "media",
              mediaTemplates: carouselCards,
              text: dmMessage ? { message: dmMessage } : undefined,
            }
          : {
              templateType: "text",
              text: { message: dmMessage },
            },
    };

    try {
      setSaving(true);
      const token = getToken();
      await saveReplyZapAutomation(
        endUserId,
        connectionId,
        mediaId,
        automationData,
        token || undefined
      );
      toastMessage.success(translate("Automation_Saved"));
    } catch (err) {
      console.error("[automation-form] save failed:", err);
      toastMessage.error(translate("Automation_Save_Failed"));
    } finally {
      setSaving(false);
    }
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toastMessage.info(translate("Variable_Copied"));
  };

  if (loading) return <Loader fixed={false} />;

  return (
    <div className="p-4 rounded-lg flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Automation_Setup")}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Form */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Enable Toggle */}
          <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex items-center justify-between">
            <span className="text-sm font-medium">
              {translate("Enable_Automation")}
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  enabled ? "bg-primary-color" : "bg-gray-200"
                } after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  enabled ? "after:translate-x-full" : ""
                }`}
              />
            </label>
          </div>

          {enabled && (
            <>
              {/* Trigger Type */}
              <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex flex-col gap-4">
                <h3 className="text-sm font-medium">
                  {translate("Trigger_Type")}
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="triggerType"
                      checked={triggerType === "all_comments"}
                      onChange={() => setTriggerType("all_comments")}
                      className="w-4 h-4 accent-primary-color"
                    />
                    <span className="text-sm">
                      {translate("All_Comments")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="triggerType"
                      checked={triggerType === "keywords"}
                      onChange={() => setTriggerType("keywords")}
                      className="w-4 h-4 accent-primary-color"
                    />
                    <span className="text-sm">
                      {translate("Specific_Keywords")}
                    </span>
                  </label>
                </div>

                {/* Keywords Input */}
                {triggerType === "keywords" && (
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Tag
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={addKeyword}
                        maxLength={KEYWORD_MAX_LENGTH}
                        placeholder={translate("Add_Keyword_Placeholder")}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-light text-sm focus:outline-none focus:border-gray-light"
                      />
                    </div>
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-gray-darken text-white py-1 px-3 rounded-full flex items-center gap-2 text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(index)}
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Reply */}
              <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex flex-col gap-3">
                <h3 className="text-sm font-medium">
                  {translate("Comment_Reply_Text")}
                </h3>
                <input
                  type="text"
                  value={commentReplyText}
                  onChange={(e) => setCommentReplyText(e.target.value)}
                  placeholder={translate("Comment_Reply_Placeholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-light text-sm focus:outline-none focus:border-gray-light"
                />
              </div>

              {/* DM Template Type */}
              <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex flex-col gap-4">
                <h3 className="text-sm font-medium">
                  {translate("DM_Template")}
                </h3>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTemplateType("text")}
                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                      templateType === "text"
                        ? "bg-primary-color text-white border-primary-color"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {translate("Text_Message")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateType("media")}
                    className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                      templateType === "media"
                        ? "bg-primary-color text-white border-primary-color"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {translate("Product_Carousel")}
                  </button>
                </div>

                {/* DM Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500 font-semibold">
                    {translate("DM_Message")}
                  </label>
                  <textarea
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    placeholder={translate("DM_Message_Placeholder")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-light text-sm focus:outline-none focus:border-gray-light resize-none"
                  />
                </div>

                {/* Product Variables */}
                {templateType === "media" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500 font-semibold">
                      {translate("Available_Variables")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_VARIABLES.map((v) => (
                        <button
                          key={v.key}
                          type="button"
                          onClick={() => copyVariable(v.key)}
                          className="text-xs px-3 py-1.5 rounded-full border border-dashed border-primary-color text-primary-color hover:bg-pink-50 transition-all"
                          title={`Click to copy ${v.key}`}
                        >
                          {v.key}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {translate("Variables_Help")}
                    </p>
                  </div>
                )}

                {/* Carousel Builder */}
                {templateType === "media" && (
                  <CarouselBuilder
                    cards={carouselCards}
                    onChange={setCarouselCards}
                  />
                )}
              </div>

              {/* Send Once Toggle */}
              <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {translate("Send_Once")}
                </span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={sendOnce}
                    onChange={(e) => setSendOnce(e.target.checked)}
                  />
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      sendOnce ? "bg-primary-color" : "bg-gray-200"
                    } after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      sendOnce ? "after:translate-x-full" : ""
                    }`}
                  />
                </label>
              </div>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 text-sm bg-primary-color text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving
              ? translate("Saving")
              : translate("Save_Automation")}
          </button>
        </div>

        {/* Right - Live Preview */}
        {enabled && templateType === "media" && carouselCards.length > 0 && (
          <div className="lg:w-[380px] shrink-0">
            <div className="sticky top-4">
              <CarouselPreview cards={carouselCards} dmMessage={dmMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
