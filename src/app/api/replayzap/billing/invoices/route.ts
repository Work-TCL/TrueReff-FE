import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../../_lib";

// Body: { endUserId, limit? }. Returns invoice array (server-capped at 200).
export async function POST(req: NextRequest) {
  try {
    const { endUserId, limit } = await req.json();

    if (!isNonEmptyString(endUserId)) {
      return NextResponse.json(
        { error: "endUserId is required" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const qs = new URLSearchParams({ endUserId });
    if (limit !== undefined && limit !== null && Number.isFinite(Number(limit))) {
      qs.set("limit", String(Math.max(1, Math.min(200, Number(limit)))));
    }

    const path = `/partner/billing/invoices?${qs.toString()}`;
    const response = await replyzapFetch(path);

    if (!response.ok) {
      return upstreamErrorResponse(
        "invoices",
        response,
        "Failed to fetch invoices"
      );
    }

    return NextResponse.json(await readJsonOrThrow(response));
  } catch (error) {
    console.error("[replayzap:invoices] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
