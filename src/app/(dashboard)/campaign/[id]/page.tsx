import React from "react";
import CreateCampaign from "@/app/_components/campaigns/create";
import { Params } from "next/dist/server/request/params";

interface IProps {
    params: Params
}

export default async function DetailsPage({ params }: IProps) {
    const { id } = await params

    return <CreateCampaign />
}