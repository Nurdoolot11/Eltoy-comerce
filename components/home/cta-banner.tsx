import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-border">
        <Image src="/images/cta-banner.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="relative flex flex-col items-start gap-5 px-6 py-14 md:px-14 md:py-20">
          <h2 className="max-w-xl font-mono text-3xl font-bold uppercase leading-tight tracking-tight text-foreground text-balance md:text-5xl">
            Курулуш компанияларына <span className="text-primary">дүң баа</span>
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Бригадалар жана компаниялар үчүн атайын баалар, жеке менеджер жана ыңгайлуу жеткирүү шарттары.
          </p>
          <Button render={<Link href="/contact" />} size="lg" className="h-12 gap-2 px-6 text-sm font-semibold uppercase tracking-wide">
            Байланышуу
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
