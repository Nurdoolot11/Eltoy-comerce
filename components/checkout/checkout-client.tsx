'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, CreditCard, Loader2, LockKeyhole, Truck, MapPin, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/components/cart/cart-provider'
import { useAuth } from '@/components/auth/auth-provider'
import { formatSom } from '@/lib/data'
import { supabase } from '../../lib/supabase'

export function CheckoutClient() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, getProductById, cartTotal, clearCart } = useCart()
  const [payment, setPayment] = useState('card')
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  // Формадагы талаалар
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Колдонуучунун маалыматтарын автоматтык түрдө жүктөө
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
    }

    const savedAddress = localStorage.getItem('eltoy_customer_address')
    if (savedAddress) {
      setAddress(savedAddress)
    }
  }, [user])

  // АДМИН БОЛСО — Заказ берүү бетке киргизбей, эскертүү көрсөтүү
  if (user?.role === 'admin') {
    return (
      <div className="container-px mx-auto max-w-xl py-24 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="font-mono text-3xl font-bold uppercase">Администратордук режим</h1>
        <p className="my-4 text-muted-foreground">
          Сиз админстраторсуз. Сайттагы товарларды көрүп жана текшере аласыз, бирок кардар сыяктуу заказ бере албайсыз.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push('/admin')} className="font-bold">
            Админ панелге өтүү
          </Button>
          <Button variant="outline" onClick={() => router.push('/catalog')}>
            Каталогду карап чыгуу
          </Button>
        </div>
      </div>
    )
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Даректи эстеп калуу
    localStorage.setItem('eltoy_customer_address', address)

    const orderItems = items.flatMap(i => {
      const p = getProductById(i.id)
      return p ? [{ id: p.id, name: p.name, price: p.price, quantity: i.quantity }] : []
    })

    try {
      // Supabase маалымат базасына заказды киргизүү
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: name || user?.name || 'Кардар',
            phone: phone || user?.phone || '+996 700 000 000',
            address: address || 'Бишкек ш.',
            items: orderItems,
            total: cartTotal,
            status: 'Кабыл алынды',
            user_id: user?.id || null, // ← Бул тилке заказ кимге таандык экенин сактайт
          },
        ])
        .select()

      if (error) {
        console.error('Supabase катасы:', error)
        alert('Заказды сактоодо ката чыкты: ' + error.message)
        setLoading(false)
        return
      }

      const createdOrder = data[0]

      clearCart()
      setLoading(false)
      setPaid(true)

      // Чекке багыттоо
      setTimeout(() => router.push(`/invoice/${createdOrder.id}`), 1200)
    } catch (err) {
      console.error('Ката:', err)
      alert('Заказ берүүдө ката кетти')
      setLoading(false)
    }
  }

  if (paid) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <CheckCircle2 className="size-16 text-primary animate-bounce" />
      <h1 className="font-mono text-3xl font-bold uppercase">Заказ ийгиликтүү кабыл алынды!</h1>
      <p className="text-muted-foreground">Электрондук чек даярдалууда жеке кабинетке багытталууда...</p>
    </div>
  )

  if (!items.length) return (
    <div className="container-px mx-auto max-w-3xl py-24 text-center">
      <h1 className="font-mono text-3xl font-bold uppercase">Себет бош</h1>
      <Button className="mt-6" onClick={() => router.push('/catalog')}>Каталогго өтүү</Button>
    </div>
  )

  return (
    <div className="container-px mx-auto max-w-6xl py-10">
      <h1 className="mb-8 font-mono text-4xl font-bold uppercase">Заказды даярдоо</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Section title="1. Алуучунун маалыматы">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Аты-жөнү</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Атыңызды киргизиңиз" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+996 ..." 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Жеткирүү дареги</Label>
              <Input 
                id="address" 
                name="address" 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Шаар, көчө, үй" 
              />
            </div>

            {/* 2GIS Картасынын интерактивдүү блогу */}
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/40">
              <div className="flex items-center gap-2 border-b bg-card px-4 py-2 text-xs font-semibold text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Биздин башкы кеңсе / Склад: Жибек Жолу проспектиси, 234</span>
              </div>
              <div className="relative h-[220px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.6334419614234!2d74.61633519999999!3d42.8858229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb7eb9875f6a9%3A0x6339009df3dc9e5f!2sMjM0INC_0YDQvtGB0L8uINCW0B3QsdC10Log0JbQvtC70YMsINCR0LjRiNC60LXQug!5e0!3m2!1sky!2skg!4v1715800000000!5m2!1sky!2skg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-3 bg-card text-center">
                <a 
                  href="https://go.2gis.com/IxVjD" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  2GIS картасынан ачуу ↗
                </a>
              </div>
            </div>
          </Section>

          <Section title="2. Төлөм ыкмасы">
            <div className="grid gap-3 sm:grid-cols-2">
              <button 
                type="button" 
                onClick={() => setPayment('card')} 
                className={`rounded-xl border p-4 text-left transition ${payment === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
              >
                <CreditCard className="mb-3 size-5 text-primary" />
                <b className="block">Банк картасы</b>
                <p className="text-sm text-muted-foreground">Демо онлайн төлөм</p>
              </button>

              <button 
                type="button" 
                onClick={() => setPayment('cash')} 
                className={`rounded-xl border p-4 text-left transition ${payment === 'cash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
              >
                <Truck className="mb-3 size-5 text-primary" />
                <b className="block">Алганда төлөө</b>
                <p className="text-sm text-muted-foreground">Накталай же QR</p>
              </button>
            </div>

            {payment === 'card' && (
              <div className="grid gap-4 rounded-xl bg-secondary/50 p-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Карта номери</Label>
                  <Input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Мөөнөтү</Label>
                  <Input placeholder="12/29" defaultValue="12/29" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" defaultValue="777" type="password" maxLength={3} />
                </div>
              </div>
            )}
          </Section>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-5 sticky top-20">
          <h2 className="font-mono text-xl font-bold uppercase">Сиздин заказ</h2>
          <div className="my-5 flex flex-col gap-3">
            {items.map(i => {
              const p = getProductById(i.id)
              return p ? (
                <div key={i.id} className="flex justify-between gap-4 text-sm">
                  <span>{p.name} × {i.quantity}</span>
                  <b>{formatSom(p.price * i.quantity)}</b>
                </div>
              ) : null
            })}
          </div>
          <div className="flex justify-between border-t pt-4 text-lg">
            <span>Жалпы</span>
            <b className="text-primary">{formatSom(cartTotal)}</b>
          </div>
          <Button type="submit" size="lg" className="mt-5 w-full font-bold" disabled={loading}>
            {loading ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Катталууда...</>
            ) : (
              'Заказ берүү'
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <LockKeyhole className="mr-1 inline size-3" />
            Бул демо, чыныгы акча алынбайт
          </p>
        </aside>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5"><h2 className="font-mono text-xl font-bold uppercase">{title}</h2>{children}</section>
}