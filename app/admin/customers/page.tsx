'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Crown, 
  TrendingUp, 
  MessageSquare,
  RefreshCw,
  Loader2,
  Calendar,
  UserCheck,
  UserPlus
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'new' | 'regular' | 'vip'>('all')

  // Supabase'ден заказдарды алып, кардарлар боюнча топтоо
  const fetchCustomers = async () => {
    setLoading(true)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ката:', error)
      setLoading(false)
      return
    }

    if (orders) {
      const customerMap: { [key: string]: any } = {}

      orders.forEach((order) => {
        const phone = order.phone || 'Тел жок'
        const name = order.customer_name || order.customer || 'Белгисиз кардар'
        const total = Number(order.total || order.total_price || 0)

        if (!customerMap[phone]) {
          customerMap[phone] = {
            id: phone,
            name: name,
            phone: phone,
            address: order.address || 'Көрсөтүлгөн эмес',
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: order.created_at,
            orders: []
          }
        }

        customerMap[phone].totalSpent += total
        customerMap[phone].orderCount += 1
        customerMap[phone].orders.push(order)
      })

      setCustomers(Object.values(customerMap))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Кардардын статусун аныктоочу функция
  const getCustomerStatus = (orderCount: number, totalSpent: number) => {
    if (orderCount >= 4 || totalSpent >= 100000) {
      return { type: 'vip', label: 'VIP', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
    }
    if (orderCount >= 2) {
      return { type: 'regular', label: 'Туруктуу', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
    }
    return { type: 'new', label: 'Жаңы', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' }
  }

  // Фильтрация
  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase()
    const matchesSearch = 
      c.name.toLowerCase().includes(q) || 
      c.phone.includes(q) || 
      c.address.toLowerCase().includes(q)

    if (!matchesSearch) return false

    const status = getCustomerStatus(c.orderCount, c.totalSpent)

    if (filter === 'vip') return status.type === 'vip'
    if (filter === 'regular') return status.type === 'regular'
    if (filter === 'new') return status.type === 'new'

    return true
  })

  // Эсептөөлөр
  const totalCustomers = customers.length
  const vipCount = customers.filter(c => getCustomerStatus(c.orderCount, c.totalSpent).type === 'vip').length
  const regularCount = customers.filter(c => getCustomerStatus(c.orderCount, c.totalSpent).type === 'regular').length
  const newCount = customers.filter(c => getCustomerStatus(c.orderCount, c.totalSpent).type === 'new').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
            Кардарларды башкаруу <Users className="size-6 text-amber-400" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Заказ берген бардык кардарлардын базасы, сарптаган суммасы жана контактылары.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="rounded-xl border border-border/80 px-4 py-2 text-xs font-semibold hover:bg-muted transition flex items-center gap-2"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          Жаңылоо
        </button>
      </div>

      {/* СТАТИСТИКА КАРТОЧКАЛАРЫ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Жалпы кардарлар</p>
            <h3 className="text-xl font-mono font-extrabold text-foreground">{totalCustomers} адам</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Crown className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">VIP Кардарлар (4+ заказ)</p>
            <h3 className="text-xl font-mono font-extrabold text-amber-400">{vipCount} адам</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/70 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
            <TrendingUp className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Жалпы соода</p>
            <h3 className="text-xl font-mono font-extrabold text-sky-400">{formatSom(totalRevenue)}</h3>
          </div>
        </div>
      </div>

      {/* ФИЛЬТРЛЕР ЖАНА ИЗДӨӨ */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-card/60 rounded-2xl border border-border/80">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Бардыгы ({customers.length})
          </button>
          
          <button
            onClick={() => setFilter('new')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'new' ? 'bg-sky-500 text-slate-950 shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserPlus className="size-3.5" /> Жаңы ({newCount})
          </button>

          <button
            onClick={() => setFilter('regular')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'regular' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="size-3.5" /> Туруктуу ({regularCount})
          </button>

          <button
            onClick={() => setFilter('vip')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'vip' ? 'bg-amber-500 text-slate-950 shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Crown className="size-3.5" /> VIP ({vipCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Аты, тел же дареги менен издөө..."
            className="pl-10 rounded-xl bg-card border-border/60"
          />
        </div>
      </div>

      {/* КАРДАРЛАР ТИЗМЕСИ */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="size-6 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Кардарлар жүктөлүүдө...</span>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center text-muted-foreground space-y-3">
          <Users className="mx-auto size-12 opacity-30" />
          <p className="font-bold text-foreground">Азырынча кардарлар табылган жок</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => {
            const status = getCustomerStatus(customer.orderCount, customer.totalSpent)
            const cleanPhone = customer.phone.replace(/[^0-9]/g, '')
            const whatsappUrl = `https://wa.me/${cleanPhone}`

            return (
              <div 
                key={customer.id}
                className="rounded-3xl border border-border/70 bg-card p-5 shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg font-mono">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          {customer.name}
                          {status.type === 'vip' && <Crown className="size-4 text-amber-400 fill-amber-400" />}
                        </h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="size-3" />
                          {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('ru-RU') : 'Билгисиз'}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/40">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Phone className="size-3.5 text-amber-400" /> Тел:
                      </span>
                      <a href={`tel:${customer.phone}`} className="font-mono font-bold text-foreground hover:underline">
                        {customer.phone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/40">
                      <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <MapPin className="size-3.5 text-rose-400" /> Дарек:
                      </span>
                      <span className="font-medium text-foreground truncate max-w-[150px]" title={customer.address}>
                        {customer.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Заказдар:</span>
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <ShoppingBag className="size-3 text-amber-400" /> {customer.orderCount} заказ
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px]">Жалпы соода:</span>
                      <span className="font-mono font-extrabold text-amber-400 text-sm">
                        {formatSom(customer.totalSpent)}
                      </span>
                    </div>
                  </div>

                  {cleanPhone.length >= 9 && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="size-3.5" />
                      WhatsApp менен жазуу
                    </a>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}