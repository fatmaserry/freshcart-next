"use client";

import { cn } from "@/lib/utils";
import { toggled, type Filters } from "./searchFilters";

const priceShortcuts = [
  { label: "Under 500", max: "500" },
  { label: "Under 1K", max: "1000" },
  { label: "Under 5K", max: "5000" },
  { label: "Under 10K", max: "10000" },
];

function CheckList({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { _id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-heading">{title}</h3>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-brand-600">
            {selected.length} selected
          </span>
        )}
      </div>
      <div className="max-h-52 space-y-2 overflow-y-auto">
        {options.map((o) => (
          <label
            key={o._id}
            className="group flex cursor-pointer items-center gap-3"
          >
            <input
              type="checkbox"
              checked={selected.includes(o._id)}
              onChange={() => onToggle(o._id)}
              className="h-4 w-4 rounded accent-brand-600"
            />
            <span className="text-sm text-body transition-colors group-hover:text-heading">
              {o.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PriceInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line-strong bg-surface-card px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

export function FilterPanel({
  filters,
  categories,
  brands,
  canClear,
  onChange,
  onClear,
}: {
  filters: Filters;
  categories: { _id: string; name: string }[];
  brands: { _id: string; name: string }[];
  canClear: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <CheckList
        title="Categories"
        options={categories}
        selected={filters.categories}
        onToggle={(id) =>
          onChange({ categories: toggled(filters.categories, id) })
        }
      />
      <hr className="border-line-soft" />
      <div>
        <h3 className="mb-4 font-bold text-heading">Price Range</h3>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <PriceInput
            label="Min (EGP)"
            placeholder="0"
            value={filters.min}
            onChange={(min) => onChange({ min })}
          />
          <PriceInput
            label="Max (EGP)"
            placeholder="No limit"
            value={filters.max}
            onChange={(max) => onChange({ max })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {priceShortcuts.map((s) => (
            <button
              key={s.max}
              onClick={() => onChange({ min: "", max: s.max })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                !filters.min && filters.max === s.max
                  ? "bg-brand-600 text-white"
                  : "bg-surface-muted text-body hover:bg-line-strong",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <hr className="border-line-soft" />
      <CheckList
        title="Brands"
        options={brands}
        selected={filters.brands}
        onToggle={(id) => onChange({ brands: toggled(filters.brands, id) })}
      />
      {canClear && (
        <>
          <hr className="border-line-soft" />
          <button
            onClick={onClear}
            className="w-full rounded-lg border border-line-strong py-2.5 text-sm font-medium text-body transition-colors hover:border-line-strong hover:bg-surface-alt"
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );
}
