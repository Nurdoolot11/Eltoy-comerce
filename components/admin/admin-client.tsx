'use client'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react'
import { SiteShell } from '@/components/site/site-shell'
import { useAuth } from '@/components/auth/auth-provider'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getOrders, saveOrders } from '@/lib/demo-store'
import { formatSom, products } from '@/lib/data'

export function AdminClient() {
  const { user, ready } = useAuth()
  const [version, setVersion] = useState(0)

  if (!ready) return null
  if (!user || user.role !== 'admin') {
    return (
      <SiteShell>
        <div className="container-px mx-auto max-w-lg py-24 text-center">
          <LayoutDashboard className="mx-auto size-12 text-primary" />
          <h1 className="mt-4 font-mono text-3xl font-bold uppercase">Админ панели</h1>
          <p className="my-5 text-muted-foreground">Демо кирүү: admin@eltoy.kg / admin123</p>
          <AuthDialog>
            <Button>Админ катары кирүү</Button>
          </AuthDialog>
        </div>
      </SiteShell>
    )
  }

  const orders = getOrders()
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  
  const updateStatus = (id: string, status: string) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    setVersion(version + 1)
  }

  return (
    <SiteShell>
      <div className="container-px mx-auto max-w-7xl py-10">
        <div className="mb-8">
          <p className="font-mono uppercase tracking-widest text-primary">Башкаруу борбору</p>
          <h1 className="font-mono text-4xl font-bold uppercase">Админ панели</h1>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<ShoppingBag />} label="Заказдар" value={String(orders.length)} />
          <Stat icon={<Package />} label="Товарлар" value={String(products.length)} />
          <Stat icon={<Users />} label="Кардарлар" value={String(new Set(orders.map(o => o.userId)).size)} />
          <Stat icon={<LayoutDashboard />} label="Жүгүртүү" value={formatSom(revenue)} />
        </div>

        <section className="mb-8 rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-mono text-2xl font-bold uppercase">Заказдар</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="p-3">№</th>
                  <th className="p-3">Кардар</th>
                  <th className="p-3">Сумма</th>
                  <th className="p-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3">{o.customer}</td>
                    <td className="p-3">{formatSom(o.total)}</td>
                    <td className="p-3">
                     <Select value={o.status} onValueChange={v => v && updateStatus(o.id, v)}>
                        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {['Кабыл алынды', 'Даярдалууда', 'Жолдо', 'Жеткирилди'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && <p className="p-8 text-center text-muted-foreground">Заказ жок</p>}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-mono text-2xl font-bold uppercase">Товарлар жана склад</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku}</p>
                </div>
                <Input className="w-24" defaultValue={p.price} aria-label={`${p.name} баасы`} />
                <Input className="w-20" defaultValue={p.stock} aria-label={`${p.name} калдыгы`} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Бул демо панелде өзгөртүлгөн баалар браузер сессиясында көрсөтүлөт; базалык каталог калыбына келтирилет.</p>
        </section>
      </div>
    </SiteShell>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-4 text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <b className="text-2xl">{value}</b>
    </div>
  )
}