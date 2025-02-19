"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {translate} from "../../../../lib/utils/translate";

interface IAddProductDetailProps {
    isDetailView?: boolean;
}
export default function CreateCampaign(props: IAddProductDetailProps) {
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
                <div className="text-[20px] text-500">{translate("Campaign Details Form")}</div>
                <div className="flex gap-[10px]">
                    <Button variant="outline" className="w-[140px] rounded-[12px]">{translate("Cancel")}</Button>
                    <Button variant="secondary" className="text-white w-[140px] rounded-[12px]">{translate("Start Campaign")}</Button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="flex flex-col lg:w-3/4 gap-5">
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("General Information")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Campaign Name")}</label>
                            <Input name="campaignName" placeholder={`${translate("Type campaign name here...")}`} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Description")}</label>
                            <Textarea placeholder={translate("Type campaign description here...")} rows={5} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Campaign Start Date")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select date")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("Campaign End Date")}</label>
                                <Input placeholder={translate("Select date")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Product Selection")}</div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Product SKUs on Our Site")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select a product SKU")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("Product SKUs on Brand Website")}</label>
                                <Input placeholder={translate("Type product SKU on brand website")} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product Links")}</label>
                            <Input placeholder={translate("Add product link...")} />
                        </div>
                        <div className="flex">
                            <Button variant="outline" onClick={handleAddVariant}>
                                <FaPlus /> {translate("Add another product link")}
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Campaign Channels")} </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Instagram")}</label>
                                <Input placeholder={translate("Add link...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("You tube")}</label>
                                <Input placeholder={translate("Add link...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Facebook")}</label>
                                <Input placeholder={translate("Add link...")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
                        <div className="text-[16px]">{translate("Discount / Price Range")}</div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Base Price")}</label>
                                    <Input placeholder={translate("Type base price here...")} />
                                </div>
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Discount Percentage (%)")}</label>
                                    <Input placeholder={translate("Type discount percentage...")} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Min. price range")}</label>
                                    <Input placeholder={translate("Type min price...")} />
                                </div>
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Max. price range")}</label>
                                    <Input placeholder={translate("Type max price...")} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Negotiated Price")}</label>
                                    <Input placeholder={translate("Type negotiated Price...")} />
                                </div>
                                <div className="flex flex-col w-full md:w-1/2 gap-1">
                                    <label className="text-[12px] text-[#7E7E80]">{translate("Max. price range")}</label>
                                    <Input placeholder={translate("Type max price...")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-1/4">
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Category")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product Category")}</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={translate("Select a category")} />
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
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product Tags")}</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={translate("Select tags")} />
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
    )
}