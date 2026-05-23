import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../_lib";

export async function POST(req: NextRequest) {
  try {
    const { endUserId, connectionId, after } = await req.json();

    if (!isNonEmptyString(endUserId) || !isNonEmptyString(connectionId)) {
      return NextResponse.json(
        { error: "endUserId and connectionId are required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    // Forward the optional pagination cursor (Meta's `after`) so the UI can
    // load older posts. Omitted on the first page.
    const qs = isNonEmptyString(after)
      ? `?after=${encodeURIComponent(after)}`
      : "";

    const response = await replyzapFetch(
      `/partner/posts/${encodeURIComponent(connectionId)}${qs}`,
      { headers: { "x-end-user-id": endUserId } }
    );

    if (!response.ok) {
      return upstreamErrorResponse("posts", response, "Failed to fetch posts");
    }

    const data = await readJsonOrThrow(response);
    // Preserve the upstream `paging` envelope so the UI can offer "Load more".
    // Legacy callers that expect a plain array still work — they read `.data`.
    if (Array.isArray(data)) {
      return NextResponse.json({ data, paging: { nextCursor: null, hasMore: false } });
    }
    return NextResponse.json({
      data: data?.data ?? data?.posts ?? [],
      paging: data?.paging ?? { nextCursor: null, hasMore: false },
    });
  } catch (error) {
    console.error("[replayzap:posts] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
