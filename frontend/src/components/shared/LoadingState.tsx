import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  type?: "spinner" | "skeleton-card" | "skeleton-list";
}

export default function LoadingState({ message = "Loading...", type = "spinner" }: LoadingStateProps) {
  if (type === "skeleton-card") {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl animate-pulse space-y-4">
        <div className="w-10 h-10 bg-[var(--border-light)] rounded-xl"></div>
        <div className="h-4 bg-[var(--border-light)] rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-[var(--border-light)] rounded w-full"></div>
          <div className="h-3 bg-[var(--border-light)] rounded w-5/6"></div>
          <div className="h-3 bg-[var(--border-light)] rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (type === "skeleton-list") {
    return (
      <div className="space-y-3 w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl animate-pulse flex gap-4 items-center">
            <div className="w-10 h-10 bg-[var(--border-light)] rounded-xl shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[var(--border-light)] rounded w-1/4"></div>
              <div className="h-2 bg-[var(--border-light)] rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-4" />
      <span className="text-[12px] font-bold text-[var(--text-muted)] animate-pulse">{message}</span>
    </div>
  );
}
