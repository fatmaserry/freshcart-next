import Link from "next/link";
import { Icon, type IconRef } from "@/components/ui/icons";
import { BackButton } from "@/components/ui/BackButton";

// Full class names, because Tailwind can't see names assembled at runtime.
const floatingIcons: { icon: IconRef; size: number; className: string }[] = [
  {
    icon: "apple-whole",
    size: 42.4,
    className:
      "left-[5%] top-[10%] text-brand-200 animate-[float_6s_ease-in-out_infinite]",
  },
  {
    icon: "carrot",
    size: 35.3,
    className:
      "right-[10%] top-[20%] text-brand-200 animate-[float_8s_ease-in-out_infinite_1s]",
  },
  {
    icon: "lemon",
    size: 35.3,
    className:
      "bottom-[25%] left-[8%] text-brand-200 animate-[float_7s_ease-in-out_infinite_0.5s]",
  },
  {
    icon: "seedling",
    size: 42.4,
    className:
      "bottom-[15%] right-[15%] text-brand-200 animate-[float_9s_ease-in-out_infinite_2s]",
  },
  {
    icon: "apple-whole",
    size: 28.2,
    className:
      "left-[15%] top-[50%] text-brand-100 animate-[float_5s_ease-in-out_infinite_1.5s]",
  },
  {
    icon: "carrot",
    size: 28.2,
    className:
      "right-[5%] top-[40%] text-brand-100 animate-[float_6s_ease-in-out_infinite_0.8s]",
  },
];

const destinations = [
  { href: "/products", label: "All Products", active: true },
  { href: "/categories", label: "Categories" },
  { href: "/products?sort=-sold", label: "Today's Deals" },
  { href: "/contact", label: "Contact Us" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-page px-4 py-16">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {floatingIcons.map(({ icon, size, className }) => (
          <div key={className} className={`absolute ${className}`}>
            <Icon name={icon} size={size} />
          </div>
        ))}
        <div className="absolute right-0 top-0 h-125 w-125 rounded-full bg-linear-to-bl from-brand-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-100 w-100 rounded-full bg-linear-to-tr from-brand-100/30 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 h-52 w-64 rounded-4xl bg-brand-100/50 blur-2xl sm:h-60 sm:w-72" />
            <div className="relative h-52 w-64 sm:h-60 sm:w-72">
              <div className="absolute inset-x-0 top-4 mx-auto flex h-40 w-52 items-center justify-center overflow-hidden rounded-3xl border border-line-soft bg-surface-card shadow-xl shadow-line-soft/60 sm:h-44 sm:w-60">
                <div className="absolute inset-0 bg-linear-to-br from-brand-50/80 via-transparent to-brand-100/40" />
                <Icon
                  name="shopping-cart"
                  className="relative text-6xl! text-brand-400/80 sm:text-7xl!"
                />
              </div>
              <div className="absolute -right-2 -top-2 sm:right-0 sm:top-0">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-surface-card shadow-lg" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/40 sm:h-20 sm:w-20">
                    <span className="text-xl font-black tracking-tight text-white sm:text-2xl">
                      404
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center justify-center gap-4">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-400" />
                <div className="h-4 w-8 rounded-b-full border-b-[3px] border-brand-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-brand-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-heading sm:text-5xl">
            Oops! Nothing Here
          </h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-muted">
            Looks like this page went out of stock! Don&apos;t worry,
            there&apos;s plenty more fresh content to explore.
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30 sm:w-auto"
          >
            <Icon
              name="home"
              size={21.2}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Go to Homepage
          </Link>
          <BackButton />
        </div>

        <div className="rounded-3xl border border-line-soft bg-surface-card p-6 shadow-sm">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-hint">
            Popular Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {destinations.map((d) => (
              <Link
                key={d.label}
                href={d.href}
                className={
                  d.active
                    ? "rounded-xl bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                    : "rounded-xl bg-surface-muted px-5 py-2.5 text-sm font-semibold text-body transition-colors hover:bg-line-strong"
                }
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
