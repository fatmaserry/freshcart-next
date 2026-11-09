"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/profile/addresses", label: "My Addresses", icon: "map-pin" },
  { href: "/profile/settings", label: "Settings", icon: "gear" },
] as const;

export function AccountNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm lg:sticky lg:top-24">
        <div className="border-b border-line-soft p-4">
          <h2 className="font-bold text-heading">My Account</h2>
        </div>
        <nav className="space-y-1 p-2">
          {items.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium transition-all",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-body hover:bg-surface-alt",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-surface-muted text-muted",
                  )}
                >
                  <Icon name={icon} size={16.5} />
                </span>
                <span className="flex-1">{label}</span>
                <Icon
                  name="chevron-right"
                  size={14}
                  className={active ? "text-brand-600" : "text-hint"}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
