import { getTranslations } from "next-intl/server";
import React from "react";

async function page() {
  const t = await getTranslations();
  return <div>{t("Generate_UTM")}</div>;
}

export default page;
