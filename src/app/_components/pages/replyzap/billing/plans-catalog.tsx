"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import {
  changeReplyZapPlan,
  createReplyZapCheckout,
  getReplyZapPlans,
  getReplyZapSessionToken,
  getReplyZapSubscription,
  IReplyZapPlan,
  IReplyZapSubscription,
} from "@/lib/web-api/replayzap";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyPlaceHolder } from "../../../ui/empty-place-holder";
import BackButton from "../../../ui/back-button";
import Loader from "../../../components-common/layout/loader";
import { toastMessage } from "@/lib/utils/toast-message";
import { Check, IndianRupee, Loader2, Zap } from "lucide-react";

type Currency = "USD" | "INR";

function formatPrice(plan: IReplyZapPlan, currency: Currency): string {
  if (currency === "INR") {
    const inr = plan.priceMonthlyInrPaise / 100;
    return `₹${inr.toLocaleString("en-IN")}`;
  }
  const usd = plan.priceMonthlyUsdCents / 100;
  return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default function PlansCatalog() {
  const translate = useTranslations();
  const router = useRouter();
  const { account } = useAuthStore();
  const { creator } = useCreatorStore();

  const [endUserId, setEndUserId] = useState<string | null>(null);
  const [plans, setPlans] = useState<IReplyZapPlan[]>([]);
  const [current, setCurrent] = useState<IReplyZapSubscription | null>(null);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

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
      const [plansRes, subRes] = await Promise.all([
        getReplyZapPlans(),
        getReplyZapSubscription(session.endUserId).catch(() => ({
          subscription: null,
          usage: null,
        })),
      ]);
      // Show plans in tier order so the upgrade ladder is obvious.
      setPlans([...plansRes].sort((a, b) => a.tier - b.tier));
      setCurrent(subRes.subscription);
    } catch {
      toastMessage.error(translate("Failed_to_load_plans"));
    } finally {
      setLoading(false);
    }
  }, [creator?.creatorId, translate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSelect = async (plan: IReplyZapPlan) => {
    if (!endUserId) return;
    if (acting) return; // double-click guard
    if (current?.planId === plan.id) {
      toastMessage.info(translate("Already_On_This_Plan"));
      return;
    }
    // Downgrades are intentionally not exposed through this UI; the button
    // would normally be disabled, but defend against any state-divergence
    // path (e.g. plan tier shuffle between fetches).
    if (
      current &&
      current.provider !== "manual" &&
      (plans.find((p) => p.id === current.planId)?.tier ?? 0) > plan.tier
    ) {
      toastMessage.info(translate("Plan_Not_Available"));
      return;
    }
    const isFree = current?.provider === "manual";
    const noSub = !current;
    const email = account?.email || "";

    try {
      setActing(plan.id);
      // Free → paid OR no subscription at all → fresh checkout. Otherwise
      // upgrade/downgrade in-place via plan-change.
      if (noSub || isFree) {
        if (!email) {
          toastMessage.error(translate("Email_Missing_For_Checkout"));
          return;
        }
        const origin = window.location.origin;
        const res = await createReplyZapCheckout({
          endUserId,
          endUserEmail: email,
          planId: plan.id,
          currency,
          interval: "month",
          successUrl: `${origin}/creator/billing/success`,
          cancelUrl: `${origin}/creator/billing/cancel`,
        });
        if (res?.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        }
        toastMessage.error(translate("Checkout_Failed"));
      } else {
        const res = await changeReplyZapPlan(endUserId, plan.id);
        if (res?.scheduled) {
          toastMessage.success(translate("Downgrade_Scheduled"));
        } else {
          toastMessage.success(translate("Plan_Upgraded"));
        }
        router.push("/creator/billing");
      }
    } catch {
      toastMessage.error(translate("Plan_Change_Failed"));
    } finally {
      setActing(null);
    }
  };

  const featureRows = useMemo(() => {
    const set = new Set<string>();
    plans.forEach((p) =>
      Object.entries(p.features || {}).forEach(([k, v]) => v && set.add(k))
    );
    return Array.from(set).sort();
  }, [plans]);

  // Is there any plan worth switching to? i.e. a paid plan that isn't the one
  // the user is already on. When billing is not yet activated the backend only
  // returns the free plan, so this is false and we show a "full access" notice
  // instead of a single dead-end plan card.
  const hasUpgradablePlans = useMemo(
    () =>
      plans.some(
        (p) =>
          p.id !== current?.planId &&
          (p.priceMonthlyInrPaise > 0 || p.priceMonthlyUsdCents > 0)
      ),
    [plans, current?.planId]
  );

  if (loading) return <Loader fixed={false} />;

  return (
    <div className="p-4 rounded-lg flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4">
        <BackButton />
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Choose_a_Plan")}
        </h2>
      </div>

      {/* When no paid plans are available to switch to (e.g. billing not yet
          activated for this partner), the upgrade UI is just noise. Show a
          clear "you're all set" notice instead of a single dead-end card. */}
      {!hasUpgradablePlans ? (
        <EmptyPlaceHolder
          title={translate("Full_Access_Free")}
          description={translate("Full_Access_Free_Desc")}
        />
      ) : (
        <>
          {/* Currency switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{translate("Currency")}:</span>
            <div className="inline-flex bg-white border border-stroke rounded-xl overflow-hidden">
              {(["INR", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 text-xs flex items-center gap-1 transition-colors ${
                    currency === c
                      ? "bg-primary-color text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {c === "INR" ? <IndianRupee size={12} /> : <span>$</span>}
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = current?.planId === plan.id;
            // Tier of the plan the end-user is currently on (if any). Used to
            // hide the lower-tier "Downgrade" CTA — partner policy is upgrade
            // or stay; downgrades are not offered through this UI.
            const currentTier =
              current && current.provider !== "manual"
                ? plans.find((p) => p.id === current.planId)?.tier ?? 0
                : -1;
            const isLowerTier =
              current && current.provider !== "manual" && plan.tier < currentTier;
            const ctaLabel = isCurrent
              ? translate("Current_Plan")
              : isLowerTier
              ? translate("Not_Available")
              : current && current.provider !== "manual"
              ? translate("Upgrade")
              : translate("Subscribe");
            const ctaDisabled = isCurrent || isLowerTier || acting === plan.id;
            return (
              <Card
                key={plan.id}
                className={`border rounded-xl p-4 transition-shadow bg-white flex flex-col ${
                  isCurrent
                    ? "border-primary-color shadow-md"
                    : "border-stroke hover:shadow-md"
                }`}
              >
                <CardContent className="p-0 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-darken">
                      {plan.name}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary-color text-white uppercase">
                        {translate("Current")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-darken">
                      {formatPrice(plan, currency)}
                    </span>
                    <span className="text-xs text-gray-500">
                      / {translate("Month")}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2 text-xs text-gray-600 flex-1">
                    {Object.entries(plan.limits || {}).map(([k, v]) => (
                      <li key={`l-${k}`} className="flex items-start gap-2">
                        <Check size={14} className="text-primary-color shrink-0 mt-0.5" />
                        <span className="capitalize">
                          {k.replace(/_/g, " ")}:{" "}
                          <span className="font-medium text-gray-darken">
                            {v === -1 ? "∞" : v}
                          </span>
                        </span>
                      </li>
                    ))}
                    {featureRows
                      .filter((f) => plan.features?.[f])
                      .map((f) => (
                        <li key={`f-${f}`} className="flex items-start gap-2">
                          <Check size={14} className="text-primary-color shrink-0 mt-0.5" />
                          <span className="capitalize">{f.replace(/_/g, " ")}</span>
                        </li>
                      ))}
                  </ul>

                  <button
                    onClick={() => handleSelect(plan)}
                    disabled={ctaDisabled}
                    className={`w-full mt-2 px-3 py-2 text-sm rounded-xl transition-all flex items-center justify-center gap-1 ${
                      ctaDisabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-color text-white hover:opacity-90"
                    }`}
                  >
                    {acting === plan.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {translate("Processing")}
                      </>
                    ) : (
                      <>
                        {!isCurrent && <Zap size={14} />}
                        {ctaLabel}
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
}
