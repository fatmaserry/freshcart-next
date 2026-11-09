import type { Metadata } from "next";
import { WishlistView } from "@/components/cart/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-surface-alt/50">
      <WishlistView />
    </div>
  );
}
