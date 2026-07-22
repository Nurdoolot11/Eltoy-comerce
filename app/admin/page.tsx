'use client'

import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight } from 'lucide-react'
import { formatSom, products } from '@/lib/data'
import { getOrders } from '@/lib/demo-store'

export default function AdminDashboardPage() {
  const orders = getOrders()
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-mono text-3xl font-bold uppercase">Дашборд</h1>
        <p className="text-sm text-muted-foreground">Соода агымы, заказдар жана статистика</p>
      </div>

      {/* 📊 АНАЛИТИКА КАРТОЧКАЛАРЫ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Жалпы киреше</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono">{formatSom(totalRevenue)}</p>
          <span className="text-xs text-emerald-500 font-medium">+12% өткөн айга караганда</span>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Заказдар</span>
            <ShoppingBag className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono">{orders.length} даана</p>
          <span className="text-xs text-muted-foreground font-medium">Активдүү заказдар</span>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Товарлардын саны</span>
            <Package className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono">{products.length} түрү</p>
          <span className="text-xs text-muted-foreground font-medium">Складда бардык товарлар</span>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Кардарлар</span>
            <Users className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono">148</p>
          <span className="text-xs text-blue-500 font-medium">Катталган колдонуучулар</span>
        </div>
      </div>

      {/* 🛒 АКЫРКЫ ЗАКАЗДАР ТИЗМЕСИ */}
      <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xl font-bold uppercase">Акыркы түшкөн заказдар</h2>
          <span className="text-xs text-muted-foreground">Бардыгы: {orders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="p-3">Заказ ID</th>
                <th className="p-3">Дата</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Сумма</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-muted/20">
                  <td className="p-3 font-bold font-mono">{o.id}</td>
                  <td className="p-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                      {o.status || 'Иштелип жатат'}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{formatSom(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}