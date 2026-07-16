import { advantages } from "@/lib/data"
import { DynamicIcon } from "@/components/dynamic-icon"
import { Reveal } from "@/components/reveal"

export function Advantages() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Эмне үчүн биз</p>
        <h2 className="font-mono text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl text-balance">
          ELTOY STROY артыкчылыктары
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {advantages.map((a, i) => (
          <Reveal key={a.title} delay={i * 50}>
            <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DynamicIcon name={a.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
