import { CONTACT_EMAIL } from "@/lib/site";
import Link from "next/link";
import { Icon, type IconRef } from "@/components/ui/icons";

const card =
  "rounded-2xl border border-line-soft bg-surface-card p-6 shadow-sm";
const iconTile =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600";

const details: {
  icon: IconRef;
  title: string;
  lines: string[];
  link?: { href: string; label: string };
}[] = [
  {
    icon: "phone",
    title: "Phone",
    lines: ["Mon-Fri from 8am to 6pm"],
    link: { href: "tel:+18001234567", label: "+1 (800) 123-4567" },
  },
  {
    icon: { name: "mail", filled: true },
    title: "Email",
    lines: ["We'll respond within 24 hours"],
    link: {
      href: `mailto:${CONTACT_EMAIL}`,
      label: CONTACT_EMAIL,
    },
  },
  {
    icon: "map-pin",
    title: "Office",
    lines: ["123 Commerce Street", "New York, NY 10001", "United States"],
  },
  {
    icon: { name: "clock", filled: true },
    title: "Business Hours",
    lines: [
      "Monday - Friday: 8am - 6pm",
      "Saturday: 9am - 4pm",
      "Sunday: Closed",
    ],
  },
];

const socials = [
  { name: "Facebook", icon: "facebook" },
  { name: "Twitter", icon: "twitter" },
  { name: "Instagram", icon: "instagram" },
  { name: "LinkedIn", icon: "linkedin" },
] as const;

export function ContactInfo() {
  return (
    <div className="space-y-6 lg:col-span-1">
      {details.map(({ icon, title, lines, link }) => (
        <div key={title} className={card}>
          <div className="flex items-start gap-4">
            <div className={iconTile}>
              <Icon name={icon} size={21.2} />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-heading">{title}</h3>
              <p className={`text-sm text-muted ${link ? "mb-2" : ""}`}>
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              {link && (
                <a
                  href={link.href}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {link.label}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className={card}>
        <h3 className="mb-4 font-semibold text-heading">Follow Us</h3>
        <div className="flex items-center gap-3">
          {socials.map(({ name, icon }) => (
            <span
              key={name}
              aria-label={name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-muted transition-colors hover:bg-brand-600 hover:text-white"
            >
              <Icon name={icon} size={18.8} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactHelp() {
  return (
    <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-card text-brand-600 shadow-sm">
          <Icon name="circle-question" size={23.5} />
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-heading">
            Looking for quick answers?
          </h3>
          <p className="mb-3 text-sm text-body">
            Check out our Terms of Service for details about orders, shipping,
            returns, and more.
          </p>
          <Link
            href="/terms"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
          >
            Read Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
