'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  ShieldCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'

const adminNav = [
  { title: 'Дашборд', href: '/admin', icon: LayoutDashboard },
  { title: 'Товарлар', href: '/admin/products', icon: Package },
  { title: 'Заказдар', href: '/admin/orders', icon: ShoppingCart },
  { title: 'Кардарлар', href: '/admin/customers', icon: Users },
  { title: 'Настройкалар', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (ready) {
      if (!user || user.role !== 'admin') {
        router.push('/')
      }
    }
  }, [user, ready, router])

  // Барак которулганда мобилдик менюну автоматтык түрдө жабуу
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (!ready || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-3 bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-800 shadow-xl">
          <ShieldCheck className="size-6 text-amber-500 animate-spin" />
          <p className="text-sm font-medium tracking-wide">Админ панелге кирүү текшерилүүдө...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
      
      {/* МОБИЛДИК ЖОГОРКУ ШАПКА (Телефондор үчүн) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-2 text-slate-950 shadow-md shadow-orange-500/20">
            <ShieldCheck className="size-5 font-bold" />
          </div>
          <div>
            <span className="font-extrabold uppercase tracking-wider text-xs block text-slate-100">ELTOY ADMIN</span>
            <span className="text-[10px] text-slate-400">Башкаруу панели</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-300 hover:bg-slate-800"
          aria-label="Менюну ачуу"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* КАПТАЛДАГЫ МЕНЮ (SIDEBAR) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 pt-20 lg:pt-5' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* Логотип Блогу */}
          <div className="hidden lg:flex items-center gap-3 px-2 border-b border-slate-800 pb-5">
            <div className="rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-2 text-slate-950 shadow-lg shadow-orange-500/20">
              <ShieldCheck className="size-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-wider text-slate-100">ELTOY ADMIN</h2>
              <p className="text-[11px] font-medium text-slate-400">Башкаруу борбору</p>
            </div>
          </div>

          {/* Навигациялык меню */}
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5 text-amber-400" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* АЛДЫҢКЫ БӨЛҮК: САЙТКА КАЙТУУ ЖАНА ЧЫГУУ */}
        <div className="border-t border-slate-800/80 pt-4 space-y-2">
          <Link href="/" className="w-full block">
            <Button variant="outline" className="w-full justify-start gap-2.5 rounded-xl text-xs bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition">
              <Store className="size-4 text-amber-500" />
              Дүкөнгө өтүү (Сайт)
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Аккаунттан чыгуу
          </Button>
        </div>
      </aside>

      {/* МОБИЛДИК ФОНДУ КАРАҢГАТУУ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ОҢ ЖАКТАГЫ НЕГИЗГИ ЖУМУШЧУ ТАЛАА */}
      <main className="flex-1 lg:pl-64 w-full pt-16 lg:pt-0 bg-slate-950">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}