'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Percent, Sparkles, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    tag: "Чектелген сунуш",
    title: "ПЕРФОРАТОР ЖАНА ДРЕЛЛДЕРГЕ -20% СКИДКА",
    desc: "Bosch жана Makita профессионалдык курулуш шаймандарына атайын баалар.",
    buttonText: "Скидкаларды көрүү",
    link: "/catalog?sale=true",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
    image: "/images/hero-main.png", // Плакат сүрөтү
    icon: Percent,
  },
  {
    id: 2,
    tag: "АКЦИЯ",
    title: "1000 СОМДОН ЖОГОРКУ ЗАКАЗГА БЕКЕР ЖЕТКИРҮҮ",
    desc: "Бишкек шаары боюнча 24 сааттын ичинде эшигиңизге чейин жеткирип беребиз.",
    buttonText: "Заказ берүү",
    link: "/catalog",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    image: "/images/hero-main.png", // Каалаган фонодук сүрөттү койсоңуз болот
    icon: Truck,
  },
  {
    id: 3,
    tag: "ЖАҢЫ КЕЛГЕНДЕР",
    title: "DEWALT ЖАНА MILWAUKEE ЖАҢЫ МҮЛКҮ",
    desc: "100% түп нуска, расмий өндүрүүчүдөн 3 жылдык кепилдиги менен.",
    buttonText: "Каталогго өтүү",
    link: "/catalog?sort=new",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    image: "/images/hero-main.png", // Плакат сүрөтү
    icon: Sparkles,
  },
]

export function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background pt-4 pb-6">
      <div className="mx-auto max-w-7xl px-4">
        {/* 🔴 СЛАЙДЕР КОРПУСУ */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 md:p-12 shadow-xl">
          
          {/* 🖼️ АРТКЫ ПЛАКАТ СҮРӨТҮ ЖАНА ТУНУК ГРАДИЕНТ */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              priority
              className="object-cover object-right opacity-40 transition-opacity duration-700"
            />
            {/* Текст ачык көрүнүшү үчүн сол жагын караңгылатуучу градиент */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[220px] md:min-h-[260px]">
            <div>
              {/* АКЦИЯ / СКИДКА БЕЙДЖИГИ */}
              <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md ${slides[current].badgeColor}`}>
                <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                {slides[current].tag}
              </div>

              {/* ЧОҢ ТЕМА */}
              <h1 className="mt-4 font-mono text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-5xl max-w-2xl leading-tight drop-shadow-md">
                {slides[current].title}
              </h1>

              {/* СҮРӨТТӨМӨ */}
              <p className="mt-3 max-w-xl text-xs text-muted-foreground md:text-base leading-relaxed">
                {slides[current].desc}
              </p>
            </div>

            {/* БАСКЫЧТАР ЖАНА БАШКАРУУ */}
            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <Button
                nativeButton={false}
                render={<Link href={slides[current].link} />}
                size="lg"
                className="h-11 gap-2 rounded-xl px-6 text-xs md:text-sm font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                {slides[current].buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* СТРЕЛКАЛАР ЖАНА ЧЕКИТТЕР */}
              <div className="flex items-center gap-3 backdrop-blur-sm bg-background/30 p-1.5 rounded-full border border-border/40">
                <button
                  onClick={prevSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-all hover:border-primary hover:text-primary active:scale-90 shadow-sm"
                  aria-label="Мурунку баннер"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-1.5 px-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        current === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
                      }`}
                      aria-label={`Баннерге өтүү ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground transition-all hover:border-primary hover:text-primary active:scale-90 shadow-sm"
                  aria-label="Кийинки баннер"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🟢 КИЧИНЕ ИНФОРМАЦИЯЛЫК ТИЛКЕ */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">100% Түп нуска кепилдик</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
            <Truck className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">Тез жана ишенимдүү жеткирүү</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
            <Percent className="h-5 w-5 text-red-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">Ар дайым арзандатуулар</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
            <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">Премиум сапаттагы бренддер</span>
          </div>
        </div>
      </div>
    </section>
  )
}