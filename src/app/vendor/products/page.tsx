import ChannelCard from "@/app/_components/components-common/channel-card";
import ProductList from "@/app/_components/pages/products/list";
import StoreConnectsRedirect from "@/app/_components/pages/products/store-connect";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import { IChannel } from "@/lib/types-api/vendor";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React from "react";

export default async function ProductListPage(props: any) {
 return <ProductList/>
}
