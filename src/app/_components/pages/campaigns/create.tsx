"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { translate } from "../../../../lib/utils/translate";

interface IAddProductDetailProps {
  isDetailView?: boolean;
}
export default function CreateCampaign(props: IAddProductDetailProps) {
  let { isDetailView } = props;
  const [variants, setVariants] = useState([
    { variationType: "", variation: "" },
  ]);
  const handleAddVariant = () => {
    setVariants([...variants, { variationType: "", variation: "" }]);
  };
  const handleDelete = (ind: number) => {
    setVariants([...variants.filter((ele, index) => index !== ind)]);
  };
  return (
    <div className="flex flex-col gap-5 h-full px-4 py-3">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="md:text-[20px] text-base text-500">
          {translate("Campaign_Details_Form")}
        </div>
        <div className="flex gap-[10px]">
          <Button
            variant="outline"
            className="md:w-[140px] rounded-[12px] md:h-10 h-8 md:text-[20px] text-xs "
          >
            {translate("Cancel")}
          </Button>
          <Button
            variant="secondary"
            className="text-white md:w-[140px] rounded-[12px] md:h-10 h-8 md:text-[20px] text-xs"
          >
            {translate("Start_Campaign")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex flex-col lg:w-3/4 gap-5">
          <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
            <div className="text-[16px]">
              {translate("General_Information")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#7E7E80]">
                {translate("Campaign_Name")}
              </label>
              <Input
                className="placeholder:md:text-sm text-xs"
                name="campaignName"
                placeholder={`${translate("Type_campaign_name_here...")}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#7E7E80]">
                {translate("Description")}
              </label>
              <Textarea
                className="placeholder:md:text-sm text-xs"
                placeholder={translate("Type_campaign_description_here...")}
                rows={5}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex flex-col w-full lg:w-1/2 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Campaign_Start_Date")}
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={translate("Select_date")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tags</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col w-full lg:w-1/2 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Campaign_End_Date")}
                </label>
                <Input
                  placeholder={translate("Select_date")}
                  className="placeholder:md:text-sm text-xs"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
            <div className="text-[16px]">{translate("Product_Selection")}</div>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex flex-col w-full lg:w-1/2 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Product_SKUs_on_Our_Site")}
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={translate("Select_a_product_SKU")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tags</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col w-full lg:w-1/2 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Product_SKUs_on_ Brand_Website")}
                </label>
                <Input
                  className="placeholder:md:text-sm text-xs"
                  placeholder={translate("Type_product_SKU_on_brand_website")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#7E7E80]">
                {translate("Product_Links")}
              </label>
              <Input
                className="placeholder:md:text-sm text-xs"
                placeholder={translate("Add_product_link...")}
              />
            </div>
            <div className="flex">
              <Button variant="outline" onClick={handleAddVariant}>
                <FaPlus /> {translate("Add_another_product_link")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
            <div className="text-[16px]">{translate("Campaign_Channels")} </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex flex-col w-full md:w-1/3 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Instagram")}
                </label>
                <Input
                  placeholder={translate("Add_link...")}
                  className="placeholder:md:text-sm text-xs"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/3 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("You_tube")}
                </label>
                <Input
                  placeholder={translate("Add_link...")}
                  className="placeholder:md:text-sm text-xs"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/3 gap-1">
                <label className="text-[12px] text-[#7E7E80]">
                  {translate("Facebook")}
                </label>
                <Input
                  placeholder={translate("Add_link...")}
                  className="placeholder:md:text-sm text-xs"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
            <div className="text-[16px]">
              {translate("Discount/Price Range")}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Base_Price")}
                  </label>
                  <Input
                    placeholder={translate("Type_base_price_here...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Discount_Percentage_Doller")}
                  </label>
                  <Input
                    placeholder={translate("Type_discount_percentage...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Min._price_range")}
                  </label>
                  <Input
                    placeholder={translate("Type_min_price...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Max._price_range")}
                  </label>
                  <Input
                    placeholder={translate("Type_max_price...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Negotiated_Price")}
                  </label>
                  <Input
                    placeholder={translate("Type_negotiated_Price...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2 gap-1">
                  <label className="text-[12px] text-[#7E7E80]">
                    {translate("Max._price_range")}
                  </label>
                  <Input
                    placeholder={translate("Type_max_price...")}
                    className="placeholder:md:text-sm text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:w-1/4">
          <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
            <div className="text-[16px]">{translate("Category")}</div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#7E7E80]">
                {translate("Product_Category")}
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={translate("Select_a_category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#7E7E80]">
                {translate("Product_Tags")}
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={translate("Select_tags")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tags</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}