import { Suspense } from "react";
import { CategoryDetailsView } from "@/components/catalog/CategoryDetailsView";
import { DetailsPageSkeleton } from "@/components/ui/PageSkeletons";

export default function CategoryDetailsPage() {
  return (
    <Suspense fallback={<DetailsPageSkeleton />}>
      <CategoryDetailsView />
    </Suspense>
  );
}
