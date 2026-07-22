'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Customer {
  id: string
  name: string
  phone: string
  address: string
  ordersCount: number
  totalSpent: number
  lastOrderDate: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // 1. Бардык заказдарды localStorage'дан окуп алабыз
    const savedOrders = localStorage.getItem('eltoy_orders')
    if (savedOrders) {
      const orders = JSON.parse(savedOrders)
      
      // 2. Заказдардын ичинен уникалдуу кардарларды чогултабыз
      const customerMap: { [key: string]: Customer } = {}

      orders.forEach((order: any) => {
        const phone = order.phone || 'Телефонсуз'
        const name = order.customer || order.customerName || 'Аты жок кардар'
        const total = Number(order.total || order.totalAmount || 0)

        if (customerMap[phone]) {
          customerMap[phone].ordersCount += 1
          customerMap[phone].totalSpent += total
        } else {
          customerMap[phone] = {
            id: order.id,
            name: name,
            phone: phone,
            address: order.address || 'Дареги жок',
            ordersCount: 1,
            totalSpent: total,
            lastOrderDate: order.createdAt || new Date().toISOString()
          }
        }
      })

      setCustomers(Object.values(customerMap))
    }
  }, [])

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold uppercase">Кардарларды башкаруу</h1>
        <p className="text-sm text-muted-foreground">
          Заказ берген бардык кардарлардын автоматтык түрдө топтолгон тизмеси.
        </p>
      </div>

      {/* ИЗДӨӨ */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Аты, телефон же дареги менен издөө..."
          className="pl-9 rounded-xl"
        />
      </div>

      {/* КАРДАРЛАР ТАБЛИЦАСЫ */}
      {filteredCustomers.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
          <Users className="mx-auto size-12 opacity-30" />
          <p className="mt-3 font-medium">Азырынча кардарлар табылган жок</p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Кардар</th>
                  <th className="p-4">Байланыш жана Дарек</th>
                  <th className="p-4">Заказдар саны</th>
                  <th className="p-4">Жалпы суммасы</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-muted/20 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                          {customer.name[0]?.toUpperCase() || 'К'}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="size-3.5" />
                        <span className="font-mono">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="size-3.5" />
                        <span>{customer.address}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono font-medium">
                        <ShoppingBag className="size-4 text-primary" />
                        <span>{customer.ordersCount} заказ</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-primary">
                      {customer.totalSpent.toLocaleString()} сом
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}