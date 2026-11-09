"use client";

import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  error,
  icon,
  className,
  type,
  id,
  ref,
  ...rest
}: InputProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? rest.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-body"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-hint">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          className={cn(
            "h-11 w-full rounded-lg border bg-surface-card px-4 text-sm text-heading placeholder:text-hint transition",
            "focus:outline-none focus:ring-4",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-line-strong focus:border-brand-100 focus:ring-brand-100",
            !!icon && "pl-10",
            isPassword && "pr-11",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-hint hover:text-body"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <Icon name="eye-off" size={18} />
            ) : (
              <Icon name="eye" size={18} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
