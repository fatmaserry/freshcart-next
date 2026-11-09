import { Suspense } from "react";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/icons";
import { SearchView } from "@/components/search/SearchView";

export const metadata: Metadata = { title: "Search" };

// useSearchParams is request-time data, so this has to stream behind Suspense.
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Icon
            name="spinner"
            size={42}
            className="animate-spin text-brand-600"
          />
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
