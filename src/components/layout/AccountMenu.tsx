"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/profile", label: "My Profile", icon: "user" },
  { href: "/orders", label: "My Orders", icon: "package-search" },
  { href: "/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/profile/addresses", label: "Addresses", icon: "address-book" },
  { href: "/profile/settings", label: "Settings", icon: "gear" },
] as const;

const iconClass =
  "w-6.25 text-muted transition-colors group-hover:text-brand-600";

function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, close]);
  return ref;
}

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useOutsideClose(menuOpen, closeMenu);

  return (
    <div className="relative hidden lg:block" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        title="Account"
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="group relative rounded-full p-2.5 transition-colors hover:bg-surface-muted"
      >
        <Icon name="circle-user" size={23.5} className={iconClass} />
      </button>
      <div
        role="menu"
        className={cn(
          "absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-line-soft bg-surface-card shadow-xl transition-all duration-200",
          menuOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        <div className="border-b border-line-soft p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100">
              <Icon name="circle-user" size={23.5} className="text-brand-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-heading">
                {user?.name}
              </p>
              <p className="truncate text-xs text-hint">{user?.email}</p>
            </div>
          </div>
        </div>
        <div className="py-2">
          {accountLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-body transition-colors hover:bg-brand-50 hover:text-brand-600"
            >
              <Icon name={icon} size={18.8} className="w-4 text-hint" />
              {label}
            </Link>
          ))}
        </div>
        <div className="border-t border-line-soft py-2">
          <button
            onClick={() => {
              setMenuOpen(false);
              signOut();
            }}
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
          >
            <Icon name="log-out" size={18.8} className="w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
