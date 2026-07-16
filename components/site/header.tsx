'use client'

import Link from 'next/link'
import Image from 'next/image'
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
} from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { mainNav, contact } from '@/lib/nav'
import { products, formatSom, getBrandName } from '@/lib/data'
import { CartSheet } from '@/components/cart/cart-sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthDialog } from '@/components/auth/auth-dialog'

export function Header() {
  const router = useRouter()
  const { cartCount, wishlist, compare } = useCart()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const suggestions = query.trim().length > 1
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            getBrandName(p.brand).toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : []

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`)
      setFocused(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden border-b border-border/60 bg-card/80 text-xs text-muted-foreground lg:block">
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" /> {contact.address}
            </span>
            <span>{contact.hours}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-primary">
              <Phone className="size-3.5 text-primary" /> {contact.phone}
            </a>
            {user ? <Link href={user.role === 'admin' ? '/admin' : '/account'} className="hover:text-primary">{user.name}</Link> : <AuthDialog><button className="hover:text-primary">Жеке кабинет</button></AuthDialog>}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          'border-b border-border/60 transition-all duration-300',
          scrolled ? 'glass shadow-lg' : 'bg-background',
        )}
      >
        <div className="container-px mx-auto flex max-w-7xl items-center gap-4 py-3">
          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Меню" />}>
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Негизги меню</SheetTitle>
              <MobileMenu onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Logo />

          {/* Search */}
          <div ref={searchRef} className="relative hidden flex-1 md:block">
            <form onSubmit={submitSearch}>
              <div className="flex items-center overflow-hidden rounded-full border border-border bg-secondary/60 focus-within:border-primary">
                <Search className="ml-4 size-4 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  placeholder="Инструмент, бренд же категория издөө..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                  aria-label="Издөө"
                />
                <button
                  type="submit"
                  className="m-1 rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Издөө
                </button>
              </div>
            </form>
            {focused && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => setFocused(false)}
                    className="flex items-center gap-3 border-b border-border/50 p-3 last:border-0 hover:bg-accent"
                  >
                    <Image
                      src={p.image || '/placeholder.svg'}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="size-12 rounded-lg bg-secondary object-contain p-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{getBrandName(p.brand)}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatSom(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
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
            {user ? <Link href={user.role === 'admin' ? '/admin' : '/account'} className="hidden sm:inline-flex"><Button variant="ghost" size="icon" aria-label="Кабинет"><User className="size-5" /></Button></Link> : <AuthDialog><Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Кирүү"><User className="size-5" /></Button></AuthDialog>}
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative" aria-label="Себет">
                <ShoppingCart className="size-5" />
                {cartCount > 0 && <Badge>{cartCount}</Badge>}
              </Button>
            </CartSheet>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-border/40 lg:block">
          <div className="container-px mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto py-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="border-b border-border/60 bg-background p-2 md:hidden">
        <form onSubmit={submitSearch} className="flex items-center overflow-hidden rounded-full border border-border bg-secondary/60">
          <Search className="ml-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Издөө..."
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            aria-label="Издөө"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="pr-3" aria-label="Тазалоо">
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </form>
      </div>
    </header>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {children}
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex shrink-0 items-center gap-2', className)}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-mono text-lg font-bold text-primary-foreground">
        ES
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-lg font-bold tracking-tight">ELTOY STROY</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Professional Tools
        </span>
      </span>
    </Link>
  )
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-2 border-t border-border p-4 text-sm">
        <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-medium">
          <Phone className="size-4 text-primary" /> {contact.phone}
        </a>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 text-primary" /> {contact.address}
        </p>
      </div>
    </div>
  )
}
