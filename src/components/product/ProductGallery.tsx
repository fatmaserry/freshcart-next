"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-450 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="w-full shrink-0"
              aria-hidden={i !== active}
            >
              <Image
                src={src}
                alt={title}
                width={800}
                height={1000}
                // Slides beside the active one are clipped, so a lazy image
                // would only start loading once it is already sliding in.
                {...(i === 0
                  ? { priority: true }
                  : { loading: Math.abs(i - active) <= 1 ? "eager" : "lazy" })}
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="no-scrollbar mx-auto flex w-fit max-w-full gap-0.5 overflow-x-auto py-1.25">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}`}
            className={cn(
              "w-25 shrink-0 border-4 transition-colors duration-300",
              i === active
                ? "border-[#337ab7]"
                : "border-transparent hover:border-[#337ab7]",
            )}
          >
            <Image
              src={src}
              alt=""
              width={100}
              height={125}
              sizes="100px"
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
