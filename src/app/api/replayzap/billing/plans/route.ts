import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Lists plans available to this partner's end-users (partner-scoped only).
export async function POST(_req: NextRequest) {
  try {
    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const response = await replyzapFetch("/partner/billing/plans");

    if (!response.ok) {
      return upstreamErrorResponse("plans", response, "Failed to fetch plans");
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:plans] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
