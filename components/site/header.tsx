'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useMemo } from 'react'
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
  Wrench,
  Zap,
  Hammer,
  ChevronRight,
  Sparkles,
  Percent,
  CheckCircle2,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { CartSheet } from '@/components/cart/cart-sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { supabase } from '@/lib/supabase'
import { products, formatSom } from '@/lib/data'

const navItems = [
  { title: 'Башкы бет', href: '/' },
  { title: 'Каталог', href: '/catalog' },
  { title: 'Биз жөнүндө', href: '/about' },
  { title: 'Жаңылыктар', href: '/news' },
  { title: 'Байланышуу', href: '/contact' },
]

// ИНСТРУМЕНТТЕРДИН ЖАНА КАТЕГОРИЯЛАРДЫН ТЕГЕРЕК СҮРӨТЧӨЛӨРҮ (SHEIN СТИЛИНДЕ)
const toolCategories = [
  { title: 'Скидкалар & Акциялар', href: '/catalog?sale=true', icon: Percent, color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { title: 'Перфораторлор & Дреллер', href: '/catalog?cat=perforator', icon: Hammer, color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  { title: 'Шуруповерттер', href: '/catalog?cat=screwdriver', icon: Wrench, color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  { title: 'Электр инструменттер', href: '/catalog?cat=power-tools', icon: Zap, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  { title: 'Жаңы келгендер', href: '/catalog?sort=new', icon: Sparkles, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
]

export function Header() {
  const router = useRouter()
  const { cartCount, wishlist, compare } = useCart()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('ELTOY STROY')
  const [contactInfo, setContactInfo] = useState({
    address: 'Бишкек ш., Лев Толстой көч. 21',
    hours: 'Пн-Сб: 08:00 - 18:00',
    phone: '+996 555 123 456',
  })

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchHeaderSettings() {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single()

        if (data) {
          if (data.logo_url) setLogoUrl(data.logo_url)
          if (data.site_name) setSiteName(data.site_name)
          setContactInfo({
            address: data.address || 'Бишкек ш., Лев Толстой көч. 21',
            hours: data.hours || 'Пн-Сб: 08:00 - 18:00',
            phone: data.phone || '+996 555 123 456',
          })
        }
      } catch (err) {
        console.error('Header настройкаларын жүктөөдө ката:', err)
      }
    }

    fetchHeaderSettings()
  }, [])

  // Акылдуу автосунуштар (Башынан башталып же так дал келгендерди биринчи чыгарчу кылып түзөтүлдү)
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const term = query.toLowerCase().trim()
    
    // 1. Биринчи кезекте аты ошол тамгадан башталгандарды табабыз (startsWith)
    const startsWithMatches = products.filter(p => 
      p.name.toLowerCase().trim().startsWith(term)
    )

    // 2. Андан кийин ичинен камтыгандарды табабыз (includes)
    const includesMatches = products.filter(p => 
      !p.name.toLowerCase().trim().startsWith(term) && 
      p.name.toLowerCase().includes(term)
    )

    // Башынан башталгандарын алдыга коюп бириктиребиз
    return [...startsWithMatches, ...includesMatches].slice(0, 5)
  }, [query])

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
          {/* Mobile menu Button */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="lg:hidden p-2 hover:bg-muted rounded-md transition" aria-label="Меню">
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[380px] p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Негизги меню</SheetTitle>
              <MobileMenu logoUrl={logoUrl} siteName={siteName} onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* ЛОГОТИП */}
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
                placeholder="Инструменттерди издөө (мисалы: д, дрель)..."
                className="w-full rounded-full border border-input bg-background px-4 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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

            {/* Автоматтык сунуштар асма тизмеси (Автозаполнение) */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-50 text-neutral-900">
                <div className="bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-700 flex items-center gap-1.5 border-b border-rose-100">
                  <CheckCircle2 className="size-3.5 text-rose-600" /> Сунушталган шаймандар:
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setQuery(item.name)
                      router.push(`/catalog?q=${encodeURIComponent(item.name)}`)
                    }}
                    className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-rose-50/80 transition text-xs border-b border-border/40 last:border-none cursor-pointer bg-white"
                  >
                    <span className="font-extrabold text-neutral-900">{item.name}</span>
                    <span className="text-rose-600 font-black text-sm">{formatSom(item.price)}</span>
                  </button>
                ))}
              </div>
            )}
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

/* ЗАМАНБАП МЕНИЮ (SHEIN УСЛУГИ СТИЛИНДЕ) */
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
    <div className="flex flex-col h-full bg-background p-4 space-y-6">
      {/* Шапка меню */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="size-10 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center">
              <img src={logoUrl} alt={siteName} className="size-full object-cover" />
            </div>
          ) : null}
          <span className="font-extrabold text-lg text-primary uppercase">{siteName}</span>
        </div>
      </div>

      {/* 🟢 КАТЕГОРИЯЛАРДЫН ТЕГЕРЕК ИКОНКАЛАРЫ (SHEIN СТИЛИНДЕ) */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Категориялар</p>
        <div className="space-y-2">
          {toolCategories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={onNavigate}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-primary/50 transition group bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('size-10 rounded-full border flex items-center justify-center shrink-0 shadow-sm', cat.color)}>
                    <IconComponent className="size-5" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition">{cat.title}</span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition" />
              </Link>
            )
          })}
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Навигация шилтемелери */}
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Навигация</p>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="text-sm font-medium hover:text-primary py-2 px-1 transition flex items-center justify-between"
            >
              <span>{item.title}</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Link>
          ))}
          <Link
            href="/track"
            onClick={onNavigate}
            className="text-sm font-medium py-2 px-1 transition flex items-center gap-2 text-amber-500 hover:text-amber-600"
          >
            <Truck className="size-4" /> Заказды көзөмөлдөө
          </Link>
        </nav>
      </div>
    </div>
  )
}