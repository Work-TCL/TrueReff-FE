"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import {
  cancelReplyZapPendingPlanChange,
  cancelReplyZapSubscription,
  getReplyZapInvoices,
  getReplyZapPendingPlanChange,
  getReplyZapSessionToken,
  getReplyZapSubscription,
  IPlanChangeRequest,
  IReplyZapInvoice,
  IReplyZapSubscription,
  IReplyZapUsage,
} from "@/lib/web-api/replayzap";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyPlaceHolder } from "../../../ui/empty-place-holder";
import Loader from "../../../components-common/layout/loader";
import { toastMessage } from "@/lib/utils/toast-message";
import {
  CalendarClock,
  CreditCard,
  ExternalLink,
  FileText,
  RefreshCw,
  XCircle,
  Zap,
} from "lucide-react";
import UsageBar from "./usage-bar";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amountCents: number, currency: string) {
  const amount = amountCents / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Treat anything that isn't currently usable as "no active subscription".
// Without this the UI happily renders an expired/canceled plan as if it were
// active, and the only CTA is "Cancel" — leaving the user with no upgrade path.
function isActiveSubscription(
  sub: IReplyZapSubscription | null
): boolean {
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
}

// Only render external URLs we trust. ReplyZap's hostedInvoiceUrl/pdfUrl
// flow through several Stripe/Razorpay redirects, so we whitelist by scheme
// to keep a javascript:/data: URL from sneaking through.
function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function statusBadgeClass(status: IReplyZapSubscription["status"]) {
  switch (status) {
    case "active":
    case "trialing":
      return "bg-green-50 text-green-600";
    case "past_due":
    case "incomplete":
      return "bg-amber-50 text-amber-600";
    case "canceled":
    case "expired":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-500";
  }
}

export default function BillingDashboard() {
  const translate = useTranslations();
  const router = useRouter();
  const { account } = useAuthStore();
  const { creator } = useCreatorStore();

  const [endUserId, setEndUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<IReplyZapSubscription | null>(
    null
  );
  const [usage, setUsage] = useState<IReplyZapUsage | null>(null);
  const [pending, setPending] = useState<IPlanChangeRequest | null>(null);
  const [invoices, setInvoices] = useState<IReplyZapInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (account?.role && account.role !== "creator") {
      router.replace(`/${account.role}/dashboard`);
    }
  }, [account?.role, router]);

  const fetchAll = useCallback(async () => {
    if (!creator?.creatorId) return;
    try {
      setLoading(true);
      const session = await getReplyZapSessionToken(creator.creatorId);
      setEndUserId(session.endUserId);
      const [subRes, pendingRes, invRes] = await Promise.all([
        getReplyZapSubscription(session.endUserId),
        getReplyZapPendingPlanChange(session.endUserId).catch(() => null),
        getReplyZapInvoices(session.endUserId, 20).catch(() => []),
      ]);
      setSubscription(subRes.subscription);
      setUsage(subRes.usage);
      setPending(pendingRes);
      setInvoices(invRes);
    } catch {
      toastMessage.error(translate("Failed_to_load_billing"));
    } finally {
      setLoading(false);
    }
  }, [creator?.creatorId, translate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCancel = async (immediate: boolean) => {
    if (!endUserId) return;
    const confirmMsg = immediate
      ? translate("Cancel_Subscription_Immediate_Confirm")
      : translate("Cancel_Subscription_Confirm");
    if (!window.confirm(confirmMsg)) return;
    try {
      setActing(true);
      await cancelReplyZapSubscription(endUserId, immediate);
      toastMessage.success(translate("Subscription_Cancel_Success"));
      await fetchAll();
    } catch {
      toastMessage.error(translate("Subscription_Cancel_Failed"));
    } finally {
      setActing(false);
    }
  };

  const handleCancelPending = async () => {
    if (!endUserId) return;
    if (!window.confirm(translate("Cancel_Plan_Change_Confirm"))) return;
    try {
      setActing(true);
      await cancelReplyZapPendingPlanChange(endUserId);
      toastMessage.success(translate("Plan_Change_Canceled"));
      await fetchAll();
    } catch {
      toastMessage.error(translate("Plan_Change_Cancel_Failed"));
    } finally {
      setActing(false);
    }
  };

  if (loading) return <Loader fixed={false} />;

  if (!isActiveSubscription(subscription)) {
    return (
      <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Billing")}
        </h2>
        <EmptyPlaceHolder
          title={
            subscription
              ? translate("Subscription_Inactive")
              : translate("No_Subscription")
          }
          description={
            subscription
              ? translate("Subscription_Inactive_Desc", {
                  status: subscription.status,
                })
              : translate("No_Subscription_Desc")
          }
        />
        <button
          onClick={() => router.push("/creator/billing/plans")}
          className="w-full sm:w-auto px-8 py-3 text-sm bg-primary-color text-white rounded-xl hover:opacity-90 transition-all"
        >
          {translate("View_Plans")}
        </button>
      </div>
    );
  }

  const isFree = subscription.provider === "manual";
  const counters = usage?.counters ? Object.entries(usage.counters) : [];

  return (
    <div className="p-4 rounded-lg flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Billing")}
        </h2>
        <button
          onClick={fetchAll}
          disabled={acting}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-color disabled:opacity-50"
        >
          <RefreshCw size={14} /> {translate("Refresh")}
        </button>
      </div>

      {/* Current plan card */}
      <Card className="border border-stroke rounded-xl bg-white">
        <CardContent className="p-4 xl:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {translate("Current_Plan")}
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-lg xl:text-2xl font-semibold text-gray-darken">
                  {subscription.planSnapshot.name}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${statusBadgeClass(
                    subscription.status
                  )}`}
                >
                  {subscription.status}
                </span>
                {isFree && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-pink-50 text-primary-color">
                    {translate("Free")}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <CalendarClock size={12} />
                {subscription.cancelAtPeriodEnd
                  ? translate("Ends_On", {
                      date: formatDate(subscription.currentPeriodEnd),
                    })
                  : translate("Renews_On", {
                      date: formatDate(
                        subscription.nextBillingAt ?? subscription.currentPeriodEnd
                      ),
                    })}
              </span>
            </div>

            {/* Only show plan-change actions for paid subscriptions.
                Free (manual) plan has nothing to upgrade to while billing
                is not yet activated — hiding the button avoids a dead-end. */}
            {!isFree && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => router.push("/creator/billing/plans")}
                  className="px-4 py-2 text-sm rounded-xl bg-primary-color text-white hover:opacity-90 transition-all flex items-center gap-1"
                >
                  <Zap size={14} />
                  {translate("Change_Plan")}
                </button>
                {!subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={() => handleCancel(false)}
                    disabled={acting}
                    className="px-4 py-2 text-sm rounded-xl border border-gray-light text-gray-darken hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                  >
                    <XCircle size={14} />
                    {translate("Cancel_Subscription")}
                  </button>
                )}
              </div>
            )}
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              {translate("Cancellation_Scheduled", {
                date: formatDate(subscription.currentPeriodEnd),
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending downgrade card */}
      {pending && pending.status === "pending" && (
        <Card className="border border-amber-200 rounded-xl bg-amber-50">
          <CardContent className="p-4 xl:p-6 flex items-start justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-amber-700">
                {translate("Pending_Plan_Change")}
              </span>
              <span className="text-sm font-medium text-amber-900">
                {translate("Plan_Change_Scheduled", {
                  kind: pending.kind,
                  date: formatDate(pending.scheduledAt),
                })}
              </span>
            </div>
            <button
              onClick={handleCancelPending}
              disabled={acting}
              className="px-4 py-2 text-sm rounded-xl bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
            >
              {translate("Cancel_Plan_Change")}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Usage card */}
      <Card className="border border-stroke rounded-xl bg-white">
        <CardContent className="p-4 xl:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Zap size={16} className="text-primary-color" />
              {translate("Usage_This_Period")}
            </h3>
            {usage && (
              <span className="text-xs text-gray-500">
                {formatDate(usage.periodStart)} — {formatDate(usage.periodEnd)}
              </span>
            )}
          </div>
          {counters.length === 0 ? (
            <p className="text-xs text-gray-500">
              {translate("No_Limits_Configured")}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {counters.map(([key, counter]) => (
                <UsageBar key={key} label={key} counter={counter} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices card */}
      <Card className="border border-stroke rounded-xl bg-white">
        <CardContent className="p-4 xl:p-6 flex flex-col gap-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FileText size={16} className="text-primary-color" />
            {translate("Invoices")}
          </h3>
          {invoices.length === 0 ? (
            <EmptyPlaceHolder
              title={translate("No_Invoices_Yet")}
              description={translate("No_Invoices_Yet_Desc")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500">
                  <tr className="border-b border-stroke">
                    <th className="text-left py-2 px-3 font-medium">
                      {translate("Date")}
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      {translate("Amount")}
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      {translate("Status")}
                    </th>
                    <th className="text-right py-2 px-3 font-medium">
                      {translate("Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-stroke last:border-0">
                      <td className="py-2 px-3 text-gray-darken">
                        {formatDate(inv.issuedAt)}
                      </td>
                      <td className="py-2 px-3 text-gray-darken">
                        {formatAmount(inv.amountCents, inv.currency)}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                            inv.status === "paid"
                              ? "bg-green-50 text-green-600"
                              : inv.status === "open"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex items-center gap-3">
                          {(() => {
                            const safeHosted = safeHttpUrl(inv.hostedInvoiceUrl);
                            return safeHosted ? (
                              <a
                                href={safeHosted}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-color hover:underline inline-flex items-center gap-1"
                              >
                                {translate("View")} <ExternalLink size={12} />
                              </a>
                            ) : null;
                          })()}
                          {(() => {
                            const safePdf = safeHttpUrl(inv.pdfUrl);
                            return safePdf ? (
                              <a
                                href={safePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:underline inline-flex items-center gap-1"
                              >
                                PDF <ExternalLink size={12} />
                              </a>
                            ) : null;
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer mini-info */}
      <div className="text-[10px] text-gray-400 flex items-center gap-1">
        <CreditCard size={12} />
        {translate("Billed_via_ReplyZap")}
        {account?.email ? <>· {account.email}</> : null}
      </div>
    </div>
  );
}
