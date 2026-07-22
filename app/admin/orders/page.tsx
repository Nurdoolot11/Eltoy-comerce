'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Search, User, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('eltoy_orders')
    if (saved) {
      setOrders(JSON.parse(saved))
    }
  }, [])

  // Заказдын статусун өзгөртүү
  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus }
      }
      return o
    })
    setOrders(updated)
    localStorage.setItem('eltoy_orders', JSON.stringify(updated))
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer || o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || '').includes(search)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold uppercase">Заказдарды башкаруу</h1>
        <p className="text-sm text-muted-foreground">
          Келип түшкөн бардык заказдардын тизмеси жана алардын статустары.
        </p>
      </div>

      {/* ИЗДӨӨ */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Код, аты же телефон менен издөө..."
          className="pl-9"
        />
      </div>

      {/* ЗАКАЗДАР ТИЗМЕСИ */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
          <ShoppingBag className="mx-auto size-12 opacity-30" />
          <p className="mt-3 font-medium">Азырынча заказдар жок</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center font-mono font-bold text-primary">
                    #
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-bold">{order.id}</h3>
                    <p className="text-xs text-muted-foreground">
                      Датасы: {new Date(order.createdAt || Date.now()).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {/* СТАТУСТАР МЕНЮСУ */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Статус:</span>
                  <select
                    value={order.status || 'Кабыл алынды'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Кабыл алынды">Кабыл алынды</option>
                    <option value="Иштетилүүдө">Иштетилүүдө</option>
                    <option value="Жолдо (Курьерде)">Жолдо (Курьерде)</option>
                    <option value="Жеткирилди">Жеткирилди</option>
                    <option value="Жокко чыгарылды">Жокко чыгарылды</option>
                  </select>
                </div>
              </div>

              {/* КАРДАР ЖАНА ДАРЕК МААЛЫМАТТАРЫ */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="flex gap-2.5 items-start">
                  <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Алуучу</p>
                    <p className="font-medium">{order.customer || order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Жеткирүү дареги</p>
                    <p className="font-medium">{order.address}</p>
                  </div>
                </div>
              </div>

              {/* ТОВАРЛАР ЖАНА ЖАЛПЫ СУММА */}
              <div className="rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Товарлар:</p>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name || item.title} × {item.quantity}</span>
                    <b className="font-mono">{formatSom((item.price || 0) * (item.quantity || 1))}</b>
                  </div>
                ))}
                <div className="pt-2 border-t flex justify-between font-bold text-base">
                  <span>Суммасы:</span>
                  <span className="text-primary">{formatSom(order.total || order.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}