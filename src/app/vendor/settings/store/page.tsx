import StoreConnects from "@/app/_components/pages/settings/store-connects";
// import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React, { Suspense } from "react";

export default async function page() {
  // const channels = await getConnectedChannelsList();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreConnects channels={[]} />
    </Suspense>
  );
}
