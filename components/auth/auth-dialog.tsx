'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from './auth-provider'

export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { login, register } = useAuth()
  const submit = (mode: 'login' | 'register') => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const data = new FormData(e.currentTarget)
    const ok = mode === 'login' ? login(String(data.get('email')), String(data.get('password'))) : register({ name: String(data.get('name')), email: String(data.get('email')), phone: String(data.get('phone')), password: String(data.get('password')) })
    if (ok) setOpen(false)
  }
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger render={children as React.ReactElement} />
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>Жеке кабинет</DialogTitle><DialogDescription>Заказдарды сактоо жана текшерүү үчүн кириңиз.</DialogDescription></DialogHeader>
      <Tabs defaultValue="login"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Кирүү</TabsTrigger><TabsTrigger value="register">Катталуу</TabsTrigger></TabsList>
        <TabsContent value="login"><form onSubmit={submit('login')} className="flex flex-col gap-4 pt-4"><Field label="Email" name="email" type="email"/><Field label="Сырсөз" name="password" type="password"/><Button type="submit">Кирүү</Button><p className="text-xs text-muted-foreground">Кардар: demo@eltoy.kg / demo123<br />Админ: admin@eltoy.kg / admin123</p></form></TabsContent>
        <TabsContent value="register"><form onSubmit={submit('register')} className="flex flex-col gap-4 pt-4"><Field label="Аты-жөнү" name="name"/><Field label="Телефон" name="phone" type="tel"/><Field label="Email" name="email" type="email"/><Field label="Сырсөз (6+ белги)" name="password" type="password" minLength={6}/><Button type="submit">Аккаунт түзүү</Button></form></TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
}
function Field({ label, name, type = 'text', minLength }: { label: string; name: string; type?: string; minLength?: number }) { return <div className="flex flex-col gap-2"><Label htmlFor={`auth-${name}`}>{label}</Label><Input id={`auth-${name}`} name={name} type={type} minLength={minLength} required /></div> }
