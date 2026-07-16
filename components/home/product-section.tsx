import Link from "next/link"
import type { Product } from "@/lib/data"
import { ProductCard } from "@/components/product/product-card"
import { Reveal } from "@/components/reveal"

export function ProductSection({
  eyebrow,
  title,
  products,
  href,
}: {
  eyebrow: string
  title: string
  products: Product[]
  href?: string
}) {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
            <h2 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
          </div>
          {href && (
            <Link href={href} className="text-sm font-semibold text-primary hover:underline">
              Баарын көрүү →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
