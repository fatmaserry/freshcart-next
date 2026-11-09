"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { SearchBox } from "./SearchBox";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

const circle = "flex h-9 w-9 items-center justify-center rounded-full";
const row =
  "flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-brand-50";
const rowLabel = "flex items-center gap-3";
const divider = <div className="mx-4 border-t border-line-soft" />;

function Count({ value, className }: { value?: number; className: string }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-bold text-white",
        className,
      )}
    >
      {value}
    </span>
  );
}

// Always mounted so the slide transition can run in both directions.
export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, user, signOut } = useAuth();
  const { data: cart } = useCart();
  const { ids: wishlistIds } = useWishlist();

  return (
    <div
      onClick={onClose}
      inert={!open}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-surface-card shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line-soft bg-surface-alt/50 p-4">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className={cn(
              circle,
              "bg-surface-muted text-body transition-colors hover:bg-line-strong",
            )}
          >
            <Icon name="x" size={18.8} />
          </button>
        </div>

        <SearchBox
          className="border-b border-line-soft p-4"
          placeholder="Search products..."
          inputClassName="rounded-xl bg-surface-alt px-4"
          buttonClassName="right-2 h-8 w-8 rounded-lg"
          onNavigate={onClose}
        />

        <nav className="p-4">
          <div className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-600"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {divider}

        <div className="space-y-1 p-4">
          <Link href="/wishlist" onClick={onClose} className={row}>
            <span className={rowLabel}>
              <span className={cn(circle, "bg-red-50 text-red-500")}>
                <Icon name="heart" size={18.8} />
              </span>
              <span className="font-medium text-body">Wishlist</span>
            </span>
            <Count value={wishlistIds.size} className="bg-red-500" />
          </Link>
          <Link href="/cart" onClick={onClose} className={row}>
            <span className={rowLabel}>
              <span className={cn(circle, "bg-brand-50 text-brand-600")}>
                <Icon name="shopping-cart" size={18.8} />
              </span>
              <span className="font-medium text-body">Cart</span>
            </span>
            <Count value={cart?.numOfCartItems} className="bg-brand-600" />
          </Link>
        </div>

        {divider}

        <div className="space-y-1 p-4">
          {isAuthenticated ? (
            <>
              <Link href="/profile" onClick={onClose} className={row}>
                <span className={rowLabel}>
                  <span className={cn(circle, "bg-surface-muted text-body")}>
                    <Icon name="user" size={18.8} />
                  </span>
                  <span className="font-medium text-body">{user?.name}</span>
                </span>
              </Link>
              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-red-50"
              >
                <span className={cn(circle, "bg-red-50 text-red-500")}>
                  <Icon name="log-out" size={18.8} />
                </span>
                <span className="font-medium text-red-600">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-brand-600 px-4 py-3 font-semibold text-brand-600 transition-colors hover:bg-brand-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/contact"
          onClick={onClose}
          className="mx-4 mb-4 mt-2 flex items-center gap-3 rounded-xl border border-line-soft bg-surface-alt p-4 transition-colors hover:bg-brand-50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <Icon name="headset" size={18.8} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-body">
              Need Help?
            </span>
            <span className="block text-sm text-brand-600">
              Contact Support
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
