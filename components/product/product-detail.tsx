'use client'

import { useState, useEffect } from 'react'
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck, Play, X, Maximize2, Heart, GitCompareArrows } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { useCart } from '@/components/cart/cart-provider'
import { formatSom, getBrandName, products as staticProducts } from '@/lib/data'
import { cn, getOptimizedImageUrl, getOptimizedVideoUrl } from '@/lib/utils'

export function ProductDetail({ product }: { product: any }) {
  const safeImage = getOptimizedImageUrl(product.image || product.image_url)
  const videoUrl = product.video_url || product.video || null

  const rawGallery = Array.isArray(product.gallery) && product.gallery.length > 0 
    ? product.gallery 
    : (Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || product.image_url])

  const galleryImages = rawGallery.map((img: string) => getOptimizedImageUrl(img))

  const [active, setActive] = useState(safeImage)
  const [quantity, setQuantity] = useState(1)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  
  // Cart, Wishlist жана Compare контекстин алуу
  const { addToCart, toggleWishlist, toggleCompare, wishlist, compare } = useCart()
  const inWishlist = wishlist.includes(product.id)
  const inCompare = compare.includes(product.id)

  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [currentUser, setCurrentUser] = useState('Урматтуу кардар')

  useEffect(() => {
    setActive(safeImage)
  }, [safeImage])

  useEffect(() => {
    const savedReviews = localStorage.getItem('eltoy_reviews')
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    }

    const savedUser = localStorage.getItem('eltoy_user_name') || localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.name) setCurrentUser(parsed.name)
        else if (typeof savedUser === 'string') setCurrentUser(savedUser)
      } catch {
        setCurrentUser(savedUser)
      }
    }
  }, [])

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment) return

    const newReview = {
      id: `rev-${Date.now()}`,
      author: currentUser,
      productName: product.name || product.title,
      rating: Number(rating),
      comment,
      status: 'опубликовано',
      createdAt: new Date().toLocaleDateString('ru-RU')
    }

    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem('eltoy_reviews', JSON.stringify(updated))

    setComment('')
    alert('Пикир ийгиликтүү кошулду жана сайтка чыкты!')
  }

  const productName = product.name || product.title || 'Товар'
  const productCategory = product.category || 'Жалпы'
  const productStock = product.stock ?? product.in_stock ?? 10
  const productRating = product.rating || 5
  const productSpecs = Array.isArray(product.specs) ? product.specs : []

  const related = (staticProducts || []).filter(p => p.category === productCategory && p.id !== product.id).slice(0, 4)
  const productReviews = reviews.filter((r: any) => r.productName === productName && r.status === 'опубликовано')

  // 🎬 Шилтеме түрүнө жараша видео/embed форматтарын иштеп чыгуу
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('instagram.com')) {
      const cleanUrl = url.split('?')[0].replace(/\/$/, '')
      return `${cleanUrl}/embed`
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1`
    }
    return getOptimizedVideoUrl(url)
  }

  const isIframeVideo = videoUrl && (videoUrl.includes('instagram.com') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))

  return (
    <div className="container-px relative mx-auto max-w-7xl py-8">
      <p className="mb-6 text-sm text-muted-foreground">Каталог / {getBrandName(product.brand)} / {productName}</p>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Сол тарап: Башкы сүрөт + Pinduoduo стилиндеги видео карточка */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/40">
            <img 
              src={active} 
              alt={productName} 
              className="h-full w-full object-contain p-8"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/placeholder.svg'
              }}
            />

            {/* 🎬 PINDUODUO СТИЛИНДЕГИ КИЧИНЕКЕЙ ВЕРТИКАЛДУУ ВИДЕО КАРТОЧКА */}
            {videoUrl && (
              <div 
                onClick={() => setIsVideoModalOpen(true)}
                className="group absolute bottom-4 right-4 z-10 flex h-36 w-24 cursor-pointer overflow-hidden rounded-2xl border-2 border-white/90 bg-black shadow-2xl transition-all duration-300 hover:scale-105 hover:border-primary md:h-44 md:w-28"
                title="Чоңойтуп көрүү үчүн басыңыз"
              >
                {isIframeVideo ? (
                  <iframe
                    src={getVideoEmbedUrl(videoUrl)}
                    className="pointer-events-none size-full scale-125 object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  />
                ) : (
                  <video
                    src={getOptimizedVideoUrl(videoUrl)}
                    poster={getOptimizedImageUrl(videoUrl)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="pointer-events-none size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                )}

                {/* Басканга чакырган Play сөлөкөтү */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                  <div className="flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 size-4 fill-white" />
                  </div>
                </div>

                {/* Чоңойтуу сөлөкөтү */}
                <div className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-80 backdrop-blur-md">
                  <Maximize2 className="size-3" />
                </div>
              </div>
            )}
          </div>

          {/* Галерея */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((src: string, i: number) => (
                <button 
                  key={`${src}-${i}`} 
                  onClick={() => setActive(src)} 
                  className={`relative aspect-square overflow-hidden rounded-xl border bg-secondary/40 transition ${active === src ? 'ring-2 ring-primary' : ''}`}
                >
                  <img 
                    src={src} 
                    alt={`${productName} ${i+1}`} 
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/placeholder.svg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Оң тарап: Маалыматтар */}
        <div className="flex flex-col gap-6 lg:py-4">
          <div>
            <p className="font-mono uppercase tracking-widest text-primary">{getBrandName(product.brand)}</p>
            <h1 className="mt-2 text-balance font-mono text-3xl font-bold uppercase md:text-5xl">{productName}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Star className="size-4 fill-primary text-primary"/>{productRating}</span>
              <span className="text-muted-foreground">{product.reviewsCount || productReviews.length} пикир</span>
              <span className="text-muted-foreground">SKU: {product.sku || product.id?.slice(0, 8)}</span>
            </div>
          </div>
          
          <p className="leading-relaxed text-muted-foreground">{product.description || 'Товардын сүрөттөмөсү даярдалууда.'}</p>
          
          <div className="flex items-end gap-3">
            <strong className="text-3xl">{formatSom(product.price || 0)}</strong>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatSom(product.oldPrice)}</span>}
          </div>
          
          <p className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-primary"/>
            {productStock > 0 ? `Складда ${productStock} даана бар` : 'Түгөндү'}
          </p>
          
          {/* САНЫ ЖАНА КНОПКАЛАР (СЕБЕТ, ЖҮРӨКЧӨ, САЛЫШТЫРУУ) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border bg-background">
              <Button variant="ghost" size="icon" className="rounded-l-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus/></Button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <Button variant="ghost" size="icon" className="rounded-r-full" onClick={() => setQuantity(Math.min(productStock || 99, quantity + 1))}><Plus/></Button>
            </div>

            <Button size="lg" className="flex-1 rounded-full font-bold" onClick={() => addToCart(product.id, quantity)}>
              <ShoppingCart className="mr-2 size-5"/>Себетке кошуу
            </Button>

            {/* Избранное баскычы */}
            <Button
              variant="outline"
              size="icon"
              className={cn("size-12 rounded-full border-2 transition", inWishlist && "bg-primary/10 border-primary text-primary")}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Избранное"
              title="Тандалгандарга кошуу"
            >
              <Heart className={cn("size-5", inWishlist && "fill-primary text-primary")} />
            </Button>

            {/* Салыштыруу баскычы */}
            <Button
              variant="outline"
              size="icon"
              className={cn("size-12 rounded-full border-2 transition", inCompare && "bg-primary/10 border-primary text-primary")}
              onClick={() => toggleCompare(product.id)}
              aria-label="Салыштыруу"
              title="Салыштырууга кошуу"
            >
              <GitCompareArrows className={cn("size-5", inCompare && "text-primary")} />
            </Button>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border p-4">
              <Truck className="size-5 text-primary"/>
              <div><b>Тез жеткирүү</b><p className="text-sm text-muted-foreground">Бишкекте 24 саатта</p></div>
            </div>
            <div className="flex gap-3 rounded-xl border p-4">
              <ShieldCheck className="size-5 text-primary"/>
              <div><b>Расмий кепилдик</b><p className="text-sm text-muted-foreground">24 айга чейин</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 ВИДЕО БАСЫЛГАНДА ЧОҢОЮП АЧЫЛАТ (Popup Modal) */}
      {isVideoModalOpen && videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-black shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-black/70 text-white transition hover:bg-destructive"
              aria-label="Жабуу"
            >
              <X className="size-6" />
            </button>

            <div className="relative aspect-[9/16] max-h-[80vh] w-full mx-auto flex items-center justify-center bg-black">
              {isIframeVideo ? (
                <iframe
                  src={getVideoEmbedUrl(videoUrl)}
                  className="size-full rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={getOptimizedVideoUrl(videoUrl)}
                  poster={getOptimizedImageUrl(videoUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="size-full rounded-2xl object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* МҮНӨЗДӨМӨЛӨР */}
      {productSpecs.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-mono text-2xl font-bold uppercase">Мүнөздөмөлөр</h2>
          <div className="overflow-hidden rounded-2xl border">
            {productSpecs.map((s: any, i: number) => (
              <div key={s.label || i} className={`flex justify-between gap-4 p-4 ${i % 2 ? 'bg-card' : 'bg-secondary/40'}`}>
                <span className="text-muted-foreground">{s.label}</span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ОТЗЫВДАР */}
      <section className="mt-16 border-t pt-10 space-y-8">
        <h2 className="font-mono text-2xl font-bold uppercase">Кардарлардын пикирлери</h2>

        <form onSubmit={handleReviewSubmit} className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Бул товар боюнча пикир калтыруу</h3>
            <span className="text-xs text-muted-foreground">Катарыңыз: <b className="text-primary">{currentUser}</b></span>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">Баалоо</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-semibold h-10 mt-1"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 - Мыкты)</option>
              <option value="4">⭐⭐⭐⭐ (4 - Жакшы)</option>
              <option value="3">⭐⭐⭐ (3 - Орточо)</option>
              <option value="2">⭐⭐ (2 - Начар)</option>
              <option value="1">⭐ (1 - Жаман)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Пикирдин тексти</label>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Товардын сапаты тууралуу пикир жазыңыз..."
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] mt-1"
              required 
            />
          </div>

          <Button type="submit" className="font-bold">Пикирди жөнөтүү</Button>
        </form>

        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Бул товарга азырынча пикирлер жок.</p>
          ) : (
            productReviews.map((rev: any) => (
              <div key={rev.id} className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">{rev.author}</span>
                  <span className="text-xs text-muted-foreground">{rev.createdAt}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-base ${i < rev.rating ? 'text-amber-400' : 'text-muted'}`}>★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ОКШОШ ТОВАРЛАР */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-mono text-2xl font-bold uppercase">Окшош товарлар</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </section>
      )}
    </div>
  )
}