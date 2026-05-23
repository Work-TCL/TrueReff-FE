// Shared helpers for /api/replayzap/* routes.
// Centralises URL, API key, timeout, and content-type validation so that
// each route stays consistent and a future ReplyZap URL/key rotation is a
// single-file change.

import { NextResponse } from "next/server";

export const REPLAYZAP_URL =
  process.env.REPLAYZAP_URL ||
  process.env.NEXT_PUBLIC_REPLAYZAP_URL ||
  "https://app.replyzap.com";

export const REPLAYZAP_API_KEY = process.env.REPLAYZAP_API_KEY;

const REQUEST_TIMEOUT_MS = 8000;

export function missingApiKeyResponse() {
  return NextResponse.json(
    { error: "ReplyZap API key not configured" },
    { status: 500 }
  );
}

// Call ReplyZap with a forced timeout. Throws on network failure or timeout.
export async function replyzapFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  if (!REPLAYZAP_API_KEY) {
    throw new Error("REPLYZAP_API_KEY_MISSING");
  }

  const url = path.startsWith("http") ? path : `${REPLAYZAP_URL}${path}`;
  const headers = new Headers(init.headers);
  headers.set("x-api-key", REPLAYZAP_API_KEY);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // AbortSignal.timeout is available in Node 18+ runtime (Next.js default).
  const signal =
    typeof AbortSignal !== "undefined" && (AbortSignal as any).timeout
      ? (AbortSignal as any).timeout(REQUEST_TIMEOUT_MS)
      : undefined;

  return fetch(url, { ...init, headers, signal });
}

// Safely parse a ReplyZap response as JSON. If the upstream returned HTML
// (e.g. a 502 gateway page) we bail out cleanly instead of throwing inside
// response.json() and erroring out with a misleading 500.
export async function readJsonOrThrow(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Expected JSON from ReplyZap, got ${contentType || "no content-type"}: ${text.slice(
        0,
        200
      )}`
    );
  }
  return response.json();
}

// Standard error response when an upstream call fails. Logs status + body
// so we always have something useful in the server logs.
export async function upstreamErrorResponse(
  scope: string,
  response: Response,
  fallbackMessage: string
) {
  const body = await response.text().catch(() => "");
  console.error(
    `[replayzap:${scope}] upstream ${response.status} ${response.statusText} body=${body.slice(
      0,
      500
    )}`
  );
  return NextResponse.json({ error: fallbackMessage }, { status: response.status });
}

// True if the value is a non-empty string. Catches "", null, undefined,
// arrays (when route params arrive as `?id=a&id=b`), and any non-string type.
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
