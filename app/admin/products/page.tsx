'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Video,
  X,
  RefreshCw,
  FolderOpen
} from 'lucide-react'
import Image from 'next/image'
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type Category
} from '@/lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form Fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [stock, setStock] = useState('')
  const [unit, setUnit] = useState('шт')
  const [categoryId, setCategoryId] = useState('')
  const [inStock, setInStock] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPopular, setIsPopular] = useState(false)
  const [isNew, setIsNew] = useState(false)

  // Media States
  const [images, setImages] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Load Initial Data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      console.error('Маалыматтарды жүктөөдө ката чыкты:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Form Reset
  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setOldPrice('')
    setDiscountPercent('')
    setStock('')
    setUnit('шт')
    setCategoryId('')
    setInStock(true)
    setIsFeatured(false)
    setIsPopular(false)
    setIsNew(false)
    setImages([])
    setVideoUrl('')
    setEditingProduct(null)
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setName(product.name || '')
      setDescription(product.description || '')
      setPrice(product.price ? product.price.toString() : '')
      setOldPrice(product.old_price ? product.old_price.toString() : '')
      setDiscountPercent(product.discount_percent ? product.discount_percent.toString() : '')
      setStock(product.stock ? product.stock.toString() : '')
      setUnit(product.unit || 'шт')
      setCategoryId(product.category_id || '')
      setInStock(product.in_stock ?? true)
      setIsFeatured(product.is_featured ?? false)
      setIsPopular(product.is_popular ?? false)
      setIsNew(product.is_new ?? false)
      setImages(product.images || [])
      setVideoUrl(product.video_url || '')
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  // ☁️ CLOUDINARY'ГЕ СҮРӨТ ЖҮКТӨӨ (Параллель жүктөө кошулду)
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

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnd1pmsyl'
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        return data.secure_url ? data.secure_url : null
      })

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[]

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls].slice(0, 5))
      }
    } catch (err) {
      console.error('Ката:', err)
      alert('Сүрөт жүктөөдө ката чыкты!')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // 🎥 CLOUDINARY'ГЕ ВИДЕО ЖҮКТӨӨ
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnd1pmsyl'
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.secure_url) {
        setVideoUrl(data.secure_url)
        alert('Видео ийгиликтүү жүктөлдү!')
      } else {
        alert('Видео жүктөөдө ката: ' + (data.error?.message || 'Белгисиз ката'))
      }
    } catch (err) {
      console.error('Ката:', err)
      alert('Видео жүктөөдө ката чыкты!')
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveVideo = () => {
    setVideoUrl('')
  }

  // Automatic Calculation for Discount
  const handlePriceChange = (v: string) => {
    setPrice(v)
    const p = parseFloat(v)
    const op = parseFloat(oldPrice)
    if (p && op && op > p) {
      const disc = Math.round(((op - p) / op) * 100)
      setDiscountPercent(disc.toString())
    } else {
      setDiscountPercent('')
    }
  }

  const handleOldPriceChange = (v: string) => {
    setOldPrice(v)
    const op = parseFloat(v)
    const p = parseFloat(price)
    if (p && op && op > p) {
      const disc = Math.round(((op - p) / op) * 100)
      setDiscountPercent(disc.toString())
    } else {
      setDiscountPercent('')
    }
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price) {
      alert('Аты жана баасы сөзсүз толукталышы керек!')
      return
    }

    const payload = {
      name,
      description,
      price: parseFloat(price) || 0,
      old_price: oldPrice ? parseFloat(oldPrice) : null,
      discount_percent: discountPercent ? parseInt(discountPercent) : null,
      stock: stock ? parseInt(stock) : 0,
      unit,
      category_id: categoryId || null,
      in_stock: inStock,
      is_featured: isFeatured,
      is_popular: isPopular,
      is_new: isNew,
      images,
      video_url: videoUrl || null,
    }

    startTransition(async () => {
      try {
        if (editingProduct) {
          await updateProduct(editingProduct.id, payload)
        } else {
          await createProduct(payload)
        }
        setIsModalOpen(false)
        resetForm()
        await loadData()
      } catch (err) {
        console.error('Сактоодо ката чыкты:', err)
        alert('Сактоодо ката чыкты, кайра аракет кылыңыз!')
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Бул товарды өчүрүүнү каалайсызбы?')) return

    try {
      await deleteProduct(id)
      await loadData()
    } catch (err) {
      console.error('Өчүрүүдө ката чыкты:', err)
      alert('Товарды өчүрүү мүмкүн болбоду!')
    }
  }

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товарларды башкаруу</h1>
          <p className="text-sm text-gray-500">
            Бардык товарлардын тизмесин көрүү, жаңы кошуу же өзгөртүү
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <Plus className="h-5 w-5" />
          Жаңы товар кошуу
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Товарларды издөө..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="all">Бардык категориялар</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadData}
            title="Жаңыртуу"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
            <span className="ml-2 text-sm text-gray-500">Жүктөлүүдө...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">Товарлар табылган жок</p>
            <p className="text-xs text-gray-500">
              Издөө шарттарын өзгөртүңүз же жаңы товар кошуңуз.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Товар</th>
                  <th className="px-6 py-4">Категория</th>
                  <th className="px-6 py-4">Баасы</th>
                  <th className="px-6 py-4">Складда</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Аракеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {filteredProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id)
                  const mainImage = p.images && p.images.length > 0 ? p.images[0] : null

                  return (
                    <tr key={p.id} className="transition hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            {mainImage ? (
                              <Image
                                src={mainImage}
                                alt={p.name}
                                fill
                                priority // <-- LCP эскертүүсүн өчүрүү үчүн кошулду
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                Сүрөт жок
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.is_featured && (
                                <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                  Тандалган
                                </span>
                              )}
                              {p.is_popular && (
                                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                                  Популярдуу
                                </span>
                              )}
                              {p.is_new && (
                                <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                                  Жаңы
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {cat ? cat.name : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{p.price} сом</div>
                        {p.old_price && (
                          <div className="text-xs text-gray-400 line-through">
                            {p.old_price} сом
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {p.stock} {p.unit}
                      </td>
                      <td className="px-6 py-4">
                        {p.in_stock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Бар
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Түгөнүп калды
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(p)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-amber-600"
                            title="Өзгөртүү"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-rose-600"
                            title="Өчүрүү"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Товарды өзгөртүү' : 'Жаңы товар кошуу'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name & Category */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Товардын аты *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Мисалы: Цемент М500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Категория</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="">Тандаңыз...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700">Мүнөздөмөсү</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Товар жөнүндө толугураак..."
                />
              </div>

              {/* Price, Old Price, Discount */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Баасы (сом) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="350"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Мурдагы баасы (эгер арзандатуу болсо)
                  </label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => handleOldPriceChange(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Арзандатуу (%)
                  </label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="12"
                  />
                </div>
              </div>

              {/* Stock & Unit */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Складдагы саны
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Өлчөм бирдиги</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="шт">шт (даана)</option>
                    <option value="кг">кг (килограмм)</option>
                    <option value="т">т (тонна)</option>
                    <option value="м">м (метр)</option>
                    <option value="м²">м² (кв. метр)</option>
                    <option value="м³">м³ (куб. метр)</option>
                    <option value="пачка">пачка</option>
                    <option value="мешок">мешок</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  Складда бар
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  Тандалган (Featured)
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  Популярдуу
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  Жаңы
                </label>
              </div>

              {/* Cloudinary Image Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700">
                  Сүрөттөр (Максимум 5 сүрөт)
                </label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 hover:border-amber-500 hover:text-amber-500">
                      <Upload className="h-5 w-5" />
                      <span className="mt-1 text-[10px]">
                        {uploading ? 'Жүктөлүүдө...' : 'Кошуу'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Cloudinary Video Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700">Видео (Кааласаңыз)</label>
                {videoUrl ? (
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 bg-gray-50">
                    <div className="flex items-center gap-2 overflow-hidden text-xs text-gray-600">
                      <Video className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <span className="truncate">{videoUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-rose-500 hover:text-rose-700 text-xs font-medium"
                    >
                      Өчүрүү
                    </button>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 text-xs font-medium text-gray-500 hover:border-amber-500 hover:text-amber-500">
                    <Video className="h-4 w-4" />
                    <span>
                      {uploadingVideo ? 'Видео жүктөлүүдө...' : 'Видео файл кошуу (Cloudinary)'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Жабуу
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading || uploadingVideo}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {isPending ? 'Сакталууда...' : editingProduct ? 'Өзгөртүү' : 'Сактоо'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}