import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Upgrade (immediate, prorated) or downgrade (deferred to period end).
// Returns 400 if current sub is on the manual Free plan — caller should use
// the checkout flow in that case.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !isNonEmptyString(body?.endUserId) ||
      !isNonEmptyString(body?.targetPlanId)
    ) {
      return NextResponse.json(
        { error: "endUserId and targetPlanId are required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const response = await replyzapFetch("/partner/billing/plan-change", {
      method: "POST",
      body: JSON.stringify({
        endUserId: body.endUserId,
        targetPlanId: body.targetPlanId,
        reason: body.reason,
      }),
    });

    if (!response.ok) {
      return upstreamErrorResponse(
        "plan-change",
        response,
        "Failed to change plan"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:plan-change] error:", error);
    return NextResponse.json(
      { error: "Failed to change plan" },
      { status: 500 }
    );
  }
}
