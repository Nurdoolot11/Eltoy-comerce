'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Trash2, Search, Image as ImageIcon, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Форма үчүн стейттер
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('Курулуш материалдары')
  const [newImages, setNewImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [newDesc, setNewDesc] = useState('')

  // Supabase'тен товарларды жүктөө
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Товарларды жүктөөдө ката:', error)
      } else if (data) {
        setProducts(data)
      }
    } catch (err) {
      console.error('Сервер катасы:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Компьютерден/телефондон сүрөт тандап, Supabase Storage'ке жүктөө
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = 5 - newImages.length
    if (remainingSlots <= 0) {
      alert('Максималдуу 5 сүрөт кошо аласыз!')
      return
    }

    setUploading(true)
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    const uploadedUrls: string[] = []

    for (const file of filesToUpload) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        alert('Сүрөт жүктөөдө ката: ' + uploadError.message)
        continue
      }

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl)
      }
    }

    setNewImages((prev) => [...prev, ...uploadedUrls].slice(0, 5))
    setUploading(false)
  }

  // URL аркылуу сүрөт кошуу
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    if (newImages.length >= 5) {
      alert('Максималдуу 5 сүрөт кошо аласыз!')
      return
    }
    setNewImages([...newImages, imageUrlInput.trim()])
    setImageUrlInput('')
  }

  // Сүрөттү тизмеден өчүрүү
  const handleRemoveImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  // Жаңы товарды сактоо (Ката ушул жерден оңдолду)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newPrice) return

    setLoading(true)
    const imagesToSave = newImages.length > 0 ? newImages : ['/placeholder.jpg']

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: newTitle,
            price: Number(newPrice),
            category: newCategory,
            image_url: imagesToSave[0],
            images: imagesToSave,
            description: newDesc,
            in_stock: true,
          },
        ])

      if (error) {
        alert('Ката: ' + error.message)
      } else {
        fetchProducts()
        setNewTitle('')
        setNewPrice('')
        setNewDesc('')
        setNewImages([])
        setImageUrlInput('')
        setIsAdding(false)
      }
    } catch (err) {
      alert('Товарды сактоодо ката чыкты.')
    } finally {
      setLoading(false)
    }
  }

  // Товарды өчүрүү
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Бул товарды өчүрүүнү каалайсызбы?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)

        if (error) {
          alert('Өчүрүүдө ката: ' + error.message)
        } else {
          setProducts(products.filter((p) => p.id !== id))
        }
      } catch (err) {
        alert('Сервер катасы.')
      }
    }
  }

  const filteredProducts = products.filter((p) => {
    const title = (p.title || p.name || '').toLowerCase()
    const category = (p.category || '').toLowerCase()
    const query = search.toLowerCase()

    return title.includes(query) || category.includes(query)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold uppercase">Товарларды башкаруу</h1>
          <p className="text-sm text-muted-foreground">
            Складдагы товарлардын тизмеси, баалары жана жаңы товар кошуу (Supabase Storage).
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="rounded-xl gap-2">
          <Plus className="size-4" />
          {isAdding ? 'Жабуу' : 'Жаңы товар кошуу'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProduct} className="rounded-2xl border bg-card p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-lg border-b pb-2">Жаңы товардын маалыматтары</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Товардын аты *</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Мисалы: Цемент М-500"
                required
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Баасы (сом) *</label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Мисалы: 450"
                required
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Категория</label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Мисалы: Курулуш материалдары"
                className="mt-1 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-dashed border-border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Товардын сүрөттөрү (Максимум 5 сүрөт): <span className="text-primary font-bold">{newImages.length}/5</span>
              </label>
              {uploading && <span className="text-xs text-primary font-semibold animate-pulse">Сүрөт жүктөлүүдө...</span>}
            </div>

            <div className="flex flex-wrap gap-3">
              {newImages.map((img, idx) => (
                <div key={idx} className="relative size-20 rounded-xl overflow-hidden border bg-background group">
                  <img src={img} alt={`Сүрөт ${idx + 1}`} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-destructive p-1 text-white opacity-90 hover:opacity-100 transition"
                  >
                    <X className="size-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-[9px] text-center font-bold text-primary-foreground py-0.5">
                      Башкы
                    </span>
                  )}
                </div>
              ))}

              {newImages.length < 5 && (
                <label className="flex size-20 flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 cursor-pointer transition text-primary">
                  <Upload className="size-5" />
                  <span className="text-[10px] font-semibold mt-1">Тандоо</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {newImages.length < 5 && (
              <div className="flex gap-2 pt-2">
                <Input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Же сүрөттүн URL шилтемесин чаптаңыз (/images/p1.jpg)..."
                  className="rounded-xl text-xs h-9"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddImageUrl} className="rounded-xl h-9 text-xs">
                  Кошуу
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Сүрөттөмө (Описание)</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Товар жөнүндө кошумча маалымат..."
              className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-xl">
              Токтотуу
            </Button>
            <Button type="submit" disabled={loading || uploading} className="rounded-xl">
              {loading ? 'Сакталууда...' : 'Сактоо'}
            </Button>
          </div>
        </form>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Товардын аты же категориясы менен издөө..."
          className="pl-9 rounded-xl"
        />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="p-4">Сүрөт</th>
                <th className="p-4">Аталышы</th>
                <th className="p-4">Категория</th>
                <th className="p-4">Баасы</th>
                <th className="p-4 text-right">Аракеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => {
                const imgSource = product.image_url || product.image || product.images?.[0]
                return (
                  <tr key={product.id} className="hover:bg-muted/20 transition">
                    <td className="p-4">
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border relative">
                        {imgSource ? (
                          <img src={imgSource} alt={product.title || product.name || 'Товар'} className="size-full object-cover" />
                        ) : (
                          <ImageIcon className="size-5 text-muted-foreground" />
                        )}
                        {product.images?.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl-md font-bold">
                            +{product.images.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium max-w-xs truncate">{product.title || product.name || 'Аталышы жок'}</td>
                    <td className="p-4 text-muted-foreground">{product.category || 'Жалпы'}</td>
                    <td className="p-4 font-mono font-bold">{formatSom(product.price || 0)}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}