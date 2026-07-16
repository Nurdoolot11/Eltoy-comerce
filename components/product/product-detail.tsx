'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { useCart } from '@/components/cart/cart-provider'
import { formatSom, getBrandName, products, type Product } from '@/lib/data'

export function ProductDetail({ product }: { product: Product }) {
 const [active, setActive] = useState(product.image); const [quantity,setQuantity]=useState(1); const { addToCart }=useCart()
 const related=products.filter(p=>p.category===product.category&&p.id!==product.id).slice(0,4)
 return <div className="container-px mx-auto max-w-7xl py-8">
  <p className="mb-6 text-sm text-muted-foreground">Каталог / {getBrandName(product.brand)} / {product.name}</p>
  <div className="grid gap-8 lg:grid-cols-2">
   <div className="flex flex-col gap-3"><div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary"><Image src={active} alt={product.name} fill className="object-contain p-8" priority/></div><div className="grid grid-cols-4 gap-3">{product.gallery.map((src,i)=><button key={`${src}-${i}`} onClick={()=>setActive(src)} className="relative aspect-square overflow-hidden rounded-xl border bg-secondary"><Image src={src} alt={`${product.name} ${i+1}`} fill className="object-contain p-2"/></button>)}</div></div>
   <div className="flex flex-col gap-6 lg:py-4"><div><p className="font-mono uppercase tracking-widest text-primary">{getBrandName(product.brand)}</p><h1 className="mt-2 text-balance font-mono text-3xl font-bold uppercase md:text-5xl">{product.name}</h1><div className="mt-3 flex items-center gap-3 text-sm"><span className="flex items-center gap-1"><Star className="size-4 fill-primary text-primary"/>{product.rating}</span><span className="text-muted-foreground">{product.reviewsCount} пикир</span><span className="text-muted-foreground">SKU: {product.sku}</span></div></div>
   <p className="leading-relaxed text-muted-foreground">{product.description}</p>
   <div className="flex items-end gap-3"><strong className="text-3xl">{formatSom(product.price)}</strong>{product.oldPrice&&<span className="text-lg text-muted-foreground line-through">{formatSom(product.oldPrice)}</span>}</div>
   <p className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary"/>Складда {product.stock} даана бар</p>
   <div className="flex gap-3"><div className="flex items-center rounded-full border"><Button variant="ghost" size="icon" onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus/></Button><span className="w-10 text-center">{quantity}</span><Button variant="ghost" size="icon" onClick={()=>setQuantity(Math.min(product.stock,quantity+1))}><Plus/></Button></div><Button size="lg" className="flex-1" onClick={()=>addToCart(product.id,quantity)}><ShoppingCart data-icon="inline-start"/>Себетке кошуу</Button></div>
   <div className="grid gap-3 sm:grid-cols-2"><div className="flex gap-3 rounded-xl border p-4"><Truck className="size-5 text-primary"/><div><b>Тез жеткирүү</b><p className="text-sm text-muted-foreground">Бишкекте 24 саатта</p></div></div><div className="flex gap-3 rounded-xl border p-4"><ShieldCheck className="size-5 text-primary"/><div><b>Расмий кепилдик</b><p className="text-sm text-muted-foreground">24 айга чейин</p></div></div></div>
  </div></div>
  <section className="mt-14"><h2 className="mb-5 font-mono text-2xl font-bold uppercase">Мүнөздөмөлөр</h2><div className="overflow-hidden rounded-2xl border">{product.specs.map((s,i)=><div key={s.label} className={`flex justify-between gap-4 p-4 ${i%2?'bg-card':'bg-secondary/40'}`}><span className="text-muted-foreground">{s.label}</span><b>{s.value}</b></div>)}</div></section>
  {related.length>0&&<section className="mt-14"><h2 className="mb-5 font-mono text-2xl font-bold uppercase">Окшош товарлар</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
 </div>
}
