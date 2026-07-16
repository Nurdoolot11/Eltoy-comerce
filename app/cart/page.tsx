'use client'
import Link from 'next/link'
import Image from 'next/image'
import { SiteShell } from '@/components/site/site-shell'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { formatSom } from '@/lib/data'
export default function CartPage(){const {items,getProductById,cartTotal,removeFromCart}=useCart();return <SiteShell><div className="container-px mx-auto max-w-4xl py-10"><h1 className="mb-8 font-mono text-4xl font-bold uppercase">Себет</h1><div className="flex flex-col gap-4">{items.map(i=>{const p=getProductById(i.id);return p?<div key={i.id} className="flex items-center gap-4 rounded-2xl border bg-card p-4"><Image src={p.image} alt={p.name} width={80} height={80} className="size-20 rounded-xl bg-secondary object-contain"/><div className="flex-1"><Link href={`/product/${p.slug}`} className="font-semibold hover:text-primary">{p.name}</Link><p className="text-sm text-muted-foreground">{i.quantity} × {formatSom(p.price)}</p></div><b>{formatSom(p.price*i.quantity)}</b><Button variant="ghost" onClick={()=>removeFromCart(i.id)}>Өчүрүү</Button></div>:null})}</div>{items.length?<div className="mt-6 flex items-center justify-between rounded-2xl bg-secondary p-5"><b className="text-xl">{formatSom(cartTotal)}</b><Button render={<Link href="/checkout" />}>Заказ берүү</Button></div>:<p className="text-muted-foreground">Себет бош.</p>}</div></SiteShell>}
