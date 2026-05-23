import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Starts a hosted checkout session at Stripe (USD) or Razorpay (INR).
// Body: { endUserId, endUserEmail, planId, currency, interval?, couponCode?,
//         successUrl?, cancelUrl? }. Returns { checkoutUrl, providerSessionId }.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !isNonEmptyString(body?.endUserId) ||
      !isNonEmptyString(body?.endUserEmail) ||
      !isNonEmptyString(body?.planId) ||
      !isNonEmptyString(body?.currency)
    ) {
      return NextResponse.json(
        {
          error: "endUserId, endUserEmail, planId and currency are required",
        },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const response = await replyzapFetch("/partner/billing/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return upstreamErrorResponse(
        "checkout",
        response,
        "Failed to create checkout session"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:checkout] error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
