"use client";

import { useState } from "react";
import { Icon, type IconRef } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/api";
import { ProductReviews } from "./ProductReviews";

type Tab = "details" | "reviews" | "shipping";

const keyFeatures = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

const shippingInfo = [
  "Free shipping on orders over 500 EGP",
  "Standard delivery: 3-5 business days",
  "Express delivery available (1-2 business days)",
  "Track your order in real-time",
];

const returnsInfo = [
  "30-day hassle-free returns",
  "Full refund or exchange available",
  "Free return shipping on defective items",
  "Easy online return process",
];

function InfoCard({
  icon,
  title,
  items,
  panel,
  badge,
  check,
}: {
  icon: IconRef;
  title: string;
  items: string[];
  panel: string;
  badge: string;
  check: string;
}) {
  return (
    <div className={cn("rounded-lg bg-linear-to-br p-6", panel)}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-white",
            badge,
          )}
        >
          <Icon name={icon} size={23.5} />
        </div>
        <h4 className="font-semibold text-heading">{title}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-body">
            <Icon name="check" size={16.5} className={cn("mt-0.5", check)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>("details");
  const subcategories = product.subcategory.map((s) => s.name).join(", ");

  const tabs = [
    { id: "details", label: "Product Details", icon: "package" },
    {
      id: "reviews",
      label: `Reviews (${product.ratingsQuantity})`,
      icon: { name: "star", filled: true },
    },
    { id: "shipping", label: "Shipping & Returns", icon: "truck" },
  ] as const;

  const information = [
    ["Category", product.category.name],
    ...(subcategories ? [["Subcategory", subcategories]] : []),
    ["Brand", product.brand.name],
    ["Items Sold", `${product.sold}+ sold`],
  ];

  return (
    <section id="product-details-tabs" className="py-8">
      <div className="container-page">
        <div className="overflow-hidden rounded-lg bg-surface-card shadow-sm">
          <div className="border-b border-line-strong">
            <div className="no-scrollbar flex overflow-x-auto">
              {tabs.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium transition-all duration-200",
                    tab === id
                      ? "border-b-2 border-brand-600 bg-brand-50/50 text-brand-600"
                      : "text-body hover:bg-surface-alt hover:text-brand-600",
                  )}
                >
                  <Icon name={icon} size={16.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {tab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-heading">
                    About this Product
                  </h3>
                  <p className="leading-relaxed text-body">
                    {product.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-surface-alt p-4">
                    <h4 className="mb-3 font-medium text-heading">
                      Product Information
                    </h4>
                    <ul className="space-y-2">
                      {information.map(([label, value]) => (
                        <li
                          key={label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted">{label}</span>
                          <span className="font-medium text-heading">
                            {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-surface-alt p-4">
                    <h4 className="mb-3 font-medium text-heading">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {keyFeatures.map((f) => (
                        <li
                          key={f}
                          className="flex items-center text-sm text-body"
                        >
                          <Icon
                            name="check"
                            size={16.5}
                            className="mr-2 w-4 text-brand-600"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <ProductReviews
                productId={product._id}
                average={product.ratingsAverage}
                count={product.ratingsQuantity}
              />
            )}

            {tab === "shipping" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InfoCard
                    icon="truck"
                    title="Shipping Information"
                    items={shippingInfo}
                    panel="from-brand-50 to-brand-100"
                    badge="bg-brand-600"
                    check="text-brand-600"
                  />
                  <InfoCard
                    icon="rotate-ccw"
                    title="Returns & Refunds"
                    items={returnsInfo}
                    panel="from-green-50 to-green-100"
                    badge="bg-green-600"
                    check="text-green-600"
                  />
                </div>
                <div className="flex items-center gap-4 rounded-lg bg-surface-alt p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-line-strong text-body">
                    <Icon name="shield-check" size={28} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-heading">
                      Buyer Protection Guarantee
                    </h4>
                    <p className="text-sm text-body">
                      Get a full refund if your order doesn&apos;t arrive or
                      isn&apos;t as described. We ensure your shopping
                      experience is safe and secure.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
