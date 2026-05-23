import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Cancels the deferred plan change. Backed by DELETE /partner/billing/plan-change.
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

    const path = `/partner/billing/plan-change?endUserId=${encodeURIComponent(
      endUserId
    )}`;
    const response = await replyzapFetch(path, { method: "DELETE" });

    if (!response.ok) {
      return upstreamErrorResponse(
        "plan-change-cancel",
        response,
        "Failed to cancel pending plan change"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:plan-change-cancel] error:", error);
    return NextResponse.json(
      { error: "Failed to cancel pending plan change" },
      { status: 500 }
    );
  }
}
