import React from "react";
import CreateProduct from "@/app/_components/products/create";
import { Params } from "next/dist/server/request/params";

interface IProps {
    params: Params
}

export default async function ProductDetail({ params }: IProps) {
    const { id } = await params
    return <CreateProduct isDetailView={true} />
}