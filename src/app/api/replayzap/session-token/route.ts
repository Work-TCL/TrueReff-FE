import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../_lib";

function safeDecodeJwtSub(token: unknown): string | null {
  if (!isNonEmptyString(token)) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadStr = Buffer.from(parts[1], "base64").toString("utf8");
    const payload = JSON.parse(payloadStr);
    return isNonEmptyString(payload?.sub) ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { creatorId } = await req.json();

    if (!isNonEmptyString(creatorId)) {
      return NextResponse.json(
        { error: "creatorId is required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    // Go through partner-api-gateway (single neck), which authenticates the
    // api-key and forwards to partner-service. Previously this hit the
    // replayzap-frontend's own /api/partner/embed/get-session-token proxy,
    // which bypassed the gateway.
    const response = await replyzapFetch(
      "/partner/embed/get-session-token",
      {
        method: "POST",
        body: JSON.stringify({ endUserExternalId: creatorId }),
      }
    );

    if (!response.ok) {
      return upstreamErrorResponse(
        "session-token",
        response,
        "Failed to get session token"
      );
    }

    const data = await readJsonOrThrow(response);

    if (!isNonEmptyString(data?.accessToken)) {
      console.error("[replayzap:session-token] missing accessToken in response");
      return NextResponse.json(
        { error: "Invalid session token response" },
        { status: 502 }
      );
    }

    const endUserId = safeDecodeJwtSub(data.accessToken);
    if (!endUserId) {
      console.error("[replayzap:session-token] could not decode JWT sub");
      return NextResponse.json(
        { error: "Invalid session token format" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      accessToken: data.accessToken,
      endUserId,
      // Whether ReplyZap billing is activated for this partner. When false,
      // billing is free-only and the UI should hide billing/upgrade entry points.
      billingEnabled: data.billingEnabled === true,
    });
  } catch (error) {
    console.error("[replayzap:session-token] error:", error);
    return NextResponse.json(
      { error: "Failed to get session token" },
      { status: 500 }
    );
  }
}
