'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-provider'
import { formatSom } from '@/lib/data'

export function CartSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { items, getProductById, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Себет {cartCount > 0 && `(${cartCount})`}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Себет бош</p>
              <p className="text-sm text-muted-foreground">Каталогдон товар тандаңыз</p>
            </div>
            <Button render={<Link href="/catalog" />} onClick={() => setOpen(false)}>Каталогго өтүү</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((item) => {
                const p = getProductById(item.id)
                if (!p) return null
                return (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                    <Image
                      src={p.image || '/placeholder.svg'}
                      alt={p.name}
                      width={72}
                      height={72}
                      className="size-18 shrink-0 rounded-lg bg-secondary object-contain p-1"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium hover:text-primary"
                      >
                        {p.name}
                      </Link>
                      <span className="mt-0.5 text-sm font-bold text-primary">{formatSom(p.price)}</span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 rounded-full border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="grid size-7 place-items-center rounded-full hover:bg-accent"
                            aria-label="Азайтуу"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="grid size-7 place-items-center rounded-full hover:bg-accent"
                            aria-label="Көбөйтүү"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Өчүрүү"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <SheetFooter className="border-t border-border">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Жалпы сумма:</span>
                <span className="text-lg font-bold">{formatSom(cartTotal)}</span>
              </div>
              <Button render={<Link href="/checkout" />} size="lg" className="w-full" onClick={() => setOpen(false)}>Заказ берүү</Button>
              <Button render={<Link href="/cart" />} variant="outline" className="w-full" onClick={() => setOpen(false)}>Себетти көрүү</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
