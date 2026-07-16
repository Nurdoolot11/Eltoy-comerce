'use client'
import { SiteShell } from '@/components/site/site-shell'
import { useCart } from '@/components/cart/cart-provider'
import { ProductCard } from './product-card'
export function SavedProducts({mode}:{mode:'wishlist'|'compare'}){const cart=useCart();const ids=mode==='wishlist'?cart.wishlist:cart.compare;const items=ids.map(id=>cart.getProductById(id)).filter(Boolean);return <SiteShell><div className="container-px mx-auto max-w-7xl py-12"><h1 className="mb-8 font-mono text-4xl font-bold uppercase">{mode==='wishlist'?'Тандалган товарлар':'Салыштыруу'}</h1>{items.length?<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map(p=>p&&<ProductCard key={p.id} product={p}/>)}</div>:<div className="rounded-2xl border bg-card py-20 text-center text-muted-foreground">Азырынча товар кошулган жок.</div>}</div></SiteShell>}
