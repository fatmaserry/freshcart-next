"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyText?: string;
  prominent?: boolean;
  icon?: ReactNode;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  disabled,
  loading,
  error,
  emptyText = "No matches",
  prominent,
  icon,
}: SearchableSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.hint?.includes(query.trim()),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    searchRef.current?.focus();
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const openList = () => {
    if (disabled) return;
    setQuery("");
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  };

  const choose = (opt: SelectOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={prominent ? "space-y-2" : "space-y-1.5"} ref={rootRef}>
      <label
        id={`${id}-label`}
        className={cn(
          "block text-sm text-body",
          prominent ? "font-semibold" : "font-medium",
        )}
      >
        {label} {prominent && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={(e) => {
            if (
              !open &&
              (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
            ) {
              e.preventDefault();
              openList();
            }
          }}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "flex w-full items-center justify-between gap-2 bg-surface-card text-left transition",
            prominent
              ? "h-14 rounded-xl border-2 pl-3 pr-4"
              : "h-11 rounded-lg border px-4 text-sm",
            "focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-hint",
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-line-strong focus:border-brand-500 focus:ring-brand-100",
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            {icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted">
                {icon}
              </span>
            )}
            <span className={cn("truncate", !selected && "text-hint")}>
              {loading ? "Loading…" : selected ? selected.label : placeholder}
            </span>
          </span>
          <Icon
            name="chevron-down"
            size={13}
            className={cn(
              "shrink-0 text-hint transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-line-soft bg-surface-card shadow-xl animate-fade-in">
            <div className="relative border-b border-line-soft p-2">
              <Icon
                name="search"
                size={14}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-hint"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                role="combobox"
                aria-controls={`${id}-list`}
                aria-expanded
                aria-activedescendant={
                  filtered[active] ? `${id}-opt-${active}` : undefined
                }
                className="h-9 w-full rounded-lg bg-surface-alt pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-labelledby={`${id}-label`}
              className="max-h-60 overflow-y-auto py-1"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-hint">{emptyText}</li>
              )}
              {filtered.map((o, i) => (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={o.value === value}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(o);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm",
                    i === active ? "bg-brand-50 text-brand-700" : "text-body",
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {o.hint && (
                      <span dir="rtl" className="text-xs text-hint">
                        {o.hint}
                      </span>
                    )}
                    {o.value === value && (
                      <Icon name="check" size={13} className="text-brand-600" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
