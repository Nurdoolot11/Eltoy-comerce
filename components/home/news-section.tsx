import Image from "next/image"
import Link from "next/link"
import { news } from "@/lib/data"
import { Reveal } from "@/components/reveal"

export function NewsSection() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Жаңылыктар</p>
            <h2 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
              Акыркы жаңылыктар
            </h2>
          </div>
          <Link href="/news" className="text-sm font-semibold text-primary hover:underline">
            Баарын көрүү →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {news.map((n, i) => (
            <Reveal key={n.id} delay={i * 40}>
              <Link
                href={`/news/${n.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={n.image || "/placeholder.svg"}
                    alt={n.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{n.category}</span>
                  <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary">{n.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{n.excerpt}</p>
                  <time className="mt-3 text-xs text-muted-foreground">{n.date}</time>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
