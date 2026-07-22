'use client'

import { useState } from 'react'
import { Search, PackageCheck, Clock, MapPin, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'

export default function TrackPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const cleanQuery = query.trim().toUpperCase()

    // LocalStorage'дон бардык заказдарды издейбиз
    const localOrders: any[] = JSON.parse(localStorage.getItem('eltoy_orders') || '[]')
    const found = localOrders.find((o) => o.id && o.id.toUpperCase() === cleanQuery)

    if (found) {
      setOrder(found)
    } else {
      setOrder(null)
    }

    setSearched(true)
  }

  return (
    <div className="container-px mx-auto max-w-4xl py-16">
      <div className="text-center">
        <h1 className="font-mono text-3xl font-bold uppercase sm:text-4xl">
          Заказдын статусун көзөмөлдөө
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Заказыңыздын кодун (мисалы: <span className="font-semibold text-primary">ES-163981</span>) жазып, анын кайда баратканын билиңиз.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-lg gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ES-163981..."
            className="pl-9 font-mono uppercase"
          />
        </div>
        <Button type="submit" className="font-bold">Издөө</Button>
      </form>

      {/* Натыйжа блогу */}
      {searched && (
        <div className="mt-10">
          {order ? (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Заказ №</p>
                  <h2 className="font-mono text-xl font-bold text-primary">{order.id}</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Clock className="size-3.5" />
                  <span>Статус: {order.status || 'Кабыл алынды'}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <PackageCheck className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Алуучу</p>
                    <p className="text-sm font-medium">{order.customer || order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Жеткирүү дареги</p>
                    <p className="text-sm font-medium">{order.address}</p>
                  </div>
                </div>
              </div>

              {/* Товарлардын тизмеси */}
              <div className="mt-6 rounded-xl bg-muted/40 p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Товарлар:</p>
                <div className="flex flex-col gap-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name || item.title} × {item.quantity}</span>
                      <b className="font-mono">{formatSom(item.price * item.quantity)}</b>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t pt-2 text-base font-bold">
                  <span>Жалпы сумма:</span>
                  <span className="text-primary">{formatSom(order.total || order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
              <AlertCircle className="mx-auto size-10 text-destructive" />
              <h3 className="mt-3 text-lg font-bold">Заказ табылган жок</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Кодду туура жазганыңызды текшериңиз же кайрадан аракет кылып көрүңүз.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}