'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Store, Phone, MapPin, Clock, Truck, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('ELTOY STROY')
  const [logoUrl, setLogoUrl] = useState('/logo.png')
  const [phone, setPhone] = useState('+996 555 123 456')
  const [address, setAddress] = useState('Бишкек ш., Лев Толстой көч. 21')
  const [hours, setHours] = useState('Пн-Сб: 08:00 - 18:00')
  const [shippingFee, setShippingFee] = useState('300')
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('eltoy_settings')
    if (saved) {
      const data = JSON.parse(saved)
      setSiteName(data.siteName || 'ELTOY STROY')
      setLogoUrl(data.logoUrl || '/logo.png')
      setPhone(data.phone || '+996 555 123 456')
      setAddress(data.address || 'Бишкек ш., Лев Толстой көч. 21')
      setHours(data.hours || 'Пн-Сб: 08:00 - 18:00')
      setShippingFee(data.shippingFee || '300')
    }
  }, [])

  // ГАЛЕРЕЯДАН СҮРӨТ ТАНДОО БӨЛҮГҮ
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const settingsData = { siteName, logoUrl, phone, address, hours, shippingFee }
    localStorage.setItem('eltoy_settings', JSON.stringify(settingsData))
    
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-mono text-2xl font-bold uppercase">Сайттын настройкалары</h1>
        <p className="text-sm text-muted-foreground">
          Дүкөндүн негизги маалыматтарын, логотибин жана жеткирүү шарттарын өзгөртүү.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-600 font-medium text-sm">
          ✓ Настройкалар ийгиликтүү сакталды!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ДҮКӨН ММАЛЫМАТТАРЫ ЖАНА ЛОГОТИП */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
            <Store className="size-5 text-primary" />
            Негизги маалыматтар
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Дүкөндүн аты</label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Жеткирүү баасы (сом)</label>
              <div className="relative mt-1">
                <Truck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>

            {/* ЛОГОТИПТИ ГАЛЕРЕЯДАН ЖҮКТӨӨ */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Сайттын Логотиби</label>
              <div className="flex items-center gap-4">
                {/* Логотиптин алдын ала көрүнүшү (Preview) */}
                <div className="size-16 rounded-2xl border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="size-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="size-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold rounded-xl cursor-pointer transition">
                    <Upload className="size-4" />
                    Галереядан сүрөт тандоо
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-muted-foreground">PNG, JPG же SVG форматындагы сүрөттү тандаңыз</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* БАЙЛАНЫШТАР */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-lg border-b pb-2 flex items-center gap-2">
            <Phone className="size-5 text-primary" />
            Байланыш маалыматтары
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Телефон номер</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Иштөө графиги</label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Дарек</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="rounded-xl gap-2 px-8">
            <Save className="size-4" />
            Өзгөртүүлөрдү сактоо
          </Button>
        </div>
      </form>
    </div>
  )
}