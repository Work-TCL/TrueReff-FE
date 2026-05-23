"use client";

import PostsList from "@/app/_components/pages/replyzap/social-automation/posts-list";
import { useParams } from "next/navigation";
import React from "react";

// Next.js useParams() can return string | string[] | undefined per slot.
// Coerce safely: undefined → "", arrays → first entry. We avoid an `as string`
// cast because that silently passes arrays through to the downstream API call.
function pickParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

export default function PostsPage() {
  const params = useParams();
  const connectionId = pickParam(params?.connectionId as string | string[] | undefined);

  if (!connectionId) {
    return (
      <div className="p-4 text-sm text-red-500">Invalid connection id.</div>
    );
  }

  return <PostsList connectionId={connectionId} />;
}
