"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { translate } from "@/lib/utils/translate";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface IAddProductDetailProps {
    isDetailView?: boolean;
}
export default function CreateProduct(props: IAddProductDetailProps) {
    const params = useParams()
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

    console.log("params", params);

    return (
        <div className="flex flex-col gap-5 h-full px-4 py-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="text-[20px] text-500">{isDetailView ? <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/vendor/products/channels/${params?.channelType}`}>{translate("Product_List")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{translate("View_Product")}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb> : translate("Add_New_Product_Details")}</div>
                <div className="flex gap-[10px]">
                    <Button variant="outline" className="w-[140px] rounded-[12px]">{translate("Cancel")}</Button>
                    <Button variant="secondary" className="text-white w-[140px] rounded-[12px]">{translate(isDetailView ? "Edit" : "Save")}</Button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="flex flex-col lg:w-3/4 gap-5">
                    <div className="bg-white rounded-xl p-[24px] flex flex-col gap-2">
                        <div className="text-[16px]">{translate("Product_Image")}</div>
                        {isDetailView ? <div className="flex gap-2">{[1, 2, 3, 4].map((ele, index) => <img src="/assets/product/image-square.svg" className="w-[80px] h-[100px]" key={index} />)}</div> : <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Photo")}</label>
                            <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                                <div className="flex flex-col items-center gap-4">
                                    <img src="/assets/product/image-square.svg" className="w-[50px] h-[50px]" />
                                    <div>{translate("Drag_and_drop_image_here,_or_click_Add_Image")}</div>
                                    <Button variant="outline">{translate("Add_Image")}</Button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("General_Information")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product_Name")}</label>
                            <Input placeholder={translate("Type_product_name_ here")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Description")}</label>
                            <Textarea placeholder={translate("Type_product_description_here")} rows={5} />
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Pricing")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Base_Price")}</label>
                            <Input placeholder={translate("Type_base_price_here")} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Discount_Type")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select_a_discount_type")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("Discount_Percentage_(%)")}</label>
                                <Input placeholder={translate("Type_discount_percentage")} />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex flex-col w-full lg:w-1/2 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Tax_Class")}</label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={translate("Select_a_Tax_Class")} />
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
                                <label className="text-[12px] text-[#7E7E80]">{translate("VAT_Amount_(%)")}</label>
                                <Input placeholder={translate("Type_VAT_amount...")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Inventory")}</div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("SKU")}</label>
                                <Input placeholder={translate("Type_product_SKU_here...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Barcode")}</label>
                                <Input placeholder={translate("Product_barcode...")} />
                            </div>
                            <div className="flex flex-col w-full md:w-1/3 gap-1">
                                <label className="text-[12px] text-[#7E7E80]">{translate("Quantity")}</label>
                                <Input placeholder={translate("Type_product_quantity_here...")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2 mb-4">
                        <div className="text-[16px]">{translate("Variation")}</div>
                        {variants.map((ele, index) => (
                            <div className="flex flex-col gap-2" key={index}>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex flex-col w-full md:w-1/2 gap-1">
                                        <label className="text-[12px] text-[#7E7E80]">{translate("Variation_Type")}</label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={translate("Select_a_variation_type")} />
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
                                <FaPlus /> {translate("Add_variant")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-1/4">
                    <div className="flex flex-col bg-white rounded-xl p-[24px] gap-2">
                        <div className="text-[16px]">{translate("Category")}</div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product_Category")}</label>
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
                            <label className="text-[12px] text-[#7E7E80]">{translate("Product_Tags")}</label>
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
    )
}