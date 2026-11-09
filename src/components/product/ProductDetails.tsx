"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { useProduct } from "@/hooks/useCatalog";
import { useToggleWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { cn, formatPrice } from "@/lib/utils";
import { Stars } from "@/components/ui/Rating";
import { ProductDetailsSkeleton } from "@/components/ui/PageSkeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { RelatedProducts } from "./RelatedProducts";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";

const LOW_STOCK = 10;
const ADDED_MESSAGE_MS = 2000;

const perks = [
  { icon: "truck-fast", title: "Free Delivery", text: "Orders over 500 EGP" },
  { icon: "rotate-ccw", title: "30 Days Return", text: "Money back" },
  { icon: "shield-check", title: "Secure Payment", text: "100% Protected" },
] as const;

function StockBadge({ quantity }: { quantity: number }) {
  const low = quantity > 0 && quantity <= LOW_STOCK;
  const tone = quantity === 0 ? "red" : low ? "amber" : "green";
  const styles = {
    red: ["bg-red-50 text-red-700", "bg-red-500"],
    amber: ["bg-amber-50 text-amber-700", "bg-amber-500"],
    green: ["bg-green-50 text-green-700", "bg-green-500"],
  }[tone];

  return (
    <div className="mb-6 flex items-center gap-2">
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
          styles[0],
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", styles[1])} />
        {quantity === 0
          ? "Out of Stock"
          : low
            ? `Only ${quantity} left - Order soon!`
            : "In Stock"}
      </span>
    </div>
  );
}

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [pendingMode, setPendingMode] = useState<"cart" | "buy">("cart");
  const [justAdded, setJustAdded] = useState(false);
  const wishlist = useToggleWishlist();
  const cart = useAddToCart();

  if (isLoading) return <ProductDetailsSkeleton />;

  if (error || !product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<Icon name="shopping-cart" size={28} />}
          title="Product not found"
          description="It may have been removed or the link is wrong."
          action={<ButtonLink href="/products">Browse products</ButtonLink>}
        />
      </div>
    );
  }

  const stock = product.quantity;
  const inStock = stock > 0;
  const images = product.images.length ? product.images : [product.imageCover];
  const liked = wishlist.isInWishlist(product._id);
  const setClampedQty = (value: number) =>
    setQty(Math.min(stock, Math.max(1, value || 1)));

  const add = (mode: "cart" | "buy") => {
    setPendingMode(mode);
    cart.mutate(
      { productId: id, count: qty },
      {
        onSuccess: () => {
          if (mode === "buy") return router.push("/checkout");
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), ADDED_MESSAGE_MS);
        },
      },
    );
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // The share sheet rejects when the user dismisses it.
    }
  };

  const stepper =
    "px-4 py-3 text-body transition hover:bg-surface-muted hover:text-brand-600 disabled:opacity-50";
  const addingToCart = cart.isPending && pendingMode === "cart";
  const buying = cart.isPending && pendingMode === "buy";

  return (
    <>
      <title>{`${product.title} · FreshCart`}</title>
      <ProductBreadcrumb product={product} />

      <section id="product-detail" className="py-6">
        <div className="container-page">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div id="product-images" className="lg:w-1/4">
              <div className="sticky top-24 rounded-xl bg-surface-media p-4 shadow-sm">
                <ProductGallery images={images} title={product.title} />
              </div>
            </div>

            <div id="product-info" className="lg:w-3/4">
              <div className="rounded-xl bg-surface-card p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Link
                    href={`/categories/${product.category._id}`}
                    className="rounded-full bg-brand-50 px-3 py-1.5 text-xs text-brand-700 transition hover:bg-brand-100"
                  >
                    {product.category.name}
                  </Link>
                  <Link
                    href={`/products?brand=${product.brand._id}`}
                    className="rounded-full bg-surface-muted px-3 py-1.5 text-xs text-body"
                  >
                    {product.brand.name}
                  </Link>
                </div>

                <h1 className="mb-3 text-2xl font-bold text-heading lg:text-3xl">
                  {product.title}
                </h1>

                <div className="mb-4 flex items-center gap-3">
                  <Stars
                    value={product.ratingsAverage}
                    size={18.8}
                    className="h-6 items-center text-amber-400"
                  />
                  <span className="text-sm text-body">
                    {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                  </span>
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold text-heading">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <StockBadge quantity={stock} />

                <div className="mb-6 border-t border-line-soft pt-5">
                  <p className="leading-relaxed text-body">
                    {product.description}
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="mb-2 block text-sm font-medium text-body"
                  >
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center overflow-hidden rounded-lg border-2 border-line-strong">
                      <button
                        onClick={() => setClampedQty(qty - 1)}
                        disabled={!inStock || qty <= 1}
                        aria-label="Decrease quantity"
                        className={stepper}
                      >
                        <Icon name="minus" size={18.8} className="w-5" />
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min={1}
                        max={stock}
                        value={qty}
                        disabled={!inStock}
                        onChange={(e) => setClampedQty(Number(e.target.value))}
                        className="w-16 border-0 bg-transparent text-center text-lg font-medium focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={() => setClampedQty(qty + 1)}
                        disabled={!inStock || qty >= stock}
                        aria-label="Increase quantity"
                        className={stepper}
                      >
                        <Icon name="plus" size={18.8} className="w-5" />
                      </button>
                    </div>
                    <span className="text-sm text-muted">
                      {stock} available
                    </span>
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-surface-alt p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body">Total Price:</span>
                    <span className="text-2xl font-bold text-brand-600">
                      {(product.price * qty).toFixed(2)} EGP
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => add("cart")}
                    disabled={!inStock || cart.isPending}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-medium text-white shadow-lg shadow-brand-600/25 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
                      justAdded
                        ? "bg-green-500"
                        : "bg-brand-600 hover:bg-brand-700",
                    )}
                  >
                    {addingToCart ? (
                      <Spinner className="h-4 w-4" />
                    ) : justAdded ? (
                      <Icon name="check" size={18.8} />
                    ) : (
                      <Icon name="shopping-cart" size={18.8} className="w-5" />
                    )}
                    {justAdded ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => add("buy")}
                    disabled={!inStock || cart.isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-heading px-6 py-3.5 font-medium text-surface-page transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buying ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Icon name="zap" size={18.8} className="w-5" />
                    )}{" "}
                    Buy Now
                  </button>
                </div>

                <div className="mb-6 flex gap-3">
                  <button
                    onClick={() => wishlist.toggle(product._id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition",
                      liked
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-line-strong text-body hover:border-brand-300 hover:text-brand-600",
                    )}
                  >
                    <Icon
                      name="heart"
                      size={18.8}
                      filled={liked}
                      className="w-5"
                    />
                    {liked ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                  <button
                    onClick={share}
                    aria-label="Share product"
                    className="rounded-xl border-2 border-line-strong px-4 py-3 text-body transition hover:border-brand-300 hover:text-brand-600"
                  >
                    <Icon name="share" size={18.8} className="w-5" />
                  </button>
                </div>

                <div className="border-t border-line-soft pt-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {perks.map(({ icon, title, text }) => (
                      <div key={title} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                          <Icon name={icon} size={18.8} className="w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-heading">
                            {title}
                          </h4>
                          <p className="text-xs text-muted">{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductTabs product={product} />
      <RelatedProducts product={product} />
    </>
  );
}
