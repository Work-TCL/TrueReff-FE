"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { translate } from "@/lib/utils/translate";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface IAddProductDetailProps {
    isDetailView?: boolean;
}
export default function CreateProduct(props: IAddProductDetailProps) {
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
                <div className="text-[20px] text-500">{isDetailView ? <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product/list">{translate("Product List")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{translate("View Product")}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb> : translate("Add New Product Details")}</div>
                <div className="flex gap-[10px]">
                    <Button variant="outline" className="w-[140px] rounded-[12px]">{translate("Cancel")}</Button>
                    <Button variant="secondary" className="text-white w-[140px] rounded-[12px]">{translate(isDetailView ? "Edit" : "Save")}</Button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="flex flex-col lg:w-3/4 gap-5">
                    <div className="bg-white rounded-xl p-[24px] flex flex-col gap-2">
                        <div className="text-[16px]">{translate("Product Image")}</div>
                        {isDetailView ? <div className="flex gap-2">{[1, 2, 3, 4].map((ele, index) => <img src="/assets/product/image-square.svg" className="w-[80px] h-[100px]" key={index} />)}</div> : <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Photo")}</label>
                            <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                                <div className="flex flex-col items-center gap-4">
                                    <img src="/assets/product/image-square.svg" className="w-[50px] h-[50px]" />
                                    <div>{translate("Drag and drop image here, or click add image")}</div>
                                    <Button variant="outline">{translate("Add Image")}</Button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("General Information")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product Name")}</label>
                            <Input placeholder={translate("Type product name here...")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Description")}</label>
                            <Textarea placeholder={translate("Type product description here...")} rows={5} />
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Pricing")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Base Price")}</label>
                            <Input placeholder={translate("Type base price here...")} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Discount Type")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select a discount type")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("Discount Percentage (%)")}</label>
                                <Input placeholder={translate("Type discount percentage...")} />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Tax Class")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select a tax class")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("VAT Amount (%)")}</label>
                                <Input placeholder={translate("Type VAT amount...")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Inventory")}</div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("SKU")}</label>
                                <Input placeholder={translate("Type product SKU here...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Barcode")}</label>
                                <Input placeholder={translate("Product barcode...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Quantity")}</label>
                                <Input placeholder={translate("Type product quantity here...")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
                        <div className="text-[16px]">{translate("Variation")}</div>
                        {variants.map((ele, index) => (
                            <div className="flex flex-col gap-2" key={index}>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex flex-col w-full md:w-1/2 gap-1">
                                        <label className="text-[12px] text-[#7E7E80]">{translate("Variation Type")}</label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={translate("Select a variation type")} />
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
                                    <div className="flex flex-col w-full md:w-1/2 gap-1">
                                        <label className="text-[12px] text-[#7E7E80]">{translate("Variation")}</label>
                                        <Input placeholder={`${translate("Variation")}...`} />
                                    </div>
                                    <div className="flex items-end cursor-pointer" onClick={() => handleDelete(index)}>
                                        <img src="/assets/product/delete-icon.svg" className="w-[42px] h-[42px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex">
                            <Button variant="outline" onClick={handleAddVariant}>
                                <FaPlus /> {translate("Add variant")}
                            </Button>
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