import React from "react";
import { FolderX, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface-raised)] h-full min-h-[300px]">
      <div className="w-16 h-16 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--text-muted)] shadow-sm mb-4">
        {icon || <FolderX size={32} />}
      </div>
      <h3 className="text-[15px] font-bold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-[12px] text-[var(--text-muted)] font-medium max-w-sm leading-relaxed mb-6">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary text-[12px] px-5 py-2.5 rounded-xl shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
