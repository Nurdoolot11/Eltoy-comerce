'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Search, Image as ImageIcon, X, Upload, Video, Percent, Edit3, Check, Sparkles, Box, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { products as localProducts, formatSom } from '@/lib/data'
import { supabase } from '@/lib/supabase'

const CATEGORY_MAP: Record<string, string> = {
  dreldar: 'Дрельдер',
  perforatorlor: 'Перфораторлор',
  bolgarkalar: 'Болгаркалар',
  generatorlor: 'Генераторлор',
  shurupovertter: 'Шуруповерттер',
  shlangtar: 'Шлангдар',
  nasostar: 'Насостор',
  araalar: 'Араалар',
  saw: 'Араалар',
  kompressorlor: 'Компрессорлор',
  'shiretuu-apparattary': 'Ширетүү аппараттары',
  svarok: 'Ширетүү аппараттары',
  'kol-shaymandary': 'Кол шаймандары',
  'olchoo-shaymandary': 'Өлчөө шаймандары',
  koopsuzduk: 'Коопсуздук каражаттары',
  batareyalar: 'Батареялар жана кубаттагычтар',
  аксессуарлар: 'Аксессуарлар',
  турулуш: 'Курулуш материалдары',
  'турулуш материалдары': 'Курулуш материалдары',
}

