import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Returns { subscription, usage }. Auto-assigns the partner's free plan if
// the end-user has no active subscription and a code='free' plan exists.
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

    const path = `/partner/billing/subscription?endUserId=${encodeURIComponent(
      endUserId
    )}`;
    const response = await replyzapFetch(path);

    if (!response.ok) {
      return upstreamErrorResponse(
        "subscription",
        response,
        "Failed to fetch subscription"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:subscription] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
