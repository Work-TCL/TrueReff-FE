"use client";

import AutomationForm from "@/app/_components/pages/replyzap/social-automation/automation-form";
import { useParams } from "next/navigation";
import React from "react";

// See sibling page for the rationale — Next's useParams returns
// string | string[] | undefined, and silently casting can let an array slip
// into the ReplyZap API call. Coerce explicitly.
function pickParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

export default function AutomationPage() {
  const params = useParams();
  const connectionId = pickParam(params?.connectionId as string | string[] | undefined);
  const mediaId = pickParam(params?.mediaId as string | string[] | undefined);

  if (!connectionId || !mediaId) {
    return (
      <div className="p-4 text-sm text-red-500">Invalid route parameters.</div>
    );
  }

  return <AutomationForm connectionId={connectionId} mediaId={mediaId} />;
}
