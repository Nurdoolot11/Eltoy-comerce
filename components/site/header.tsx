'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Phone,
  MapPin,
  X,
  GitCompareArrows,
  Truck,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { CartSheet } from '@/components/cart/cart-sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthDialog } from '@/components/auth/auth-dialog'

const navItems = [
  { title: 'Башкы бет', href: '/' },
  { title: 'Каталог', href: '/catalog' },
  { title: 'Биз жөнүндө', href: '/about' },
  { title: 'Жаңылыктар', href: '/news' },
  { title: 'Байланышуу', href: '/contact' },
]

const contactInfo = {
  address: 'Бишкек ш., Лев Толстой көч. 21',
  hours: 'Пн-Сб: 08:00 - 18:00',
  phone: '+996 555 123 456',
}

export function Header() {
  const router = useRouter()
  const { cartCount, wishlist, compare } = useCart()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Логотип жана сайттын аты үчүн стейттер
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('ELTOY STROY')

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Настройкаларды localStorage'дан окуп алуу
  useEffect(() => {
    const saved = localStorage.getItem('eltoy_settings')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.siteName) setSiteName(data.siteName)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="bg-muted/50 border-b border-border/40 text-xs py-1.5 hidden md:block">
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" /> {contactInfo.address}
            </span>
            <span>{contactInfo.hours}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-foreground transition">
              <Phone className="size-3.5 text-primary" /> {contactInfo.phone}
            </a>
            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : '/account'} className="hover:text-foreground transition">
                {user.name}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          'border-b border-border/60 transition-all duration-300',
          scrolled ? 'glass shadow-lg' : 'bg-background'
        )}
      >
        <div className="container-px mx-auto flex max-w-7xl items-center gap-4 py-3">
          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="lg:hidden p-2 hover:bg-muted rounded-md transition" aria-label="Меню">
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Негизги меню</SheetTitle>
              <MobileMenu logoUrl={logoUrl} siteName={siteName} onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* ТОГОЛОК ЖАНА ЖЫЛДЫРЫЛМА ЛОГОТИП */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {logoUrl ? (
              <div className="relative size-11 rounded-full overflow-hidden border-2 border-primary/30 shadow-sm bg-background flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="size-full object-cover object-center"
                />
              </div>
            ) : null}
            <span className="font-extrabold text-xl tracking-wider text-primary uppercase">
              {siteName}
            </span>
          </Link>

          {/* Search bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Издөө..."
                className="w-full rounded-full border border-input bg-background px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </form>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            <Link href="/track" className="relative">
              <Button variant="ghost" size="icon" aria-label="Отслеживание">
                <Truck className="size-5" />
              </Button>
            </Link>

            <Link href="/compare" className="relative hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Салыштыруу">
                <GitCompareArrows className="size-5" />
              </Button>
              {compare.length > 0 && <Badge>{compare.length}</Badge>}
            </Link>

            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon" aria-label="Тандалгандар">
                <Heart className="size-5" />
              </Button>
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Link>

            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : '/account'} className="hidden sm:inline-flex">
                <Button variant="ghost" size="icon" aria-label="Кабинет">
                  <User className="size-5" />
                </Button>
              </Link>
            ) : (
              <AuthDialog>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Кирүү">
                  <User className="size-5" />
                </Button>
              </AuthDialog>
            )}

            <CartSheet>
              <Button variant="ghost" size="icon" className="relative" aria-label="Себет">
                <ShoppingCart className="size-5" />
                {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </Button>
            </CartSheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {children}
    </span>
  )
}

function MobileMenu({
  logoUrl,
  siteName,
  onNavigate,
}: {
  logoUrl: string | null
  siteName: string
  onNavigate: () => void
}) {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        {logoUrl ? (
          <div className="size-10 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center">
            <img src={logoUrl} alt={siteName} className="size-full object-cover object-center" />
          </div>
        ) : null}
        <span className="font-bold text-lg text-primary">{siteName}</span>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="text-sm font-medium hover:text-primary py-2 transition"
          >
            {item.title}
          </Link>
        ))}
        <Link
          href="/track"
          onClick={onNavigate}
          className="text-sm font-medium hover:text-primary py-2 transition flex items-center gap-2 text-amber-500"
        >
          <Truck className="size-4" /> Заказды көзөмөлдөө
        </Link>
      </nav>
    </div>
  )
}