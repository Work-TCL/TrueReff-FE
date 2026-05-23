"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import {
  getReplyZapConnections,
  getReplyZapSessionToken,
  IReplyZapConnection,
} from "@/lib/web-api/replayzap";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyPlaceHolder } from "../../../ui/empty-place-holder";
import Loader from "../../../components-common/layout/loader";
import { CreditCard, Facebook, Instagram, Plus } from "lucide-react";

export default function ConnectedPages() {
  const translate = useTranslations();
  const router = useRouter();
  const { account } = useAuthStore();
  const { creator } = useCreatorStore();
  const [connections, setConnections] = useState<IReplyZapConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingEnabled, setBillingEnabled] = useState(false);

  useEffect(() => {
    if (account?.role && account.role !== "creator") {
      router.replace(`/${account.role}/dashboard`);
    }
  }, [account?.role, router]);

  const fetchConnections = useCallback(async () => {
    if (!creator?.creatorId) return;
    try {
      setLoading(true);
      setError(null);
      const session = await getReplyZapSessionToken(creator.creatorId);
      setBillingEnabled(session.billingEnabled);
      const data = await getReplyZapConnections(session.endUserId);
      setConnections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[connected-pages] fetch failed:", err);
      setConnections([]);
      setError(translate("Failed_to_load_connections"));
    } finally {
      setLoading(false);
    }
  }, [creator?.creatorId, translate]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  if (loading) return <Loader fixed={false} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-xl shadow-md min-h-[300px]">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchConnections}
          className="px-4 py-2 text-sm text-white bg-primary-color rounded-md hover:opacity-90"
        >
          {translate("Try_Again")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Connected_Pages")}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Only surface the Billing entry point when ReplyZap billing is
              actually activated for this partner. In free-only mode the billing
              page has nothing actionable, so the button is just noise. */}
          {billingEnabled && (
            <button
              onClick={() => router.push("/creator/billing")}
              className="px-4 py-2 text-sm rounded-xl border border-gray-light text-gray-darken hover:bg-gray-50 transition-all flex items-center gap-1"
            >
              <CreditCard size={14} />
              {translate("Billing")}
            </button>
          )}
          <button
            onClick={() => router.push("/creator/connect-socials")}
            className="px-4 py-2 text-sm rounded-xl bg-primary-color text-white hover:opacity-90 transition-all flex items-center gap-1"
          >
            <Plus size={14} />
            {translate("Connect_Account")}
          </button>
        </div>
      </div>

      {connections.length === 0 ? (
        <EmptyPlaceHolder
          title={translate("No_Pages_Connected")}
          description={translate("No_Pages_Connected_Desc")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {connections.map((connection) => (
            <Card
              key={connection.id}
              className="border border-stroke rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
            >
              <CardContent className="p-0 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {connection.profilePictureUrl ? (
                    <img
                      src={connection.profilePictureUrl}
                      alt={connection.username}
                      className="w-full h-full object-cover"
                    />
                  ) : connection.platformType === "FACEBOOK" ? (
                    <Facebook className="w-8 h-8 text-blue-600" />
                  ) : (
                    <Instagram className="w-8 h-8 text-pink-500" />
                  )}
                </div>

                <h3 className="text-sm font-semibold text-center truncate w-full">
                  {connection.username}
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    connection.platformType === "FACEBOOK"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-pink-50 text-pink-500"
                  }`}
                >
                  {connection.platformType === "FACEBOOK" ? (
                    <span className="flex items-center gap-1">
                      <Facebook size={12} /> Facebook
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Instagram size={12} /> Instagram
                    </span>
                  )}
                </span>

                <button
                  onClick={() =>
                    router.push(`/creator/social-automation/${connection.id}`)
                  }
                  className="w-full mt-2 px-3 py-2 text-sm border rounded-xl bg-primary-color text-white hover:opacity-90 transition-all text-center"
                >
                  {translate("View_Posts")}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
