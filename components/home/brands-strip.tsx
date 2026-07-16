import Link from "next/link"
import { brands } from "@/lib/data"

export function BrandsStrip() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Бренддер</p>
          <h2 className="font-mono text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            Расмий бренддер
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-background px-4 py-6 text-center transition-all hover:border-primary/50"
            >
              <span className="font-mono text-lg font-bold uppercase tracking-wide text-foreground transition-colors group-hover:text-primary">
                {b.name}
              </span>
              <span className="mt-1 text-[11px] text-muted-foreground">{b.country}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