const INITIAL_CATEGORY_OPTIONS = [
  { value: 'dreldar', label: 'Дрельдер' },
  { value: 'perforatorlor', label: 'Перфораторлор' },
  { value: 'bolgarkalar', label: 'Болгаркалар' },
  { value: 'generatorlor', label: 'Генераторлор' },
  { value: 'shurupovertter', label: 'Шуруповерттер' },
  { value: 'kompressorlor', label: 'Компрессорлор' },
  { value: 'shiretuu-apparattary', label: 'Ширетүү аппараттары' },
  { value: 'araalar', label: 'Араалар' },
  { value: 'kol-shaymandary', label: 'Кол шаймандары' },
  { value: 'olchoo-shaymandary', label: 'Өлчөө шаймандары' },
  { value: 'koopsuzduk', label: 'Коопсуздук каражаттары' },
  { value: 'batareyalar', label: 'Батареялар' },
  { value: 'shlangtar', label: 'Шлангдар' },
  { value: 'nasostar', label: 'Насостор' },
  { value: 'Курулуш материалдары', label: 'Курулуш материалдары' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Видео кароо модалы үчүн state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  
  const [quickPriceEditId, setQuickPriceEditId] = useState<string | null>(null)
  const [quickPriceValue, setQuickPriceValue] = useState('')

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [stock, setStock] = useState('10')
  const [isSale, setIsSale] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  
  const [category, setCategory] = useState('dreldar')
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')

  const [images, setImages] = useState<string[]>([])
  const [desc, setDesc] = useState('')

  // Supabase'тен жана локалдык файлдан товарларды чогуу алып чыгуу
  const fetchProducts = async () => {
    setFetchError(null)
    try {
      const formattedLocal = (localProducts || []).map((p: any) => ({
        ...p,
        title: p.title || p.name || 'Аталышы жок',
        price: p.price ?? 0,
        old_price: p.old_price ?? null,
        stock: p.stock ?? p.quantity ?? 10,
        isFromDb: false,
      }))

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase катасы:', error)
        setFetchError(error.message)
        setProducts(formattedLocal)
      } else if (data) {
        const formattedDbProducts = data.map((p: any) => ({
          ...p,
          title: p.title || p.name || 'Аталышы жок',
          price: p.price ?? 0,
          old_price: p.old_price ?? null,
          video_url: p.video_url || null,
          stock: p.stock ?? p.quantity ?? 0,
          isFromDb: true,
        }))

        setProducts([...formattedDbProducts, ...formattedLocal])
      }
    } catch (err: any) {
      console.error('Ката:', err)
      setFetchError(err.message || 'Белгисиз ката')
      const formattedLocal = (localProducts || []).map((p: any) => ({
        ...p,
        title: p.title || p.name || 'Аталышы жок',
        isFromDb: false,
      }))
      setProducts(formattedLocal)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getCategoryLabel = (catKey: string) => {
    if (!catKey) return 'Жалпы'
    const cleanKey = catKey.trim().toLowerCase()
    if (CATEGORY_MAP[cleanKey]) return CATEGORY_MAP[cleanKey]
    return catKey.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const resetForm = () => {
    setTitle('')
    setPrice('')
    setOldPrice('')
    setStock('10')
    setIsSale(false)
    setVideoUrl('')
    setCategory('dreldar')
    setIsCustomCategory(false)
    setCustomCategory('')
    setImages([])
    setDesc('')
    setEditingProduct(null)
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product)
    setTitle(product.title || product.name || '')
    setPrice(product.price?.toString() || '')
    setOldPrice(product.old_price?.toString() || '')
    setStock((product.stock ?? product.quantity ?? 0).toString())
    setIsSale(product.is_sale || false)
    setVideoUrl(product.video_url || '')
    
    const prodCat = product.category || 'dreldar'
    const existsInOptions = INITIAL_CATEGORY_OPTIONS.some(o => o.value === prodCat)

    if (existsInOptions) {
      setCategory(prodCat)
      setIsCustomCategory(false)
      setCustomCategory('')
    } else {
      setCategory('NEW_CUSTOM')
      setIsCustomCategory(true)
      setCustomCategory(prodCat)
    }

    let initialImages: string[] = []
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      initialImages = product.images
    } else if (product.image_url) {
      initialImages = [product.image_url]
    }

    setImages(initialImages)
    setDesc(product.description || '')
    setIsModalOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = 5 - images.length
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

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file)

      if (uploadError) {
        alert('Сүрөт жүктөөдө ката: ' + uploadError.message)
        continue
      }

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl)
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls].slice(0, 5))
    setUploading(false)
    e.target.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (uploadError) {
      alert('Видео жүктөөдө ката чыкты: ' + uploadError.message)
      setUploadingVideo(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    if (publicUrlData?.publicUrl) {
      setVideoUrl(publicUrlData.publicUrl)
      alert('Видео ийгиликтүү жүктөлдү!')
    }
    setUploadingVideo(false)
    e.target.value = ''
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) {
      alert('Товардын атын жана баасын сөзсүз жазыңыз!')
      return
    }

    const finalCategory = isCustomCategory ? (customCategory.trim() || 'Жалпы') : category
    const stockNum = Math.max(0, parseInt(stock) || 0)

    setLoading(true)
    const imagesToSave = images.length > 0 ? images : ['/placeholder.jpg']

    const payload = {
      name: title,
      title: title,
      price: Number(price),
      old_price: oldPrice ? Number(oldPrice) : null,
      stock: stockNum,
      is_sale: isSale,
      video_url: videoUrl ? videoUrl.trim() : null,
      category: finalCategory,
      image_url: imagesToSave[0],
      images: imagesToSave,
      description: desc,
    }

    try {
      if (editingProduct && editingProduct.isFromDb) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id)

        if (error) {
          alert('Өзгөртүүдө ката: ' + error.message)
        } else {
          alert('Товар ийгиликтүү өзгөртүлдү!')
          handleCloseModal()
          fetchProducts()
        }
      } else {
        const { error } = await supabase.from('products').insert([payload])

        if (error) {
          alert('Сактоодо ката чыкты: ' + error.message)
        } else {
          alert('Жаңы товар ийгиликтүү сакталды!')
          handleCloseModal()
          fetchProducts()
        }
      }
    } catch (err: any) {
      alert('Сактоодо ката: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPriceSave = async (id: string, isFromDb?: boolean) => {
    if (!quickPriceValue || isNaN(Number(quickPriceValue))) return
    const newPriceNum = Number(quickPriceValue)

    if (isFromDb) {
      await supabase.from('products').update({ price: newPriceNum }).eq('id', id)
    }

    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: newPriceNum } : p))
    setQuickPriceEditId(null)
  }

  const handleDeleteProduct = async (id: string, isFromDb?: boolean) => {
    if (confirm('Бул товарды өчүрүүнү каалайсызбы?')) {
      if (isFromDb) {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) {
          alert('Өчүрүүдө ката: ' + error.message)
          return
        }
      }
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const filteredProducts = products.filter((p) => {
    const t = (p.title || p.name || '').toLowerCase()
    const c = getCategoryLabel(p.category).toLowerCase()
    const q = search.toLowerCase()
    return t.includes(q) || c.includes(q)
  })

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
            Товарларды башкаруу <Sparkles className="size-5 text-amber-400" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Бааларды өзгөртүү, видео кошуу жана склад калдыгын көзөмөлдөө.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" className="rounded-xl gap-2 border-border/60">
            <RefreshCw className="size-4" /> Кайра жаңылоо
          </Button>
          <Button onClick={handleOpenAddModal} className="rounded-xl gap-2 font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20">
            <Plus className="size-4" /> Жаңы товар кошуу
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          ⚠️ <strong>Базага байланышууда ката:</strong> {fetchError}
        </div>
      )}

      {/* ИЗДӨӨ */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Издөө..." className="pl-10 rounded-xl bg-card border-border/60" />
      </div>

      {/* ТАБЛИЦА */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4">Сүрөт / Видео</th>
                <th className="p-4">Аталышы</th>
                <th className="p-4">Категория</th>
                <th className="p-4">Складда</th>
                <th className="p-4">Баасы</th>
                <th className="p-4">Статус</th>
                <th className="p-4 text-center">Аракеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredProducts.map((product) => {
                const imgSource = product.image_url || product.image || product.images?.[0]
                const isQuickEditing = quickPriceEditId === product.id
                const stockCount = product.stock ?? product.quantity ?? 0

                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center overflow-hidden border border-border/40 relative group">
                        {imgSource ? (
                          <img src={imgSource} alt="" className="size-full object-cover" />
                        ) : (
                          <ImageIcon className="size-5 text-muted-foreground" />
                        )}
                        {product.video_url && (
                          <button
                            type="button"
                            onClick={() => setPreviewVideoUrl(product.video_url)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-rose-500 hover:scale-110 transition cursor-pointer"
                            title="Видеосун көрүү"
                          >
                            <Video className="size-5 fill-rose-500 text-white" />
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-medium max-w-xs truncate text-foreground">
                      {product.title || product.name || 'Аталышы жок'}
                    </td>

                    <td className="p-4 font-semibold text-amber-400">
                      {getCategoryLabel(product.category)}
                    </td>

                    <td className="p-4 font-mono font-bold">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        stockCount > 5 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : stockCount > 0 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        <Box className="size-3.5" />
                        {stockCount} даана
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold">
                      {isQuickEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            value={quickPriceValue}
                            onChange={(e) => setQuickPriceValue(e.target.value)}
                            className="w-24 h-8 text-xs font-bold rounded-lg border-amber-500"
                            autoFocus
                          />
                          <Button size="icon" className="size-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg" onClick={() => handleQuickPriceSave(product.id, product.isFromDb)}>
                            <Check className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="size-8 rounded-lg" onClick={() => setQuickPriceEditId(null)}>
                            <X className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="inline-flex items-center gap-2 cursor-pointer hover:text-amber-400 transition group p-1.5 -m-1.5 rounded-lg hover:bg-amber-400/10"
                          onClick={() => {
                            setQuickPriceEditId(product.id)
                            setQuickPriceValue(product.price?.toString() || '')
                          }}
                        >
                          <div>
                            <span className="text-base text-foreground group-hover:text-amber-400">{formatSom(product.price || 0)}</span>
                            {product.old_price && (
                              <span className="block text-xs line-through text-muted-foreground font-normal">
                                {formatSom(product.old_price)}
                              </span>
                            )}
                          </div>
                          <Edit3 className="size-3.5 text-amber-500 opacity-40 group-hover:opacity-100 transition" />
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {product.is_sale && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          <Percent className="size-3" /> Акция
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-xl transition cursor-pointer"
                        >
                          <Edit3 className="size-3.5" />
                          Оңдоо
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id, product.isFromDb)}
                          className="flex items-center justify-center p-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🎬 ВИДЕО КӨРҮҮ МОДАЛЫ (ҮНҮ ДАЯРЖАНА АРТКА ЖАБУУ КНОПКАСЫ БАР) */}
      {previewVideoUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewVideoUrl(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-slate-900/90 rounded-3xl p-2 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* АРТКА ЖАНА ЖАБУУ КНОПКАСЫ */}
            <button
              type="button"
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white text-xs font-bold transition shadow-lg backdrop-blur-sm cursor-pointer border border-white/20"
            >
              <X className="size-4" />
              <span>Жабуу (Артка)</span>
            </button>

            {/* ВИДЕО ПЛЕЕР */}
            <video
              src={previewVideoUrl}
              controls
              autoPlay={false}
              muted={false}
              playsInline
              className="w-full h-auto max-h-[80vh] rounded-2xl relative z-10"
            />
          </div>
        </div>
      )}

      {/* ТОВАР КОШУУ / ОҢДОО МОДАЛДЫК ТЕРЕЗЕСИ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30 shrink-0">
              <h2 className="font-bold text-lg text-amber-400 flex items-center gap-2">
                {editingProduct ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
                {editingProduct ? 'Товар маалыматын оңдоо' : 'Жаңы товар кошуу'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full hover:bg-muted">
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <form id="product-form" onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Товардын аты *</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1.5 rounded-xl border-border/60" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Категория *</label>
                    <div className="mt-1.5 space-y-2">
                      <select
                        value={isCustomCategory ? 'NEW_CUSTOM' : category}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === 'NEW_CUSTOM') {
                            setIsCustomCategory(true)
                          } else {
                            setIsCustomCategory(false)
                            setCategory(val)
                          }
                        }}
                        className="w-full h-10 rounded-xl border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        {INITIAL_CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                        <option value="NEW_CUSTOM" className="font-bold text-amber-500">
                          + Жаңы категория кошуу...
                        </option>
                      </select>

                      {isCustomCategory && (
                        <Input
                          placeholder="Жаңы категориянын атын жазыңыз..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          required
                          className="rounded-xl border-amber-500/60 bg-amber-500/5 text-amber-400 font-semibold"
                          autoFocus
                        />
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 sm:col-span-2 grid gap-4 sm:grid-cols-3 items-end">
                    <div>
                      <label className="text-xs font-bold text-foreground">Жаңы баасы (сом) *</label>
                      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 rounded-xl font-bold text-base border-amber-500/40" />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Эски баасы</label>
                      <Input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="0" className="mt-1 rounded-xl border-border/60" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Box className="size-3.5" /> Складдагы саны *
                      </label>
                      <Input 
                        type="number" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        required 
                        min="0"
                        className="mt-1 rounded-xl font-bold border-emerald-500/40 text-emerald-400 bg-emerald-500/5" 
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-3 pt-2">
                      <input type="checkbox" id="modalIsSale" checked={isSale} onChange={(e) => setIsSale(e.target.checked)} className="size-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 cursor-pointer" />
                      <label htmlFor="modalIsSale" className="text-xs font-bold uppercase text-emerald-400 cursor-pointer flex items-center gap-1">
                        <Percent className="size-4" /> Акцияда
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Video className="size-4 text-rose-500" />
                        Видео кошуу (Шилтеме же файл жүктөө):
                      </span>
                      {videoUrl && <span className="text-emerald-400 text-[10px] font-bold">✓ Видео даяр</span>}
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Input 
                        value={videoUrl} 
                        onChange={(e) => setVideoUrl(e.target.value)} 
                        placeholder="https://... видео шилтемеси" 
                        className="rounded-xl text-xs flex-1 border-border/60" 
                      />
                      <label className={`flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl border border-border bg-card hover:bg-muted cursor-pointer transition text-xs font-semibold ${uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="size-3.5" />
                        <span>{uploadingVideo ? 'Жүктөлүүдө...' : 'Видео файл'}</span>
                        <input type="file" accept="video/*" disabled={uploadingVideo} onChange={handleVideoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-dashed border-border/80 p-4 bg-muted/20">
                  <label className="text-xs font-semibold uppercase text-muted-foreground flex justify-between">
                    <span>Сүрөттөр (Макс 5):</span>
                    <span className="text-amber-400 font-bold">{images.length}/5</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative size-20 rounded-xl overflow-hidden border border-border bg-background group">
                        <img src={img} alt="" className="size-full object-cover" />
                        <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 rounded-full bg-rose-600 p-1 text-white shadow">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className={`flex size-20 flex-col items-center justify-center rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer text-amber-500 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="size-5" />
                        <span className="text-[10px] font-semibold mt-1">{uploading ? '...' : 'Тандоо'}</span>
                        <input type="file" accept="image/*" multiple disabled={uploading} onChange={handleFileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Сүрөттөмө</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border/60 bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" rows={3} />
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border/60 bg-muted/30 shrink-0">
              <Button type="button" variant="outline" onClick={handleCloseModal} className="rounded-xl border-border/60">
                Токтотуу
              </Button>
              <Button type="submit" form="product-form" disabled={loading} className="rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 shadow-lg shadow-amber-500/20">
                {loading ? 'Сакталууда...' : 'Сактоо'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}