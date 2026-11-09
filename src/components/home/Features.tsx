import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";

const features = [
  {
    icon: "truck",
    title: "Free Shipping",
    text: "On orders over 500 EGP",
    tone: "bg-blue-50 text-blue-500",
  },
  {
    icon: "shield-check",
    title: "Secure Payment",
    text: "100% secure transactions",
    tone: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: "rotate-ccw",
    title: "Easy Returns",
    text: "14-day return policy",
    tone: "bg-orange-50 text-orange-500",
  },
  {
    icon: "headset",
    title: "24/7 Support",
    text: "Dedicated support team",
    tone: "bg-purple-50 text-purple-500",
  },
] as const;

export function Features() {
  return (
    <section className="bg-surface-alt py-8">
      <div className="container-page">
        <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon, title, text, tone }, i) => (
            <Reveal key={title} duration={0.5} delay={i * 0.1}>
              <div className="flex items-center gap-4 rounded-xl bg-surface-card p-4 shadow-sm transition hover:shadow-md">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone}`}
                >
                  <Icon name={icon} size={23.5} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-heading">{title}</p>
                  <p className="text-xs text-muted">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
