import { Suspense } from "react";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductDetailsSkeleton } from "@/components/ui/PageSkeletons";

// useParams is request-time data, so this has to stream behind Suspense.
export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails />
    </Suspense>
  );
}
