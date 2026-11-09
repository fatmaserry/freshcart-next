"use client";

import { CONTACT_EMAIL } from "@/lib/site";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useAuth } from "@/providers/AuthProvider";

const topLink =
  "flex items-center gap-1.5 transition-colors hover:text-brand-600";

export function TopBar() {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <div className="hidden border-b border-line-soft text-sm lg:block">
      <div className="container-page flex h-10 items-center justify-between">
        <div className="flex items-center gap-6 text-muted">
          <span className="flex items-center gap-2">
            <Icon name="truck" size={14} className="text-brand-600" />
            <span>Free Shipping on Orders 500 EGP</span>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="gift" size={14} className="text-brand-600" />
            <span>New Arrivals Daily</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-muted">
            <a href="tel:+18001234567" className={topLink}>
              <Icon name="phone" size={14} />
              <span>+1 (800) 123-4567</span>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className={topLink}>
              <Icon name="mail" size={14} />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
          <span className="h-4 w-px bg-line-soft" />
          <div className="flex items-center gap-4 text-body">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className={topLink}>
                  <Icon name="user" size={14} />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 transition-colors hover:text-red-500"
                >
                  <Icon name="log-out" size={14} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={topLink}>
                  <Icon name="user" size={14} />
                  <span>Sign In</span>
                </Link>
                <Link href="/register" className={topLink}>
                  <Icon name="user-plus" size={14} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
