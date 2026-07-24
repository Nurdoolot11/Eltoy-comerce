'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Printer, Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site/site-shell'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { formatSom } from '@/lib/data'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface SupabaseOrder {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  address: string
  total: number
  status: string
  payment_method: string
  items: OrderItem[]
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<SupabaseOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Чекти жүктөөдө ката:', error.message)
        } else if (data) {
          setOrder(data)
        }
      } catch (err) {
        console.error('Ката:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (loading) {
    return (
      <SiteShell>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <div className="container-px mx-auto max-w-3xl py-10">
        {order ? (
          <div className="rounded-3xl border bg-card p-6 md:p-10 shadow-sm">
            <div className="flex items-start justify-between border-b pb-6">
              <div>
                <p className="font-mono text-2xl font-bold">ELTOY STROY</p>
                <p className="text-sm text-muted-foreground">Электрондук чек</p>
              </div>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer data-icon="inline-start" />
                Басып чыгаруу
              </Button>
            </div>

            <div className="grid gap-4 py-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Заказ коду</p>
                <b className="font-mono text-primary">{order.id}</b>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Дата</p>
                <b>{new Date(order.created_at).toLocaleString('ky-KG')}</b>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Кардар</p>
                <b>{order.customer_name} ({order.customer_phone})</b>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Дарек</p>
                <b>{order.address}</b>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-y py-6">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Товарлар:</p>
              {Array.isArray(order.items) &&
                order.items.map((i, index) => (
                  <div key={index} className="flex justify-between gap-5 text-sm">
                    <span>
                      {i.name} × {i.quantity}
                    </span>
                    <b>{formatSom(i.price * i.quantity)}</b>
                  </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 text-2xl">
              <b>Жалпы суммасы</b>
              <b className="text-primary">{formatSom(order.total)}</b>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Статус: <span className="font-semibold text-foreground">{order.status}</span> · Төлөм:{' '}
              {order.payment_method === 'card' ? 'Карта аркылуу' : 'Алганда төлөө'}
            </p>
          </div>
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-bold">Чек табылган жок</h1>
            <p className="text-sm text-muted-foreground mt-2">Бул заказ Supabase базасынан табылган жок.</p>
            <div className="mt-5">
              <Link 
                href="/account" 
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Кабинетке кайтуу
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  )
}