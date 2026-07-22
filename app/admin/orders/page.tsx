'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Search, User, MapPin, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Supabase'ден заказдарды жүктөө
  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Заказдарды жүктөөдө ката:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Заказдын статусун Supabase'де өзгөртүү
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // 1. Локалдык экранда дароо жаңылоо
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )

    // 2. Supabase базасында өзгөртүү
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Статусту өзгөртүүдө ката чыкты:', error)
      alert('Статусту өзгөртүүдө ката чыкты')
      fetchOrders() // Ката чыкса кайра маалыматты калыбына келтирүү
    }
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name || o.customer || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || '').includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold uppercase">Заказдарды башкаруу</h1>
          <p className="text-sm text-muted-foreground">
            Supabase базасынан реалдуу убакытта алынган заказдар.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="rounded-xl border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          Жаңылоо 🔄
        </button>
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
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
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
                    <h3 className="font-mono text-sm font-bold">{order.id}</h3>
                    <p className="text-xs text-muted-foreground">
                      Датасы: {new Date(order.created_at || Date.now()).toLocaleDateString('ru-RU')}
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
                    <p className="font-medium">{order.customer_name || order.customer}</p>
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
                  <span className="text-primary">{formatSom(order.total || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}