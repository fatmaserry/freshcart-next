"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icons";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-line-soft bg-surface-card px-8 py-4 text-lg font-bold text-body shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-surface-alt hover:shadow-lg sm:w-auto"
    >
      <Icon
        name="arrow-left"
        size={21.2}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />
      Go Back
    </button>
  );
}
