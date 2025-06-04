"use client";

import React, { useEffect, useState } from "react";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import ProductList from "./_components/product-list";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { useAuthStore } from "@/lib/store/auth-user";

export default function Landing(){
    const translate = useTranslations();
    const {account} = useAuthStore();
    const [categories,setCategories] = useState<ICategory[]>([
        {
            name: "All",
            _id: "All",
            parentId: "",
        }
    ]);
    const [productCategories,setProductCategories] = useState<ICategory[]>([]);
    const [activeCategory,setActiveCategoryTabId] = useState("All");
    const [loader, setLoader] = useState<boolean>(false);
    const [loginPopUp, setLoginPopUp] = useState<boolean>(false);
    return <div className="flex flex-col mx-auto w-full lg:w-2/3 p-2 md:p-4 space-y-3 justify-center">
        
        {activeCategory === "All" ? <div className="h-[calc(100vh-145px)]">
            <EmptyPlaceHolder title={translate("No_Products_Available")} description={translate("No_Products_Available_Description")} />
        </div>: <ProductList /> }
    </div>
}