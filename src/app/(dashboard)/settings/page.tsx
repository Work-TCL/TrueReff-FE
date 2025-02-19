import Profile from "@/app/_components/pages/settings/profile";
import { getProfileAPI } from "@/lib/web-api/user";
import React from "react";

export default async function SettingsPage() {
  const profile = await getProfileAPI();
  return <Profile profile={profile} />;
}
