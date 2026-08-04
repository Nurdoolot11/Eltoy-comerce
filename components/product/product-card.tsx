'use client'

import Link from 'next/link'
import { Star, Heart, ShoppingCart, GitCompareArrows, Check } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { formatSom, getBrandName, discountPercent, type Product } from '@/lib/data'
import { cn, getOptimizedImageUrl } from '@/lib/utils'

const badgeLabels: Record<string, { label: string; className: string }> = {
  new: { label: 'Жаңы', className: 'bg-primary text-primary-foreground' },
  sale: { label: 'Арзандатуу', className: 'bg-destructive text-white' },
  popular: { label: 'Хит', className: 'bg-gold text-gold-foreground' },
  featured: { label: 'ТОП', className: 'bg-foreground text-background' },
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, toggleCompare, wishlist, compare } = useCart()
  const discount = discountPercent(product)
  const inWishlist = wishlist.includes(product.id)
  const inCompare = compare.includes(product.id)

  const productName = product.name || (product as any).title || 'Товар'
  
  // Медиа шилтемени автоматтык түрдө коопсуз сүрөткө айландыруу
  const rawMedia = product.image || (product as any).image_url || (product as any).video || (product as any).video_url
  const displayImage = getOptimizedImageUrl(rawMedia)

  const productPath = `/product/${product.slug || product.id}`

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {(product.badges || []).slice(0, 2).map((b) => (
          <span
            key={b}
            className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', badgeLabels[b]?.className || 'bg-primary text-primary-foreground')}
          >
            {badgeLabels[b]?.label || b}
          </span>
        ))}
        {discount ? (
          <span className="rounded-full bg-destructive px-2.5 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        ) : null}
      </div>

      {/* Quick actions - эми дайыма көрүнүп турат жана клик туура иштейт */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className={cn(
            'grid size-9 place-items-center rounded-full border border-border bg-background/90 backdrop-blur transition hover:bg-primary hover:text-primary-foreground',
            inWishlist && 'bg-primary text-primary-foreground',
          )}
          aria-label="Тандалгандарга кошуу"
        >
          <Heart className={cn('size-4', inWishlist && 'fill-current')} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleCompare(product.id)
          }}
          className={cn(
            'grid size-9 place-items-center rounded-full border border-border bg-background/90 backdrop-blur transition hover:bg-primary hover:text-primary-foreground',
            inCompare && 'bg-primary text-primary-foreground',
          )}
          aria-label="Салыштырууга кошуу"
        >
          <GitCompareArrows className="size-4" />
        </button>
      </div>

      {/* Товардын Сүрөтү - 100% заматта ачылат, onError тутуму менен */}
      <Link href={productPath} className="relative block aspect-square overflow-hidden bg-secondary/40">
        <img
          src={displayImage}
          alt={productName}
          loading="lazy"
          className="h-full w-full object-cover p-2 transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Эгер сүрөттүн шилтемеси бузук болсо, ката чыгарбай placeholder коюу
            ;(e.target as HTMLImageElement).src = '/placeholder.svg'
          }}
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {getBrandName(product.brand)}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="font-semibold">{product.rating || 5}</span>
          </span>
        </div>

        <Link href={productPath}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-tight hover:text-primary">
            {productName}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {(product.stock ?? 1) > 0 || (product as any).in_stock ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <Check className="size-3.5" /> Складда бар
            </span>
          ) : (
            <span className="text-destructive">Түгөндү</span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <div className="mb-2 flex items-end gap-2">
            <span className="text-lg font-bold">{formatSom(product.price)}</span>
            {product.oldPrice ? (
              <span className="mb-0.5 text-sm text-muted-foreground line-through">
                {formatSom(product.oldPrice)}
              </span>
            ) : null}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="size-4" />
            Себетке кошуу
          </button>
        </div>
      </div>
    </div>
  )
}