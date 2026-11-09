"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=1920&q=75&auto=format&fit=crop`;

const slides = [
  {
    image: unsplash("photo-1542838132-92c53300491e"),
    title: "Fresh Products Delivered to your Door",
    text: "Get 20% off your first order",
    primary: { label: "Shop Now", href: "/products", color: "text-brand-500" },
    secondary: { label: "View Deals", href: "/products?sort=-sold" },
  },
  {
    image: unsplash("photo-1488459716781-31db52582fe9"),
    title: "Premium Quality Guaranteed",
    text: "Fresh from farm to your table",
    primary: { label: "Shop Now", href: "/products", color: "text-blue-500" },
    secondary: { label: "Learn More", href: "/categories" },
  },
  {
    image: unsplash("photo-1610832958506-aa56368176cf"),
    title: "Fast & Free Delivery",
    text: "Same day delivery available",
    primary: {
      label: "Order Now",
      href: "/products",
      color: "text-purple-500",
    },
    secondary: { label: "Delivery Info", href: "/brands" },
  },
];

function position(slide: number, current: number, count: number) {
  const rel = (slide - current + count) % count;
  if (rel === 0) return 0;
  if (rel === 1) return 100;
  if (rel === count - 1) return -100;
  return 200;
}

export function HeroSlider() {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);

  const goTo = (next: number) => {
    setPrevious(index);
    setIndex((next + count) % count);
  };

  return (
    <section
      className="relative h-100 overflow-hidden"
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={s.title}
          aria-hidden={i !== index}
          style={{ transform: `translateX(${position(i, index, count)}%)` }}
          className={cn(
            "absolute inset-0",
            // Only these two animate; the others jump into place off screen.
            (i === index || i === previous) &&
              "transition-transform duration-300 ease-[ease]",
          )}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-500/90 to-brand-400/50" />
          <div className="container-page relative flex h-full flex-col justify-center">
            <div className="px-4 text-white">
              <Reveal once={false} duration={0.6}>
                <h2 className="mb-4 max-w-96 text-3xl font-bold text-white!">
                  {s.title}
                </h2>
              </Reveal>
              <Reveal once={false} duration={0.6} delay={0.1}>
                <p className="text-base text-white/90">{s.text}</p>
              </Reveal>
              <Reveal once={false} duration={0.8} delay={0.2} distance={30}>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={s.primary.href}
                    className={cn(
                      "rounded-lg border-2 border-white/50 bg-white px-6 py-2 font-semibold transition-transform hover:scale-105",
                      s.primary.color,
                    )}
                  >
                    {s.primary.label}
                  </Link>
                  <Link
                    href={s.secondary.href}
                    className="rounded-lg border-2 border-white/50 bg-transparent px-6 py-2 font-semibold text-white transition-transform hover:scale-105"
                  >
                    {s.secondary.label}
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white hover:text-brand-600 md:flex"
      >
        <Icon name="chevron-left" size={22} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white hover:text-brand-600 md:flex"
      >
        <Icon name="chevron-right" size={22} />
      </button>

      <div className="absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-3 rounded-full bg-white transition-all",
              i === index ? "w-8" : "w-3 opacity-50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
