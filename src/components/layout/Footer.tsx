import { CONTACT_EMAIL } from "@/lib/site";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";

const strip = [
  { icon: "truck", title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: "rotate-ccw", title: "Easy Returns", text: "14-day return policy" },
  {
    icon: "shield-check",
    title: "Secure Payment",
    text: "100% secure checkout",
  },
  { icon: "headset", title: "24/7 Support", text: "Contact us anytime" },
] as const;

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/brands", label: "Brands" },
      { href: "/categories/6439d2d167d9aa4ca970649f", label: "Electronics" },
      { href: "/categories/6439d5b90049ad0b52b90048", label: "Men's Fashion" },
      {
        href: "/categories/6439d58a0049ad0b52b9003f",
        label: "Women's Fashion",
      },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "My Account" },
      { href: "/orders", label: "Order History" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Shopping Cart" },
      { href: "/login", label: "Sign In" },
      { href: "/register", label: "Create Account" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/profile/addresses", label: "Shipping Addresses" },
      { href: "/forgot-password", label: "Reset Password" },
      { href: "/profile/settings", label: "Change Password" },
      { href: "/orders", label: "Track Order" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="border-y border-brand-100 bg-brand-50">
        <div className="container-page grid grid-cols-2 gap-6 py-6.5 lg:grid-cols-4">
          {strip.map(({ icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Icon name={icon} size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">{title}</p>
                <p className="text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-footer text-footer">
        <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo boxed className="px-4! lg:w-49.25!" />
            <p className="mt-7.5 max-w-117.25 text-sm leading-relaxed">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="phone" size={16} className="text-brand-500" /> +1
                (800) 123-4567
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" filled size={16} className="text-brand-500" />{" "}
                {CONTACT_EMAIL}
              </li>
              <li className="flex items-center gap-3">
                <Icon name="map-pin" size={16} className="text-brand-500" /> 123
                Commerce Street, New York, NY 10001
              </li>
            </ul>
            <div className="mt-6">
              <SocialIcons />
            </div>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="mb-5 text-lg font-semibold text-white!">
                {c.title}
              </h3>
              <ul className="space-y-3 text-sm leading-6">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="transition hover:text-brand-500"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white!">Legal</h3>
            <ul className="space-y-3 text-sm leading-6">
              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-brand-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-brand-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row">
            <p>© 2026 FreshCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {["Visa", "Mastercard", "PayPal"].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <Icon name="credit-card" size={16} /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
