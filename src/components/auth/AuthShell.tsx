import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icons";

const perks = [
  { icon: "truck", label: "Free Delivery" },
  { icon: "shield-check", label: "Secure Payment" },
  { icon: { name: "clock", filled: true }, label: "24/7 Support" },
] as const;

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="container-page py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="space-y-6 text-center">
            <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2e5810ff3e-e750761ebcd4ae5907db.png"
                alt="Shopping cart filled with fresh groceries"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 40vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-heading">
                FreshCart - Your One-Stop Shop for Fresh Products
              </h2>
              <p className="text-lg text-body">
                Join thousands of happy customers who trust FreshCart for their
                daily grocery needs
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted">
                {perks.map(({ icon, label }) => (
                  <div key={label} className="flex items-center">
                    <Icon
                      name={icon}
                      size={18.8}
                      className="mr-2 w-5 text-brand-600"
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="rounded-2xl bg-surface-card p-8 shadow-xl lg:p-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
