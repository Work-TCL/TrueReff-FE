import { NextRequest, NextResponse } from "next/server";
import {
  REPLAYZAP_API_KEY,
  isNonEmptyString,
  missingApiKeyResponse,
  readJsonOrThrow,
  replyzapFetch,
  upstreamErrorResponse,
} from "../_lib";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

interface IProduct {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price?: number;
}

interface ICollaboration {
  productId: IProduct;
  vendorId?: { business_name: string };
  utmLink: string | null;
  couponCode: string;
  commissionValue: number;
  commissionType: string;
}

function resolveVariables(
  template: string,
  product: IProduct,
  collab: ICollaboration
): string {
  const discount =
    collab.commissionType === "PERCENTAGE"
      ? `${collab.commissionValue}%`
      : `₹${collab.commissionValue}`;

  return template
    .replace(/\{\{product_name\}\}/g, product.title || "")
    .replace(/\{\{price\}\}/g, product.price ? `₹${product.price}` : "")
    .replace(/\{\{description\}\}/g, product.description || "")
    .replace(/\{\{brand_name\}\}/g, collab.vendorId?.business_name || "")
    .replace(/\{\{coupon_code\}\}/g, collab.couponCode || "")
    .replace(/\{\{discount\}\}/g, discount);
}

async function resolveAutomationData(
  automationData: any,
  authToken: string | null
) {
  if (
    !authToken ||
    automationData?.dmTemplate?.templateType !== "media" ||
    !automationData?.dmTemplate?.mediaTemplates?.length
  ) {
    return automationData;
  }

  // Collect productIds that need resolution
  const productIds = automationData.dmTemplate.mediaTemplates
    .map((card: any) => card.productId)
    .filter(Boolean);

  if (productIds.length === 0) return automationData;

  // Fetch collaborations to get product + vendor data
  try {
    const response = await fetch(
      `${BACKEND_URL}/product/collaboration/creator/list?page=1&limit=100&status=ACTIVE`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        signal: (AbortSignal as any).timeout
          ? (AbortSignal as any).timeout(8000)
          : undefined,
      }
    );

    if (!response.ok) return automationData;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return automationData;

    const result = await response.json();
    const collaborations: ICollaboration[] = result?.data?.list || [];

    // Build a map of productId -> collaboration
    const collabMap = new Map<string, ICollaboration>();
    for (const collab of collaborations) {
      if (collab.productId?._id) {
        collabMap.set(collab.productId._id, collab);
      }
    }

    // Resolve variables in each media template card. We stash the original
    // template strings under `_rawHeadline` / `_rawDescription` so the GET
    // path can prefill the form with the editable template (`{{product_name}}`)
    // instead of the resolved text. `productId` is preserved so the product
    // dropdown prefills correctly on edit.
    const resolvedTemplates = automationData.dmTemplate.mediaTemplates.map(
      (card: any) => {
        if (!card.productId) return card;

        const collab = collabMap.get(card.productId);
        if (!collab) return card;

        const product = collab.productId;
        const rawHeadline = card._rawHeadline ?? card.headline ?? "";
        const rawDescription = card._rawDescription ?? card.description ?? "";

        return {
          ...card,
          _rawHeadline: rawHeadline,
          _rawDescription: rawDescription,
          headline: resolveVariables(rawHeadline, product, collab),
          description: resolveVariables(rawDescription, product, collab),
        };
      }
    );

    // Also resolve the text message if it has variables. Same stash pattern:
    // `_rawMessage` keeps the editable template alive across save/edit cycles.
    let resolvedText = automationData.dmTemplate.text;
    if (resolvedText?.message && productIds.length > 0) {
      const firstCollab = collabMap.get(productIds[0]);
      if (firstCollab) {
        const rawMessage =
          resolvedText._rawMessage ?? resolvedText.message ?? "";
        resolvedText = {
          ...resolvedText,
          _rawMessage: rawMessage,
          message: resolveVariables(
            rawMessage,
            firstCollab.productId,
            firstCollab
          ),
        };
      }
    }

    return {
      ...automationData,
      dmTemplate: {
        ...automationData.dmTemplate,
        mediaTemplates: resolvedTemplates,
        text: resolvedText,
      },
    };
  } catch (error) {
    console.error("[replayzap:automation] resolve variables failed:", error);
    return automationData;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endUserId, connectionId, mediaId, action, automationData } = body;

    if (
      !isNonEmptyString(endUserId) ||
      !isNonEmptyString(connectionId) ||
      !isNonEmptyString(mediaId)
    ) {
      return NextResponse.json(
        { error: "endUserId, connectionId, and mediaId are required" },
        { status: 400 }
      );
    }

    // Reject anything that isn't a known action. Default (undefined/null)
    // means GET; anything else must be exactly "save". Silently falling
    // through to GET on typos hid bugs.
    if (action !== undefined && action !== null && action !== "save") {
      return NextResponse.json(
        { error: `Unknown action: ${String(action)}` },
        { status: 400 }
      );
    }

    if (action === "save" && (!automationData || typeof automationData !== "object")) {
      return NextResponse.json(
        { error: "automationData is required when action=save" },
        { status: 400 }
      );
    }

    if (!REPLAYZAP_API_KEY) return missingApiKeyResponse();

    const headers = { "x-end-user-id": endUserId };
    const path = `/partner/posts/${encodeURIComponent(connectionId)}/${encodeURIComponent(
      mediaId
    )}/automation`;

    if (action === "save") {
      // Parse Authorization header; reject malformed "Bearer" without token.
      const authHeader = req.headers.get("authorization");
      let authToken: string | null = null;
      if (authHeader) {
        const match = authHeader.match(/^Bearer\s+(.+)$/);
        if (match && match[1].trim().length > 0) {
          authToken = match[1].trim();
        }
        // If header was present but malformed, we just skip variable resolution
        // (don't 400 — the user's automation save shouldn't depend on a
        // working backend auth token; products won't be resolved, that's all).
      }

      const resolvedData = await resolveAutomationData(automationData, authToken);

      const response = await replyzapFetch(path, {
        method: "PUT",
        headers,
        body: JSON.stringify(resolvedData),
      });

      if (!response.ok) {
        return upstreamErrorResponse(
          "automation:save",
          response,
          "Failed to save automation"
        );
      }

      return NextResponse.json(await readJsonOrThrow(response));
    }

    // GET (action === undefined/null)
    const response = await replyzapFetch(path, { headers });

    if (response.status === 404) {
      return NextResponse.json(null);
    }

    if (!response.ok) {
      return upstreamErrorResponse(
        "automation:get",
        response,
        "Failed to fetch automation"
      );
    }

    // Prefer the stashed raw template strings (e.g. "{{product_name}}") so the
    // edit form shows the template, not last save's resolved text. Falls back
    // to whatever is stored if `_raw*` isn't present (old data).
    const data = await readJsonOrThrow(response);
    if (data?.dmTemplate?.mediaTemplates) {
      data.dmTemplate.mediaTemplates = data.dmTemplate.mediaTemplates.map(
        (card: any) => ({
          ...card,
          headline: card._rawHeadline ?? card.headline,
          description: card._rawDescription ?? card.description,
        })
      );
    }
    if (data?.dmTemplate?.text?._rawMessage) {
      data.dmTemplate.text = {
        ...data.dmTemplate.text,
        message: data.dmTemplate.text._rawMessage,
      };
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[replayzap:automation] error:", error);
    return NextResponse.json(
      { error: "Failed to process automation request" },
      { status: 500 }
    );
  }
}
