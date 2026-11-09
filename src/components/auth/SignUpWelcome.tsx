import Image from "next/image";
import { Icon } from "@/components/ui/icons";

const benefits = [
  {
    icon: { name: "star", filled: true },
    title: "Premium Quality",
    description: "Premium quality products sourced from trusted suppliers.",
  },
  {
    icon: "truck-fast",
    title: "Fast Delivery",
    description: "Same-day delivery available in most areas",
  },
  {
    icon: "shield-check",
    title: "Secure Shopping",
    description: "Your data and payments are completely secure",
  },
] as const;

export function SignUpWelcome() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-heading">
        Welcome to <span className="text-brand-600">FreshCart</span>
      </h1>
      <p className="mb-4 mt-2 text-xl text-body">
        Join thousands of happy customers who enjoy fresh groceries delivered
        right to their doorstep.
      </p>
      <ul className="my-8 space-y-6">
        {benefits.map(({ icon, title, description }) => (
          <li key={title} className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-brand-200 text-brand-600">
              <Icon name={icon} size={21.2} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-heading">{title}</h2>
              <p className="text-body">{description}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-md bg-surface-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <Image
            src="/review-author.png"
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full"
          />
          <div>
            <h3 className="text-body">Sarah Johnson</h3>
            <div className="flex text-yellow-300">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" filled size={18.8} className="w-5" />
              ))}
            </div>
          </div>
        </div>
        <blockquote>
          <p className="italic text-body">
            &quot;FreshCart has transformed my shopping experience. The quality
            of the products is outstanding, and the delivery is always on time.
            Highly recommend!&quot;
          </p>
        </blockquote>
      </div>
    </div>
  );
}
