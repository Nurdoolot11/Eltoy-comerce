'use client'

import { useRef, useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/data"
import { DynamicIcon } from "@/components/dynamic-icon"
import { Reveal } from "@/components/reveal"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CategoryGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Сенсордук (мыш менен кармап сүрүү) логикасы
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDown(true)
    setIsDragging(false)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDown(false)
  }

  const handleMouseUp = () => {
    setIsDown(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.8 // Сүрүү ылдамдыгы
    if (Math.abs(walk) > 5) {
      setIsDragging(true)
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 border-b border-border/40 select-none">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Категориялар</p>
          <h2 className="font-mono text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
            Категория боюнча тандаңыз
          </h2>
        </div>

        {/* СҮРҮҮ БАСКЫЧТАРЫ */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary active:scale-95"
            aria-label="Солго сүрүү"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary active:scale-95"
            aria-label="Оңго сүрүү"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 🔴 ТОЛУК СЕНСОРДУК / ЧЫЧКАН МЕНЕН КАРМАП СҮРМӨ ТИЛКЕ */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-start gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none cursor-grab active:cursor-grabbing ${
          isDown ? 'scroll-auto' : 'scroll-smooth'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 30}>
            <Link
              href={`/catalog?category=${cat.slug}`}
              onClick={(e) => {
                // Эгер кармап сүрүп жаткан болсо, шилтемеге өтүп кетпеши үчүн
                if (isDragging) e.preventDefault()
              }}
              className="group flex flex-col items-center gap-2 shrink-0 w-24 text-center pointer-events-auto"
            >
              {/* ТЕГЕРЕК СҮРӨТЧӨ */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-card shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-md overflow-hidden p-3">
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    draggable={false}
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-110 pointer-events-none" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary pointer-events-none">
                    <DynamicIcon name={cat.icon} className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* АТЫ */}
              <span className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors pointer-events-none">
                {cat.name}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}