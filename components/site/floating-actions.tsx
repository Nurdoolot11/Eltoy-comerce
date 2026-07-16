"use client"

import { useEffect, useState } from "react"
import { ArrowUp, MessageCircle, Phone } from "lucide-react"

export function FloatingActions() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 md:bottom-6">
      <a
        href="https://wa.me/996700123456"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp аркылуу жазуу"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+996700123456"
        aria-label="Телефон чалуу"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
      >
        <Phone className="h-5 w-5" />
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Жогору көтөрүлүү"
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-all hover:border-primary hover:text-primary ${
          visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  )
}
