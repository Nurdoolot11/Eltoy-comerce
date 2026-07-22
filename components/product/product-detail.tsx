'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { useCart } from '@/components/cart/cart-provider'
import { formatSom, getBrandName, products, type Product } from '@/lib/data'

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = useState(product.image); 
  const [quantity, setQuantity] = useState(1); 
  const { addToCart } = useCart()

  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [currentUser, setCurrentUser] = useState('Урматтуу кардар')

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
      productName: product.name,
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

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const productReviews = reviews.filter((r: any) => r.productName === product.name && r.status === 'опубликовано')

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <p className="mb-6 text-sm text-muted-foreground">Каталог / {getBrandName(product.brand)} / {product.name}</p>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary">
            <Image src={active} alt={product.name} fill className="object-contain p-8" priority/>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.gallery.map((src, i) => (
              <button key={`${src}-${i}`} onClick={() => setActive(src)} className="relative aspect-square overflow-hidden rounded-xl border bg-secondary">
                <Image src={src} alt={`${product.name} ${i+1}`} fill className="object-contain p-2"/>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6 lg:py-4">
          <div>
            <p className="font-mono uppercase tracking-widest text-primary">{getBrandName(product.brand)}</p>
            <h1 className="mt-2 text-balance font-mono text-3xl font-bold uppercase md:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Star className="size-4 fill-primary text-primary"/>{product.rating}</span>
              <span className="text-muted-foreground">{product.reviewsCount} пикир</span>
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>
          </div>
          
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          
          <div className="flex items-end gap-3">
            <strong className="text-3xl">{formatSom(product.price)}</strong>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatSom(product.oldPrice)}</span>}
          </div>
          
          <p className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary"/>Складда {product.stock} даана бар</p>
          
          <div className="flex gap-3">
            <div className="flex items-center rounded-full border">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus/></Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus/></Button>
            </div>
            <Button size="lg" className="flex-1" onClick={() => addToCart(product.id, quantity)}>
              <ShoppingCart data-icon="inline-start"/>Себетке кошуу
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

      {/* МҮНӨЗДӨМӨЛӨР */}
      <section className="mt-14">
        <h2 className="mb-5 font-mono text-2xl font-bold uppercase">Мүнөздөмөлөр</h2>
        <div className="overflow-hidden rounded-2xl border">
          {product.specs.map((s, i) => (
            <div key={s.label} className={`flex justify-between gap-4 p-4 ${i % 2 ? 'bg-card' : 'bg-secondary/40'}`}>
              <span className="text-muted-foreground">{s.label}</span>
              <b>{s.value}</b>
            </div>
          ))}
        </div>
      </section>

      {/* ОТЗЫВДАР ЖАНА ПИКИР КАЛТЫРУУ БЛОГУ */}
      <section className="mt-16 border-t pt-10 space-y-8">
        <h2 className="font-mono text-2xl font-bold uppercase">Кардарлардын пикирлери</h2>

        <form onSubmit={handleReviewSubmit} className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Бул товар боюнча пикир калтыруу</h3>
            <span className="text-xs text-muted-foreground">Катарыңыз: <b className="text-primary">{currentUser}</b> катарында жазылат</span>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground">Баалоо (Жылдыз)</label>
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
              placeholder="Товардын сапаты тууралуу өз ойлоруңузду жазыңыз..."
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] mt-1"
              required 
            />
          </div>

          <Button type="submit" className="font-bold">Пикирди жөнөтүү</Button>
        </form>

        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Бул товарга азырынча сайтка чыккан пикирлер жок. Биринчи болуп пикир калтырыңыз!</p>
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