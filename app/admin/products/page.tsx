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
  products as initialProducts,
  categories,
  type Product,
  type Category
} from '@/lib/data'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()

  // Form Fields (Сиздин data.ts структураңызга ылайыкташтырылды)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [brand, setBrand] = useState('bosch')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [stock, setStock] = useState('')
  const [sku, setSku] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  
  // Media States
  const [image, setImage] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      // Демо маалыматтар же API чакыруулар
      setProducts(initialProducts)
    } catch (err) {
      console.error('Маалыматтарды жүктөөдө ката чыкты:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle Form Reset
  const resetForm = () => {
    setName('')
    setSlug('')
    setBrand('bosch')
    setCategory('')
    setPrice('')
    setOldPrice('')
    setStock('')
    setSku('')
    setShortDescription('')
    setDescription('')
    setImage('')
    setGallery([])
    setEditingProduct(null)
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setName(product.name || '')
      setSlug(product.slug || '')
      setBrand(product.brand || 'bosch')
      setCategory(product.category || '')
      setPrice(product.price ? product.price.toString() : '')
      setOldPrice(product.oldPrice ? product.oldPrice.toString() : '')
      setStock(product.stock ? product.stock.toString() : '')
      setSku(product.sku || '')
      setShortDescription(product.shortDescription || '')
      setDescription(product.description || '')
      setImage(product.image || '')
      setGallery(product.gallery || [])
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  // Cloudinary'ге сүрөт жүктөө
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const file = files[0]

    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnd1pmsyl'
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (data.secure_url) {
        if (!image) {
          setImage(data.secure_url)
        }
        setGallery((prev) => [...prev, data.secure_url])
      }
    } catch (err) {
      console.error('Ката:', err)
      alert('Сүрөт жүктөөдө ката чыкты!')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price) {
      alert('Аты жана баасы сөзсүз толукталышы керек!')
      return
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const payload: Product = {
      id: editingProduct ? editingProduct.id : 'p_' + Date.now(),
      slug: generatedSlug,
      name,
      brand,
      category,
      price: parseFloat(price) || 0,
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      image: image || '/images/product-rotary-hammer.png',
      gallery: gallery.length > 0 ? gallery : [image || '/images/product-rotary-hammer.png'],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      stock: stock ? parseInt(stock) : 10,
      sku: sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      badges: editingProduct ? editingProduct.badges : ['new'],
      shortDescription,
      description,
      specs: editingProduct ? editingProduct.specs : [
        { label: 'Кепилдик', value: '24 ай' },
        { label: 'Өлкө', value: 'Расмий импорт' },
      ],
    }

    startTransition(async () => {
      try {
        if (editingProduct) {
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? payload : p)))
        } else {
          setProducts((prev) => [payload, ...prev])
        }
        setIsModalOpen(false)
        resetForm()
      } catch (err) {
        console.error('Сактоодо ката чыкты:', err)
        alert('Сактоодо ката чыкты!')
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Бул товарды өчүрүүнү каалайсызбы?')) return

    try {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Өчүрүүдө ката чыкты:', err)
      alert('Товарды өчүрүү мүмкүн болбоду!')
    }
  }

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter
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
              <option key={c.slug} value={c.slug}>
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
            <p className="text-xs text-gray-500">Издөө шарттарын өзгөртүңүз же жаңы товар кошуңуз.</p>
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
                  <th className="px-6 py-4">Артикул (SKU)</th>
                  <th className="px-6 py-4 text-right">Аракеттер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {filteredProducts.map((p, index) => {
                  const cat = categories.find((c) => c.slug === p.category)

                  return (
                    <tr key={p.id} className="transition hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="48px"
                                priority={index < 4}
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
                            <div className="text-xs text-gray-400">Бренд: {p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {cat ? cat.name : <span className="text-gray-400">{p.category}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{p.price} сом</div>
                        {p.oldPrice && (
                          <div className="text-xs text-gray-400 line-through">{p.oldPrice} сом</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.stock} даана</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku}</td>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Товардын аты *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Мисалы: Bosch GBH Перфоратор"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Категория</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="">Категорияны тандаңыз...</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Бренд</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="bosch, makita..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Баасы (сом) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="18900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Эски баасы (Арзандатуу)</label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="23500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Складдагы саны</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Артикул (SKU)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="BSH-GBH228F"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Кыскача мүнөздөмө</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="SDS-Plus, 880 Вт..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Толук сүрөттөмөсү</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Товардын толук маалыматы..."
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700">Негизги сүрөт жана галерея</label>
                <div className="flex flex-wrap gap-3">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <Image
                        src={img}
                        alt="Product preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 hover:border-amber-500 hover:text-amber-500">
                    <Upload className="h-5 w-5" />
                    <span className="mt-1 text-[10px]">{uploading ? 'Жүктөлүүдө...' : 'Кошуу'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  disabled={isPending || uploading}
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