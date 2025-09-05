import SettingsLayout from "@/app/_components/pages/settings/settingsLayout";
import React, { ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}



export default function template({ children, ...props }: ILayout) {
  return <SettingsLayout type="vendor">{children}</SettingsLayout>;
}
