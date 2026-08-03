'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LogOut, Package, UserRound, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site/site-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export function AccountClient() {
  const { user, ready, logout, update } = useAuth()
  const [, refresh] = useState(0)
  
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) {
        setLoadingOrders(false)
        return
      }

      setLoadingOrders(true)

      // Реалдуу туруктуу сурам: ID, Email же телефон дал келсе эле заказдарды чыгарат
      const conditions: string[] = []
      if (user.id) conditions.push(`user_id.eq.${user.id}`)
      if (user.email) conditions.push(`customer_email.eq.${user.email}`)
      if (user.phone) conditions.push(`phone.eq.${user.phone}`)

      let query = supabase.from('orders').select('*')

      if (conditions.length > 0) {
        query = query.or(conditions.join(','))
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Заказдарды жүктөө катасы:', error)
      } else {
        setOrders(data || [])
      }
      setLoadingOrders(false)
    }

    if (user) {
      fetchUserOrders()
    }
  }, [user])

  if (!ready) return null

  if (!user) {
    return (
      <SiteShell>
        <div className="container-px mx-auto max-w-xl py-24 text-center">
          <UserRound className="mx-auto size-14 text-primary" />
          <h1 className="mt-4 font-mono text-3xl font-bold uppercase">Жеке кабинет</h1>
          <p className="my-5 text-muted-foreground">Профиль жана заказдарыңыз үчүн кириңиз.</p>
          <AuthDialog>
            <Button>Кирүү</Button>
          </AuthDialog>
        </div>
      </SiteShell>
    )
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    update({
      ...user,
      name: String(d.get('name')),
      phone: String(d.get('phone')),
    })
    refresh((x) => x + 1)
  }

  return (
    <SiteShell>
      <div className="container-px mx-auto max-w-5xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-primary">Кош келиңиз</p>
            <h1 className="font-mono text-4xl font-bold uppercase">{user.name}</h1>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut data-icon="inline-start" />
            Чыгуу
          </Button>
        </div>

        {user.role === 'admin' && (
          <div className="mb-8 rounded-2xl border border-primary/50 bg-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                <ShieldCheck className="size-8" />
              </div>
              <div>
                <h2 className="font-mono text-lg font-bold uppercase">Администратор панели</h2>
                <p className="text-sm text-muted-foreground">
                  Товарларды кошуу, өзгөртүү жана келген заказдарды башкаруу борбору.
                </p>
              </div>
            </div>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 font-bold">
                Админ панелге өтүү
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={submit} className="flex h-fit flex-col gap-4 rounded-2xl border bg-card p-5">
            <h2 className="font-mono text-xl font-bold uppercase">Профиль</h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Аты-жөнү</Label>
              <Input id="name" name="name" defaultValue={user.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" name="phone" defaultValue={user.phone} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <Button type="submit">Сактоо</Button>
          </form>

          <section>
            <h2 className="mb-4 font-mono text-2xl font-bold uppercase">Менин заказдарым</h2>
            
            {loadingOrders ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border bg-card gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="text-sm">Заказдар жүктөлүүдө...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="flex flex-col gap-3">
                {orders.map((o) => (
                  <Link
                    href={`/invoice/${o.id}`}
                    key={o.id}
                    className="flex items-center gap-4 rounded-2xl border bg-card p-4 hover:border-primary transition"
                  >
                    <Package className="size-8 text-primary" />
                    <div className="flex-1">
                      <b className="font-mono text-sm">#{String(o.id).slice(0, 8)}...</b>
                      <p className="text-xs text-muted-foreground">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('ky-KG') : ''} · <span className="font-semibold text-foreground">{o.status || 'Кабыл алынды'}</span>
                      </p>
                    </div>
                    <b className="font-mono text-primary">{formatSom(o.total)}</b>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
                Азырынча заказдарыңыз жок.{' '}
                <Link href="/catalog" className="text-primary hover:underline font-medium">
                  Каталогду көрүү
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </SiteShell>
  )
}