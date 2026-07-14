import React from "react";
import { AlertOctagon, ShieldAlert, WifiOff, Home, RefreshCw } from "lucide-react";

interface ErrorPageProps {
  type: "404" | "403" | "500" | "network";
  onHome?: () => void;
  onRetry?: () => void;
}

export default function ErrorPage({ type, onHome, onRetry }: ErrorPageProps) {
  let content = {
    icon: <AlertOctagon size={64} className="text-[var(--danger)]" />,
    title: "Page Not Found (404)",
    desc: "The page you are looking for doesn't exist or has been moved.",
    showRetry: false
  };

  if (type === "403") {
    content = {
      icon: <ShieldAlert size={64} className="text-[var(--warning)]" />,
      title: "Unauthorized Access (403)",
      desc: "You don't have permission to access this resource. Please check your role.",
      showRetry: false
    };
  } else if (type === "500") {
    content = {
      icon: <AlertOctagon size={64} className="text-[var(--danger)]" />,
      title: "Server Error (500)",
      desc: "Something went wrong on our end. Our engineers have been notified.",
      showRetry: true
    };
  } else if (type === "network") {
    content = {
      icon: <WifiOff size={64} className="text-[var(--text-muted)]" />,
      title: "Network Error",
      desc: "Unable to connect to the server. Please check your internet connection.",
      showRetry: true
    };
  }

  return (
    <div className="min-h-[400px] h-full flex flex-col items-center justify-center p-12 text-center bg-[var(--bg)] animate-fade-in">
      <div className="w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-3xl flex items-center justify-center mb-6 shadow-sm rotate-3">
        <div className="-rotate-3">{content.icon}</div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] mb-3">{content.title}</h1>
      <p className="text-[13px] text-[var(--text-muted)] font-medium max-w-sm leading-relaxed mb-8">
        {content.desc}
      </p>
      <div className="flex gap-4">
        {onHome && (
          <button onClick={onHome} className="btn-primary px-6 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 shadow-sm cursor-pointer">
            <Home size={16} /> Return Home
          </button>
        )}
        {content.showRetry && onRetry && (
          <button onClick={onRetry} className="bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg)] px-6 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors">
            <RefreshCw size={16} /> Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
