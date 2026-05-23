// --- Types ---
export interface IReplyZapConnection {
  id: string;
  platformType: "FACEBOOK" | "INSTAGRAM";
  platformUserId: string;
  username: string;
  profilePictureUrl: string;
  connectionMethod: string;
  createdAt: string;
}

export interface IReplyZapPost {
  id: string;
  mediaId?: string;
  media_url?: string;
  media_type?: string;
  mediaType?: string;
  thumbnail_url?: string;
  isCommentReplyEnabled: boolean;
  triggerType: string;
  includeKeywords: string[] | null;
  commentReplyText?: string;
  dmTemplate: any;
  sendOnce: boolean;
  timestamp?: string;
  createdAt?: string;
  caption?: string;
  permalink?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface IMediaTemplateCard {
  id: number;
  productId?: string;
  imageUrl: string;
  headline: string;
  description: string;
  buttons: { id: number; title: string; url: string }[];
}

export interface IAutomationData {
  isCommentReplyEnabled: boolean;
  triggerType: "all_comments" | "keywords";
  includeKeywords?: string[];
  commentReplyText?: string;
  dmTemplate: {
    templateType: "text" | "media";
    text?: { message: string };
    mediaTemplates?: IMediaTemplateCard[];
  };
  sendOnce: boolean;
}

// --- Helper ---
async function proxyApi(url: string, body: object, headers?: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

// --- API Functions (all go through Next.js proxy to avoid CORS) ---
export const getReplyZapSessionToken = async (
  creatorId: string
): Promise<{ accessToken: string; endUserId: string; billingEnabled: boolean }> => {
  return proxyApi("/api/replayzap/session-token", { creatorId });
};

export const getReplyZapConnections = async (
  endUserId: string
): Promise<IReplyZapConnection[]> => {
  return proxyApi("/api/replayzap/connections", { endUserId });
};

export interface IReplyZapPostsPage {
  data: IReplyZapPost[];
  paging: { nextCursor: string | null; hasMore: boolean };
}

export const getReplyZapPosts = async (
  endUserId: string,
  connectionId: string,
  after?: string,
): Promise<IReplyZapPostsPage> => {
  const raw = await proxyApi("/api/replayzap/posts", {
    endUserId,
    connectionId,
    after,
  });
  // Tolerate the legacy proxy shape (plain array) so older deploys still work.
  if (Array.isArray(raw)) {
    return { data: raw, paging: { nextCursor: null, hasMore: false } };
  }
  return {
    data: raw?.data ?? [],
    paging: raw?.paging ?? { nextCursor: null, hasMore: false },
  };
};

export const getReplyZapAutomation = async (
  endUserId: string,
  connectionId: string,
  mediaId: string
): Promise<IReplyZapPost | null> => {
  return proxyApi("/api/replayzap/automation", {
    endUserId,
    connectionId,
    mediaId,
  });
};

export const saveReplyZapAutomation = async (
  endUserId: string,
  connectionId: string,
  mediaId: string,
  automationData: IAutomationData,
  authToken?: string
) => {
  return proxyApi(
    "/api/replayzap/automation",
    {
      endUserId,
      connectionId,
      mediaId,
      action: "save",
      automationData,
    },
    authToken ? { Authorization: `Bearer ${authToken}` } : undefined
  );
};

// ───────────────── Billing types ─────────────────
export interface IReplyZapPlan {
  id: string;
  code: string;
  name: string;
  tier: number;
  priceMonthlyUsdCents: number;
  priceMonthlyInrPaise: number;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  isActive: boolean;
  isPublic: boolean;
}

export interface IReplyZapSubscription {
  id: string;
  endUserId: string;
  planId: string;
  planSnapshot: {
    code: string;
    name: string;
    features: Record<string, boolean>;
    limits: Record<string, number>;
  };
  status:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "expired"
    | "incomplete";
  provider: "stripe" | "razorpay" | "manual";
  currency: "USD" | "INR";
  interval: "month" | "year";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  lastPaymentAt: string | null;
  nextBillingAt: string | null;
}

export interface IReplyZapUsageCounter {
  used: number;
  limit: number | null;
  unlimited: boolean;
}

export interface IReplyZapUsage {
  periodStart: string;
  periodEnd: string;
  counters: Record<string, IReplyZapUsageCounter>;
}

export interface IReplyZapInvoice {
  id: string;
  providerInvoiceId: string;
  amountCents: number;
  currency: "USD" | "INR";
  status: "paid" | "open" | "void" | "uncollectible";
  issuedAt: string;
  paidAt: string | null;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
  couponCode?: string | null;
}

export interface ICheckoutParams {
  endUserId: string;
  endUserEmail: string;
  planId: string;
  currency: "USD" | "INR";
  interval?: "month" | "year";
  couponCode?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface IPlanChangeRequest {
  id: string;
  fromPlanId: string;
  toPlanId: string;
  kind: "upgrade" | "downgrade" | "lateral";
  scheduledAt: string;
  status: "pending" | "applied" | "canceled";
}

// ───────────────── Billing API (all proxied) ─────────────────
// Lists plans this partner's end-users can subscribe to (partner-scoped only).
export const getReplyZapPlans = async (): Promise<IReplyZapPlan[]> => {
  const res = await proxyApi("/api/replayzap/billing/plans", {});
  return res?.plans ?? [];
};

// Current active subscription + current-period usage projection. If no
// subscription exists and the partner has a code='free' plan, ReplyZap
// auto-assigns it and returns it in the same call.
export const getReplyZapSubscription = async (
  endUserId: string
): Promise<{
  subscription: IReplyZapSubscription | null;
  usage: IReplyZapUsage | null;
}> => {
  const res = await proxyApi("/api/replayzap/billing/subscription", {
    endUserId,
  });
  return {
    subscription: res?.subscription ?? null,
    usage: res?.usage ?? null,
  };
};

// Starts a hosted checkout session. Redirect the end-user's browser to
// checkoutUrl (Stripe/Razorpay hosted page). After payment, ReplyZap webhooks
// create the active subscription automatically.
export const createReplyZapCheckout = async (
  params: ICheckoutParams
): Promise<{ checkoutUrl: string; providerSessionId: string }> => {
  return proxyApi("/api/replayzap/billing/checkout", params);
};

// Cancels an end-user's subscription. Default is cancel-at-period-end (user
// keeps paid features until the period closes). Set immediate=true to cancel
// immediately.
export const cancelReplyZapSubscription = async (
  endUserId: string,
  immediate = false
): Promise<IReplyZapSubscription> => {
  return proxyApi("/api/replayzap/billing/cancel", { endUserId, immediate });
};

// Upgrade (immediate, prorated) or downgrade (deferred to period end).
// Rejects with 400 if the end-user is on the manual Free plan — use
// createReplyZapCheckout in that case.
export const changeReplyZapPlan = async (
  endUserId: string,
  targetPlanId: string,
  reason?: string
): Promise<{
  applied: boolean;
  scheduled: boolean;
  subscription?: IReplyZapSubscription;
  request?: IPlanChangeRequest;
}> => {
  return proxyApi("/api/replayzap/billing/plan-change", {
    endUserId,
    targetPlanId,
    reason,
  });
};

// Pending deferred plan change (downgrade scheduled for period end), if any.
export const getReplyZapPendingPlanChange = async (
  endUserId: string
): Promise<IPlanChangeRequest | null> => {
  const res = await proxyApi("/api/replayzap/billing/plan-change-pending", {
    endUserId,
  });
  return res?.pending ?? null;
};

// Cancel the deferred plan change so the end-user stays on the current plan.
export const cancelReplyZapPendingPlanChange = async (
  endUserId: string
): Promise<{ success: boolean }> => {
  return proxyApi("/api/replayzap/billing/plan-change-cancel", { endUserId });
};

// Invoice history for an end-user, newest first (server caps at 200).
export const getReplyZapInvoices = async (
  endUserId: string,
  limit = 50
): Promise<IReplyZapInvoice[]> => {
  const res = await proxyApi("/api/replayzap/billing/invoices", {
    endUserId,
    limit,
  });
  return Array.isArray(res) ? res : (res?.invoices ?? []);
};
