import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";

const deals = [
  {
    badge: "🔥 Deal of the Day",
    title: "Fresh Organic Fruits",
    text: "Get up to 40% off on selected organic fruits",
    off: "40% OFF",
    code: "ORGANIC40",
    cta: "Shop Now",
    href: "/products",
    bg: "from-emerald-500 to-emerald-700",
    btn: "text-emerald-600",
  },
  {
    badge: "✨ New Arrivals",
    title: "Exotic Vegetables",
    text: "Discover our latest collection of premium vegetables",
    off: "25% OFF",
    code: "FRESH25",
    cta: "Explore Now",
    href: "/products?sort=-createdAt",
    bg: "from-orange-400 to-rose-500",
    btn: "text-orange-500",
  },
];

export function PromoBanner() {
  return (
    <section className="container-page py-10">
      <div className="grid gap-6 px-4 md:grid-cols-2">
        {deals.map((d, i) => (
          <Reveal
            key={d.title}
            from={i === 0 ? "left" : "right"}
            distance={50}
            duration={0.8}
          >
            <div
              className={`relative min-h-75 overflow-hidden rounded-2xl bg-linear-to-br ${d.bg} p-8 text-white shadow-lg`}
            >
              <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <span className="absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative space-y-3">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
                  {d.badge}
                </span>
                <h3 className="text-2xl font-bold text-white! sm:text-3xl">
                  {d.title}
                </h3>
                <p className="text-white/85">{d.text}</p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-3xl font-bold">{d.off}</span>
                  <span className="text-sm text-white/80">
                    Use code: <b className="text-white">{d.code}</b>
                  </span>
                </div>
                <Link
                  href={d.href}
                  className={`mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold ${d.btn} transition hover:gap-3`}
                >
                  {d.cta} <Icon name="arrow-right" size={18} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
