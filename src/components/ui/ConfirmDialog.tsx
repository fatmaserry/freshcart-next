"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ConfirmDialog({
  open,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  icon: ReactNode;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="m-auto w-[32em] max-w-[calc(100%-2rem)] rounded-2xl border-0 bg-surface-card p-0 shadow-2xl backdrop:bg-black/40"
    >
      <div className="p-6 text-center">
        <div className="py-2">
          {icon}
          <h3 className="mb-2 text-xl font-bold text-heading">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{message}</p>
        </div>
      </div>
      <div className="flex flex-row-reverse justify-center gap-3 px-6 pb-6">
        <button
          onClick={onConfirm}
          className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-(--fc-red-600)"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl bg-surface-muted px-6 py-3 font-semibold text-body transition-all hover:bg-line-strong"
        >
          {cancelLabel}
        </button>
      </div>
    </dialog>
  );
}
