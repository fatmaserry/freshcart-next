import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { Icon, type IconRef } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: IconRef;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <Icon name={icon} size={23.5} />
        </span>
        <div>
          <h3 className="font-bold text-heading">{title}</h3>
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        </div>
      </div>
      {children}
    </>
  );
}

export function SettingsField({
  label,
  error,
  ref,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <div>
      <label
        htmlFor={rest.name}
        className="mb-2 block text-sm font-medium text-body"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={rest.name}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-xl border bg-surface-card px-4 py-3 text-heading outline-none transition placeholder:text-hint focus:ring-2",
          error
            ? "border-red-400 focus:ring-red-100"
            : "border-line-strong focus:border-brand-500 focus:ring-brand-500/20",
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export const settingsButton =
  "inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60";
