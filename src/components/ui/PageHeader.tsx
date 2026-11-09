import Link from "next/link";
import { Icon, type IconRef } from "@/components/ui/icons";
import type { ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  light,
}: {
  items: Crumb[];
  light?: boolean;
}) {
  const base = light ? "gap-2 text-white/70" : "gap-1.5 text-muted";
  const hover = light ? "hover:text-white" : "hover:text-brand-600";
  const current = light ? "text-white" : "text-heading";
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center text-sm ${base}`}
    >
      <Link href="/" className={`flex items-center gap-1 ${hover}`}>
        {!light && <Icon name="home" size={14} />} Home
      </Link>
      {items.map((c) => (
        <span
          key={c.label}
          className={`flex items-center ${light ? "gap-2" : "gap-1.5"}`}
        >
          {light ? (
            <span className="text-white/40">/</span>
          ) : (
            <Icon name="chevron-right" size={14} />
          )}
          {c.href ? (
            <Link href={c.href} className={hover}>
              {c.label}
            </Link>
          ) : (
            <span className={`font-semibold line-clamp-1 ${current}`}>
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

const gradients = {
  green: "from-brand-600 via-brand-500 to-brand-400",
  purple: "from-(--fc-violet-600) via-violet-500 to-purple-400",
};

export function PageHeader({
  title,
  subtitle,
  crumbs,
  icon,
  media,
  tone = "green",
  actions,
  compact,
  padding = "py-10 sm:py-14",
}: {
  title: string;
  subtitle?: ReactNode;
  crumbs?: Crumb[];
  icon?: IconRef;
  media?: ReactNode;
  tone?: keyof typeof gradients;
  actions?: ReactNode;
  compact?: boolean;
  padding?: string;
}) {
  return (
    <div className={`bg-linear-to-br ${gradients[tone]} text-white`}>
      <div
        className={`container-page flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${padding}`}
      >
        <div className="space-y-6">
          {crumbs && <Breadcrumbs items={crumbs} light />}
          <div className="flex items-center gap-5">
            {media}
            {!media && icon && (
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
                <Icon name={icon} size={35} />
              </span>
            )}
            <div>
              <h1
                className={`text-3xl font-bold tracking-tight text-white! ${compact ? "" : "sm:text-4xl sm:leading-10"}`}
              >
                {title}
              </h1>
              {subtitle && <p className="mt-1 text-white/80">{subtitle}</p>}
            </div>
          </div>
        </div>
        {actions}
      </div>
    </div>
  );
}

export function SectionHeading({
  title,
  highlight,
  action,
}: {
  title: string;
  highlight?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
        <span className="h-8 w-1.5 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700" />
        <span>
          {title}{" "}
          {highlight && <span className="text-emerald-600">{highlight}</span>}
        </span>
      </h2>
      {action}
    </div>
  );
}

export function SectionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-brand-600 hover:text-brand-700"
    >
      {children}{" "}
      <Icon
        name="arrow-right"
        size={18}
        className="transition group-hover:translate-x-1"
      />
    </Link>
  );
}
