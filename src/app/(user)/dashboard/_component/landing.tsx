"use client";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import React, { useEffect, useState } from "react";
import Categories from "./categories";
import AllProductList from "./all-product-list";
import ProductList from "./product-list";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";

export default function Landing(){
    const translate = useTranslations();
    const [categories,setCategories] = useState<ICategory[]>([
        {
            name: "All",
            _id: "All",
            parentId: "",
        }
    ]);
    const [productCategories,setProductCategories] = useState<ICategory[]>([]);
    const [activeCategory,setActiveCategoryTabId] = useState("All");
    console.log("productCategories",productCategories)

    useEffect(()=> {
        fetchCategory();
        fetchProductCategories();
    },[]);
    const fetchCategory = async () => {
        try {
          const response = await getCategories({ page: 0, limit: 0 });
          let data = response?.data?.data;
          if(data?.length > 0){
            let category = data?.filter((ele:ICategory) => ele?.parentId === null);
            setCategories([...categories,...category]);
          } else {
            setCategories([...categories])
          }
        } catch (error: any) {
          console.log("Error Fetching categories", error.message);
        }
      };
      const fetchProductCategories = async () => {
        try {
          const response = await axios.get(
            `/product/category-for-slider`
        );
          let data = response?.data?.data?.data;
          console.log('data',data)
          if(data?.length > 0){
            setProductCategories(data);
          } else {
            setProductCategories([])
          }
        } catch (error: any) {
          console.log("Error Fetching categories", error.message);
          setProductCategories([])
        }
      };
    return <div className="flex flex-col mx-auto w-full lg:w-2/3 p-2 md:p-4 space-y-3 justify-center">
        <Categories categories={categories} activeCategory={activeCategory} setActiveCategoryTabId={setActiveCategoryTabId}/>
        {activeCategory === "All" ? productCategories?.length > 0 ? productCategories?.map((ele:ICategory,index) => (
            <AllProductList key={ele?.name} category={ele} setActiveCategoryTabId={setActiveCategoryTabId}/>
        )) : <div className="h-[calc(100vh-145px)]">
            <EmptyPlaceHolder title={translate("No_Products_Available")} description={translate("No_Products_Available_Description")} />
        </div>: <ProductList category={activeCategory}/> }
    </div>
}