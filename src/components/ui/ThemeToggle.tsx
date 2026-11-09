"use client";

import { Icon } from "@/components/ui/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={cn(
        "relative flex h-11.25 w-11.25 items-center justify-center rounded-full text-muted transition hover:bg-surface-muted hover:text-brand-600",
        className,
      )}
    >
      <Icon
        name="moon"
        size={20}
        className="absolute transition dark:scale-50 dark:opacity-0"
      />
      <Icon
        name="sun"
        size={21}
        className="absolute scale-50 opacity-0 transition dark:scale-100 dark:opacity-100"
      />
    </button>
  );
}
