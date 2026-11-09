import { HeroSlider } from "@/components/home/HeroSlider";
import { Features } from "@/components/home/Features";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Features />
      <CategoryStrip />
      <PromoBanner />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
