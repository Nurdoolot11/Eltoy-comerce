import type { ReactNode } from "react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { MobileNav } from "@/components/site/mobile-nav"
import { FloatingActions } from "@/components/site/floating-actions"

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <FloatingActions />
    </div>
  )
}
