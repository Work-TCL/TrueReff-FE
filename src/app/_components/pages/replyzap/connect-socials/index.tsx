"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getReplyZapSessionToken } from "@/lib/web-api/replayzap";
import { toastMessage } from "@/lib/utils/toast-message";
import Loader from "../../../components-common/layout/loader";

const REPLAYZAP_APP_URL =
  process.env.NEXT_PUBLIC_REPLAYZAP_URL || "https://app.replyzap.com";

export default function ConnectSocials() {
  const translate = useTranslations();
  const router = useRouter();
  const { account } = useAuthStore();
  const { creator } = useCreatorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account?.role && account.role !== "creator") {
      router.replace(`/${account.role}/dashboard`);
    }
  }, [account?.role, router]);

  const creatorId = creator?.creatorId;

  const fetchSessionToken = useCallback(async () => {
    if (!creatorId || account?.role !== "creator") return;
    try {
      setLoading(true);
      setError(null);
      const data = await getReplyZapSessionToken(creatorId);
      setSessionToken(data.accessToken);
      setIframeSrc(`${REPLAYZAP_APP_URL}/embed/${creatorId}`);
    } catch {
      setError(translate("Failed_to_load_connections"));
    } finally {
      setLoading(false);
    }
  }, [creatorId, account?.role, translate]);

  useEffect(() => {
    fetchSessionToken();
  }, [fetchSessionToken]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: only handle messages from the ReplyZap iframe origin.
      // Without this check, any other page open in the user's browser could
      // forge a REQUEST_SESSION_TOKEN message and trick us into leaking the
      // session token via the postMessage reply below.
      if (event.origin !== REPLAYZAP_APP_URL) return;

      if (event.data?.type === "REQUEST_SESSION_TOKEN") {
        if (!sessionToken || !iframeRef.current) return;
        // Use the explicit ReplyZap origin instead of "*", so the token is
        // never broadcast to any other origin even if the iframe is later
        // navigated away.
        iframeRef.current.contentWindow?.postMessage(
          { type: "REPLY360_SESSION_TOKEN", token: sessionToken },
          REPLAYZAP_APP_URL
        );
      }
      if (event.data?.type === "REPLY360_CONNECTION_COMPLETE") {
        toastMessage.success(translate("Social_account_connected"));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sessionToken, translate]);

  if (loading) {
    return <Loader fixed={false} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-xl shadow-md min-h-[300px]">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchSessionToken}
          className="px-4 py-2 text-sm text-white bg-primary-color rounded-md hover:opacity-90"
        >
          {translate("Try_Again")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white rounded-xl shadow-md p-4 xl:p-6">
        <h2 className="text-sm xl:text-xl font-medium mb-4">
          {translate("Connect_Socials")}
        </h2>
        {iframeSrc && (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            width="100%"
            height="650px"
            className="border border-gray-200 rounded-lg"
            title="ReplyZap Connection Manager"
          />
        )}
      </div>
    </div>
  );
}
