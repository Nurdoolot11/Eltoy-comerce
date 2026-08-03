'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Search, 
  User, 
  MapPin, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  Phone,
  RefreshCw 
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // 🔘 Вкладка (Таб) стейти: 'active' | 'delivered' | 'cancelled' | 'all'
  const [activeTab, setActiveTab] = useState<'active' | 'delivered' | 'cancelled' | 'all'>('active')

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
      fetchOrders()
    }
  }

  // 🔍 Издөө жана Таб боюнча чыпкалоо (Фильтрация)
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase()
    const idMatch = (o.id || '').toLowerCase().includes(q)
    const nameMatch = (o.customer_name || o.customer || '').toLowerCase().includes(q)
    const phoneMatch = (o.phone || '').includes(q)
    const matchesSearch = idMatch || nameMatch || phoneMatch

    if (!matchesSearch) return false

    const status = o.status || 'Кабыл алынды'

    if (activeTab === 'active') {
      return status !== 'Жеткирилди' && status !== 'Жокко чыгарылды' && status !== 'delivered' && status !== 'cancelled'
    }
    if (activeTab === 'delivered') {
      return status === 'Жеткирилди' || status === 'delivered'
    }
    if (activeTab === 'cancelled') {
      return status === 'Жокко чыгарылды' || status === 'cancelled'
    }

    return true // 'all'
  })

  // 📊 Сандарды эсептөө (Counters)
  const countActive = orders.filter(o => {
    const st = o.status || 'Кабыл алынды'
    return st !== 'Жеткирилди' && st !== 'Жокко чыгарылды' && st !== 'delivered' && st !== 'cancelled'
  }).length

  const countDelivered = orders.filter(o => {
    const st = o.status
    return st === 'Жеткирилди' || st === 'delivered'
  }).length

  const countCancelled = orders.filter(o => {
    const st = o.status
    return st === 'Жокко чыгарылды' || st === 'cancelled'
  }).length

  return (
    <div className="space-y-6">
      
      {/* 🏷️ HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
            Заказдарды башкаруу <ShoppingBag className="size-5 text-amber-400" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Supabase базасынан реалдуу убакытта алынган заказдар.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-xl border border-border/80 px-4 py-2 text-xs font-semibold hover:bg-muted transition flex items-center gap-2"
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          Жаңылоо
        </button>
      </div>

      {/* 🔘 ТАБДАР ЖАНА ИЗДӨӨ */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        
        {/* ВКЛАДКАЛАР (САНДАР КӨРҮНҮКТҮҮ ЖАСАЛДЫ) */}
        <div className="flex flex-wrap p-1.5 bg-card/60 rounded-2xl border border-border/80 shadow-sm gap-1.5">
          
          {/* АКТИВДҮҮ */}
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Clock className="size-4" />
            Жаңы / Иштетилүүдө
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
              activeTab === 'active' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {countActive}
            </span>
          </button>

          {/* ЖЕТКИРИЛГЕНДЕР */}
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'delivered'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <CheckCircle2 className="size-4" />
            Жеткирилгендер
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
              activeTab === 'delivered' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {countDelivered}
            </span>
          </button>

          {/* БАШ ТАРТЫЛГАНДАР */}
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'cancelled'
                ? 'bg-rose-500 text-white shadow-md font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <XCircle className="size-4" />
            Баш тартылгандар
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
              activeTab === 'cancelled' ? 'bg-slate-950 text-rose-400' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {countCancelled}
            </span>
          </button>

          {/* БАРДЫГЫ */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'all'
                ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Package className="size-4" />
            Бардыгы
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-black ${
              activeTab === 'all' ? 'bg-slate-950 text-sky-400' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}>
              {orders.length}
            </span>
          </button>

        </div>

        {/* ИЗДӨӨ */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Код, аты же телефон менен издөө..."
            className="pl-10 rounded-xl bg-card border-border/60"
          />
        </div>
      </div>

      {/* 📦 ЗАКАЗДАР ТИЗМЕСИ */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="size-6 animate-spin text-amber-500" />
          <span className="text-sm font-medium">Заказдар жүктөлүүдө...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center text-muted-foreground space-y-3">
          <ShoppingBag className="mx-auto size-12 opacity-30" />
          <p className="font-bold text-foreground">Бул тизмеде азырынча заказдар жок</p>
          <p className="text-xs">Башка вкладканы тандап же издөөнү текшерип көрүңүз.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const currentStatus = order.status || 'Кабыл алынды'

            let statusBadgeClass = 'border-amber-500/40 text-amber-400 bg-amber-500/10'
            if (currentStatus === 'Жеткирилди' || currentStatus === 'delivered') {
              statusBadgeClass = 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
            } else if (currentStatus === 'Жокко чыгарылды' || currentStatus === 'cancelled') {
              statusBadgeClass = 'border-rose-500/40 text-rose-400 bg-rose-500/10'
            } else if (currentStatus === 'Жолдо (Курьерде)' || currentStatus === 'processing') {
              statusBadgeClass = 'border-sky-500/40 text-sky-400 bg-sky-500/10'
            }

            return (
              <div key={order.id} className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg hover:border-amber-500/40 transition-all space-y-4">
                
                {/* ЗАКАЗ БАШКЫ МУКАБАСЫ */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400">
                      #
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-foreground">{order.id}</h3>
                      <p className="text-xs text-muted-foreground">
                        Датасы: {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Белгисиз'}
                      </p>
                    </div>
                  </div>

                  {/* СТАТУСТАР МЕНЮСУ */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Статус:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer transition ${statusBadgeClass}`}
                    >
                      <option value="Кабыл алынды" className="bg-card text-foreground">Кабыл алынды</option>
                      <option value="Иштетилүүдө" className="bg-card text-foreground">Иштетилүүдө</option>
                      <option value="Жолдо (Курьерде)" className="bg-card text-sky-400">Жолдо (Курьерде)</option>
                      <option value="Жеткирилди" className="bg-card text-emerald-400">Жеткирилди</option>
                      <option value="Жокко чыгарылды" className="bg-card text-rose-400">Жокко чыгарылды</option>
                    </select>
                  </div>
                </div>

                {/* КАРДАР ЖАНА ДАРЕК МААЛЫМАТТАРЫ */}
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                    <User className="size-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Алуучу</p>
                      <p className="font-bold text-foreground">{order.customer_name || order.customer || 'Көрсөтүлгөн эмес'}</p>
                      {order.phone && (
                        <a href={`tel:${order.phone}`} className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1 mt-0.5">
                          <Phone className="size-3" />
                          {order.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                    <MapPin className="size-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Жеткирүү дареги</p>
                      <p className="font-semibold text-foreground">{order.address || 'Көрсөтүлгөн эмес'}</p>
                    </div>
                  </div>
                </div>

                {/* ТОВАРЛАР ЖАНА ЖАЛПЫ СУММА */}
                <div className="rounded-2xl bg-muted/30 border border-border/50 p-4 space-y-2 text-sm">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Товарлар:</p>
                  
                  <div className="divide-y divide-border/30">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex justify-between items-center text-xs">
                        <span className="font-medium text-foreground">
                          {item.name || item.title} <span className="text-amber-400 font-bold">× {item.quantity || 1}</span>
                        </span>
                        <b className="font-mono text-foreground">{formatSom((item.price || 0) * (item.quantity || 1))}</b>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/60 flex justify-between items-center font-bold">
                    <span className="text-xs uppercase text-muted-foreground">Суммасы:</span>
                    <span className="text-lg font-mono font-extrabold text-amber-400">{formatSom(order.total || 0)}</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}