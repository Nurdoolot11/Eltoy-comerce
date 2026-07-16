import { Star } from "lucide-react"
import { reviews } from "@/lib/data"
import { Reveal } from "@/components/reveal"

export function ReviewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Пикирлер</p>
        <h2 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Кардарлар эмне дейт
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={i * 40}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${idx < r.rating ? "fill-primary text-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">{r.text}</blockquote>
              <figcaption className="mt-4 border-t border-border pt-4">
                <div className="font-semibold text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.city}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
