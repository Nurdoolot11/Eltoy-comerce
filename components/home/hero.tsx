import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stats } from "@/lib/data"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-main.png"
          alt="Профессионалдык шаймандар"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Кыргызстандагы №1 инструмент дүкөнү
          </div>

          <h1 className="font-mono text-4xl font-bold uppercase leading-[1.05] tracking-tight text-foreground text-balance md:text-6xl">
            Профессионалдык <span className="text-primary">шаймандар</span> жана курулуш жабдуулары
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Bosch, Makita, DeWalt, Milwaukee жана дагы дүйнөлүк бренддер. 100% түп нуска, расмий кепилдик жана тез
            жеткирүү менен.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/catalog" />}
              size="lg"
              className="h-12 gap-2 px-6 text-sm font-semibold uppercase tracking-wide"
            >
              Каталогго өтүү
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/brands" />}
              size="lg"
              variant="outline"
              className="h-12 border-border bg-transparent px-6 text-sm font-semibold uppercase tracking-wide"
            >
              Бренддер
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Расмий кепилдик
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              24 сааттын ичинде жеткирүү
            </span>
          </div>
        </div>

        <div className="hidden md:block" />
      </div>

      <div className="relative border-t border-border bg-card/50 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center">
              <div className="font-mono text-2xl font-bold text-primary md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}