'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Башкы', icon: Home },
  { href: '/categories', label: 'Каталог', icon: LayoutGrid },
  { href: '/wishlist', label: 'Тандоо', icon: Heart, badgeKey: 'wishlist' as const },
  { href: '/cart', label: 'Себет', icon: ShoppingCart, badgeKey: 'cart' as const },
  { href: '/account', label: 'Кабинет', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { cartCount, wishlist } = useCart()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass lg:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href
          const count = item.badgeKey === 'cart' ? cartCount : item.badgeKey === 'wishlist' ? wishlist.length : 0
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <span className="relative">
                <Icon className="size-5" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
