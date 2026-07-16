import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/data"
import { DynamicIcon } from "@/components/dynamic-icon"
import { Reveal } from "@/components/reveal"

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Категориялар</p>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Категория боюнча тандаңыз
          </h2>
        </div>
        <Link href="/catalog" className="text-sm font-semibold text-primary hover:underline">
          Баарын көрүү →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 40}>
            <Link
              href={`/catalog/${cat.slug}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute right-0 top-0 h-24 w-24 opacity-20 transition-transform duration-500 group-hover:scale-110">
                <Image src={cat.image || "/placeholder.svg"} alt="" fill className="object-contain" />
              </div>
              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <DynamicIcon name={cat.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold leading-tight text-foreground">{cat.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{cat.description}</p>
              </div>
              <span className="relative z-10 mt-4 text-xs font-medium text-muted-foreground">{cat.count} товар</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
