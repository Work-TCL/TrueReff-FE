
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { translate } from "../../../../lib/utils/translate";

interface IAddProductDetailProps {
    isDetailView?: boolean;
}
export default function StoreSetUp(props: IAddProductDetailProps) {
    let { isDetailView } = props;
    const [variants, setVariants] = useState([
        { variationType: "", variation: "" }
    ]);
    const handleAddVariant = () => {
        setVariants([...variants, { variationType: "", variation: "" }])
    }
    const handleDelete = (ind: number) => {
        setVariants([...variants.filter((ele, index) => index !== ind)])
    };
    return (
        <div className="flex flex-col gap-5 h-full px-4 py-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="text-[20px] text-500">{translate("Add_Details_For_Store_Set_Up")}</div>
                <div className="flex gap-[10px]">
                    <Button variant="outline" className="w-[140px] rounded-[12px]">{translate("Cancel")}</Button>
                    <Button variant="secondary" className="text-white w-[140px] rounded-[12px]">{translate("Save")}</Button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="flex bg-white rounded-xl col-span-2 flex-col gap-2 lg:w-1/2 p-4">
                    <div className="text-sm">{translate("Banner_Image")}</div>
                    <div className="text-sm text-gray-500">{translate("Store_Banner_Image")}</div>
                    <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                        <div className="flex flex-col items-center gap-4">
                            <img src="/assets/product/image-square.svg" className="w-[50px] h-[50px]" />
                            <div className="text-gray-500">{translate("Drag_and_drop_image_here,_or_click_Add_Image")}</div>
                            <Button variant="outline">{translate("Add_Image")}</Button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2 lg:w-1/2  p-4">
                    <div className="text-lg">{translate("Profile_Image")}</div>
                    <div className="text-sm text-gray-500">{translate("Store_Profile_Image")}</div>
                    <div className="flex justify-center items-center border rounded-lg p-5">
                        <div className="flex flex-col items-center gap-4">
                            <img src="/assets/product/image-square.svg" className="w-[50px] h-[50px]" />
                            <div className="text-gray-500">{translate("Drag_and_drop_image_here,_or_click_Add_Image")}</div>
                            <Button variant="outline">{translate("Add_Image")}</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                <div className="text-[16px]">{translate("Category")}</div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex flex-col lg:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">{translate("Product_Category")}</label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translate("Select_category")} />
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
                    <div className="flex flex-col lg:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">{translate("Product_Tags")}</label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={translate("Select_category")} />
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
                <div className="text-[16px]">{translate("General_Information")}</div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex flex-col lg:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">{translate("Store_Name")}</label>
                        <Input placeholder={translate("Type_product_category_here")} />
                    </div>
                    <div className="flex flex-col lg:w-1/2 gap-1">
                        <label className="text-[12px] text-[#7E7E80]">{translate("Store_Link")}</label>
                        <Input placeholder={translate("Type_product_tags_here")} />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[12px] text-[#7E7E80]">{translate("Store_Description")}</label>
                    <Textarea placeholder={translate("Type_product_description_here")} rows={3} />
                </div>
            </div>
        </div>
    )
}