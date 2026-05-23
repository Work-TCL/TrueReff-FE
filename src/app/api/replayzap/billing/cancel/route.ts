import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Body: { endUserId, immediate? }. Default cancels at period end.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!isNonEmptyString(body?.endUserId)) {
      return NextResponse.json(
        { error: "endUserId is required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const response = await replyzapFetch("/partner/billing/cancel", {
      method: "POST",
      body: JSON.stringify({
        endUserId: body.endUserId,
        immediate: !!body.immediate,
      }),
    });

    if (!response.ok) {
      return upstreamErrorResponse(
        "cancel",
        response,
        "Failed to cancel subscription"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:cancel] error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
