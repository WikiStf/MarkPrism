"use client";

import { useEffect } from "react";
import type { ToastItem } from "@/types";

const STYLES: Record<ToastItem["type"], string> = {
  success: "bg-emerald-500 text-white",
  error: "bg-rose-500 text-white",
  info: "bg-brand-600 text-white",
};

const ICONS: Record<ToastItem["type"], string> = {
  success: "✅",
  error: "⚠️",
  info: "💡",
};

interface Props {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

export default function Toast({ toasts, onClose }: Props) {
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => onClose(t.id), 2800)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onClose]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => onClose(t.id)}
          className={`pointer-events-auto flex animate-toast-in items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-card backdrop-blur transition-transform hover:scale-[1.02] ${STYLES[t.type]}`}
        >
          <span>{ICONS[t.type]}</span>
          {t.message}
        </button>
      ))}
    </div>
  );
}
