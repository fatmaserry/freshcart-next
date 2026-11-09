"use client";

import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Icon, type IconRef } from "@/components/ui/icons";
import type { PaymentMethod } from "@/lib/payment";
import { cn } from "@/lib/utils";

export function CheckoutSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IconRef;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm">
      <div className="bg-linear-to-r from-brand-600 to-brand-700 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Icon name={icon} size={21.2} /> {title}
        </h2>
        <p className="mt-1 text-sm text-brand-100">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

const fieldClass =
  "w-full rounded-xl border-2 bg-surface-card py-3.5 pl-14 pr-4 text-heading placeholder:text-hint transition focus:outline-none focus:ring-4";

export function CheckoutField({
  label,
  icon,
  error,
  hint,
  textarea,
  registration,
  ...rest
}: {
  label: string;
  icon: IconRef;
  error?: string;
  hint?: string;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
  registration: UseFormRegisterReturn;
}) {
  const { name } = registration;
  const className = cn(
    fieldClass,
    error
      ? "border-red-400 focus:ring-red-100"
      : "border-line-strong focus:border-brand-500 focus:ring-brand-100",
    !!hint && "pr-44",
  );

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-body"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-muted">
          <Icon name={icon} size={16.5} />
        </span>
        {textarea ? (
          <textarea
            id={name}
            rows={3}
            aria-invalid={!!error}
            className={cn(className, "resize-none")}
            {...rest}
            {...registration}
          />
        ) : (
          <input
            id={name}
            aria-invalid={!!error}
            className={className}
            {...rest}
            {...registration}
          />
        )}
        {hint && (
          <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs text-hint sm:block">
            {hint}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export function AddressOption({
  active,
  dashed,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  dashed?: boolean;
  icon: IconRef;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
        dashed && "border-dashed",
        active
          ? "border-brand-500 bg-brand-50"
          : "border-line-soft hover:border-line-strong",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-brand-600 text-white" : "bg-surface-muted text-muted",
        )}
      >
        <Icon name={icon} size={18.8} />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {active && !dashed && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
          <Icon name="check" size={13} />
        </span>
      )}
    </button>
  );
}

export function PaymentOption({
  method,
  active,
  onSelect,
}: {
  method: PaymentMethod;
  active: boolean;
  onSelect: () => void;
}) {
  const icon = method.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all",
        active
          ? "border-brand-500 bg-brand-50"
          : "border-line-soft hover:border-line-strong",
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
          active
            ? "bg-brand-600 text-white shadow-lg"
            : "bg-surface-muted text-muted",
        )}
      >
        <Icon name={icon} size={23.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block font-bold",
            active ? "text-brand-700" : "text-heading",
          )}
        >
          {method.title}
        </span>
        <span className="mt-0.5 block text-sm text-muted">
          {method.description}
        </span>
        {method.badges && (
          <span className="mt-2 flex items-center gap-2">
            {method.badges.map(({ icon, className }, i) => (
              <Icon key={i} name={icon} size={23.5} className={className} />
            ))}
          </span>
        )}
      </span>
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
          active
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-line-strong",
        )}
      >
        {active && <Icon name="check" size={14} />}
      </span>
    </button>
  );
}
