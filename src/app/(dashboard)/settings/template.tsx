import SettingsLayout from "@/app/_components/settings/settingsLayout";
import React, { ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}

export default function template({ children, ...props }: ILayout) {
  console.log("--------------", props);

  return <SettingsLayout>{children}</SettingsLayout>;
}
