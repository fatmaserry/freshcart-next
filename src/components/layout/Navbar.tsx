"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccountMenu } from "./AccountMenu";
import { MobileDrawer } from "./MobileDrawer";
import { TopBar } from "./TopBar";
import { SearchBox } from "./SearchBox";

const navCategories = [
  { label: "All Categories", href: "/categories" },
  { label: "Electronics", href: "/products?category=6439d2d167d9aa4ca970649f" },
  {
    label: "Women's Fashion",
    href: "/products?category=6439d58a0049ad0b52b9003f",
  },
  {
    label: "Men's Fashion",
    href: "/products?category=6439d5b90049ad0b52b90048",
  },
  {
    label: "Beauty & Health",
    href: "/products?category=6439d30b67d9aa4ca97064b1",
  },
];

function CountBadge({
  count,
  className,
}: {
  count?: number;
  className: string;
}) {
  if (!count) return null;
  return (
    <span
      className={cn(
        "absolute right-0.5 top-0.5 flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-surface-card",
        className,
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Navbar() {
  const { isAuthenticated, isReady } = useAuth();
  const { data: cart } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeDrawer = () => setMobileOpen(false);

  const iconLink =
    "group relative rounded-full p-2.5 transition-colors hover:bg-surface-muted";
  const iconClass =
    "w-6.25 text-muted transition-colors group-hover:text-brand-600";
  const navLinkBase =
    "text-base font-medium text-body transition hover:text-brand-600";

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 bg-surface-card shadow-sm">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-18 lg:gap-8">
          <Logo compact className="shrink-0 lg:w-41.25" />
          <SearchBox
            className="hidden max-w-2xl flex-1 lg:flex"
            placeholder="Search for products, brands and more..."
            inputClassName="rounded-full bg-surface-alt/50 px-5"
            buttonClassName="right-1.5 h-9 w-9 rounded-full"
          />

          <nav className="hidden items-center gap-6 xl:flex">
            <Link href="/" className={navLinkBase}>
              Home
            </Link>
            <Link href="/products" className={navLinkBase}>
              Shop
            </Link>
            <div className="group relative">
              <button
                type="button"
                aria-haspopup="menu"
                className={cn(navLinkBase, "flex items-center gap-1.5 py-2")}
              >
                Categories{" "}
                <Icon
                  name="chevron-down"
                  size={12}
                  className="transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
                />
              </button>
              <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div
                  role="menu"
                  className="min-w-50 rounded-xl border border-line-soft bg-surface-card py-2 shadow-xl"
                >
                  {navCategories.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-body transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/brands" className={navLinkBase}>
              Brands
            </Link>
          </nav>

          <div className="flex items-center gap-1 lg:gap-2">
            <Link
              href="/contact"
              className="mr-2 hidden items-center gap-2 border-r border-line-soft pr-3 transition-opacity hover:opacity-80 lg:flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="headset" size={18.8} className="w-5" />
              </span>
              <div className="text-xs">
                <div className="text-hint">Support</div>
                <div className="font-semibold text-body">24/7 Help</div>
              </div>
            </Link>
            <ThemeToggle />
            <Link
              href="/wishlist"
              title="Wishlist"
              aria-label="Wishlist"
              className={iconLink}
            >
              <Icon name="heart" size={23.5} className={iconClass} />
              <CountBadge count={wishlistIds.size} className="bg-red-500" />
            </Link>
            <Link
              href="/cart"
              title="Cart"
              aria-label="Cart"
              className={iconLink}
            >
              <Icon name="shopping-cart" size={23.5} className={iconClass} />
              <CountBadge
                count={cart?.numOfCartItems}
                className="bg-brand-600"
              />
            </Link>

            {!isReady ? (
              <div className="ml-2 hidden h-10 w-26.75 animate-pulse rounded-full bg-surface-muted lg:block" />
            ) : isAuthenticated ? (
              <AccountMenu />
            ) : (
              <Link
                href="/login"
                className="ml-2 hidden items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700 lg:flex"
              >
                <Icon name="user" size={14} /> Sign In
              </Link>
            )}

            <button
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <Icon name="x" size={20} />
              ) : (
                <Icon name="menu" size={20} />
              )}
            </button>
          </div>
        </div>

        <MobileDrawer open={mobileOpen} onClose={closeDrawer} />
      </header>
    </>
  );
}
