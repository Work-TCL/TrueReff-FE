"use client";

import React from "react";
import { IReplyZapUsageCounter } from "@/lib/web-api/replayzap";

interface IUsageBarProps {
  label: string;
  counter: IReplyZapUsageCounter;
}

// Single usage row: label, used / limit (or ∞), and a coloured progress bar.
// Bar turns amber > 75%, red > 90% so the end-user sees an upgrade trigger
// without us having to put a separate alert in the UI.
export default function UsageBar({ label, counter }: IUsageBarProps) {
  const { used, limit, unlimited } = counter;
  const ratio = unlimited || !limit ? 0 : Math.min(used / limit, 1);
  const pct = Math.round(ratio * 100);

  const barColor =
    ratio >= 0.9
      ? "bg-red-500"
      : ratio >= 0.75
      ? "bg-amber-500"
      : "bg-primary-color";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-darken capitalize">
          {label.replace(/_/g, " ")}
        </span>
        <span className="text-gray-500">
          {unlimited ? `${used} / ∞` : `${used} / ${limit}`}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-light overflow-hidden">
        <div
          className={`h-full ${unlimited ? "bg-gray-300" : barColor} transition-all`}
          style={{ width: unlimited ? "100%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}
