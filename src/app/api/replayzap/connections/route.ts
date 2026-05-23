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
    const { endUserId } = await req.json();

    if (!isNonEmptyString(endUserId)) {
      return NextResponse.json(
        { error: "endUserId is required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const response = await replyzapFetch("/partner/connections", {
      headers: { "x-end-user-id": endUserId },
    });

    if (!response.ok) {
      return upstreamErrorResponse(
        "connections",
        response,
        "Failed to fetch connections"
      );
    }

    const data = await readJsonOrThrow(response);
    return NextResponse.json(
      Array.isArray(data) ? data : data?.data ?? data?.connections ?? []
    );
  } catch (error) {
    console.error("[replayzap:connections] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
