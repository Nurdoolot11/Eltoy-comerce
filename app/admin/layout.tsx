'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  ShieldCheck,
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

  useEffect(() => {
    if (ready) {
      // Эгер кирбеген болсо же ролу 'admin' болбосо, кадимки сайтка кайтарат
      if (!user || user.role !== 'admin') {
        router.push('/')
      }
    }
  }, [user, ready, router])

  if (!ready || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">Админ панелге кирүү текшерилүүдө...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* СОЛ ЖАКТАГЫ АДМИН МЕНЮ (SIDEBAR) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 border-b pb-4">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="font-mono text-base font-bold uppercase tracking-wider">ELTOY ADMIN</h2>
              <p className="text-xs text-muted-foreground">Башкаруу борбору</p>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* АЛДЫҢКЫ БӨЛҮК: САЙТКА КАЙТУУ ЖАНА ЧЫГУУ */}
        <div className="border-t pt-4 space-y-2">
         <Link href="/" className="w-full">
  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-xs">
    <Store className="size-4" />
    Дүкөнгө өтүү (Сайт)
  </Button>
</Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 rounded-xl text-xs text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Аккаунттан чыгуу
          </Button>
        </div>
      </aside>

      {/* ОҢ ЖАКТАГЫ НЕГИЗГИ АРАМЕК ЖУМУШЧУ ТАЛАА */}
      <main className="pl-64 flex-1">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}