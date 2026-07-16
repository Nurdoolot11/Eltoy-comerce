import { SiteShell } from "@/components/site/site-shell"
import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { ProductSection } from "@/components/home/product-section"
import { Advantages } from "@/components/home/advantages"
import { BrandsStrip } from "@/components/home/brands-strip"
import { ReviewsSection } from "@/components/home/reviews-section"
import { CtaBanner } from "@/components/home/cta-banner"
import { NewsSection } from "@/components/home/news-section"
import { products } from "@/lib/data"

export default function HomePage() {
  const popular = products.filter((p) => p.badges.includes("popular")).slice(0, 8)
  const sale = products.filter((p) => p.badges.includes("sale")).slice(0, 4)

  return (
    <SiteShell>
      <Hero />
      <CategoryGrid />
      <ProductSection eyebrow="Хит сатуулар" title="Популярдуу товарлар" products={popular} href="/catalog" />
      <Advantages />
      <ProductSection eyebrow="Арзандатуу" title="Акциядагы товарлар" products={sale} href="/catalog?sale=1" />
      <BrandsStrip />
      <CtaBanner />
      <ReviewsSection />
      <NewsSection />
    </SiteShell>
  )
}
