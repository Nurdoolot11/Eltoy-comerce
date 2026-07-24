'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { brands, categories } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export function CatalogClient() {
  const params = useSearchParams()
  const initialFilter = params ? params.get('filter') || '' : ''

  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState(params ? params.get('q') || '' : '')
  const [category, setCategory] = useState(params ? params.get('category') || 'all' : 'all')
  const [brand, setBrand] = useState(params ? params.get('brand') || 'all' : 'all')
  const [sort, setSort] = useState('featured')
  const [available, setAvailable] = useState(false)

  // Supabase'тен товарларды алуу
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Товарларды алууда ката:', error.message)
        } else if (data) {
          setDbProducts(data)
        }
      } catch (err) {
        console.error('Сервер катасы:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Фильтрация жана сорттоо
  const filtered = useMemo(() => {
    return (dbProducts || [])
      .filter((p) => {
        if (!p) return false
        const title = p.title || p.name || ''
        const desc = p.description || p.shortDescription || ''
        const text = `${title} ${desc}`.toLowerCase()

        const matchesQuery = !query || text.includes(query.toLowerCase())
        const matchesCategory = category === 'all' || p.category === category
        const matchesBrand = brand === 'all' || p.brand === brand
        const badges = Array.isArray(p.badges) ? p.badges : []
        const matchesInitialFilter = !initialFilter || badges.includes(initialFilter)

        const isStockAvailable = p.in_stock !== undefined ? Boolean(p.in_stock) : Number(p.stock || 0) > 0
        const matchesStock = !available || isStockAvailable

        return matchesQuery && matchesCategory && matchesBrand && matchesInitialFilter && matchesStock
      })
      .sort((a, b) => {
        const priceA = Number(a?.price) || 0
        const priceB = Number(b?.price) || 0
        const ratingA = Number(a?.rating) || 0
        const ratingB = Number(b?.rating) || 0

        if (sort === 'price-up') return priceA - priceB
        if (sort === 'price-down') return priceB - priceA
        if (sort === 'rating') return ratingB - ratingA

        const badgesA = Array.isArray(a?.badges) ? a.badges : []
        const badgesB = Array.isArray(b?.badges) ? b.badges : []
        return Number(badgesB.includes('featured')) - Number(badgesA.includes('featured'))
      })
  }, [dbProducts, query, category, brand, sort, available, initialFilter])

  const reset = () => {
    setQuery('')
    setCategory('all')
    setBrand('all')
    setAvailable(false)
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="mb-8 flex flex-col gap-3">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">Профессионалдык ассортимент</p>
        <h1 className="font-mono text-4xl font-bold uppercase md:text-5xl">Инструменттер каталогу</h1>
        <p className="max-w-2xl text-muted-foreground">
          Бишкек боюнча 24 саатта жеткирүү жана расмий кепилдик.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Товар издөө..." className="pl-10" />
        </div>

        {/* Категория таңдоо */}
        <Select value={category} onValueChange={(val) => setCategory(val || 'all')}>
          <SelectTrigger className="lg:w-52">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Бардык категория</SelectItem>
              {(categories || []).map((c) => (
                <SelectItem key={c.slug || c.name} value={c.slug || c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Бренд таңдоо */}
        <Select value={brand} onValueChange={(val) => setBrand(val || 'all')}>
          <SelectTrigger className="lg:w-44">
            <SelectValue placeholder="Бренд" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Бардык бренд</SelectItem>
              {(brands || []).map((b) => (
                <SelectItem key={b.slug || b.name} value={b.slug || b.name}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Сорттоо */}
        <Select value={sort} onValueChange={(val) => setSort(val || 'featured')}>
          <SelectTrigger className="lg:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="featured">Сунушталган</SelectItem>
              <SelectItem value="price-up">Баасы: төмөн</SelectItem>
              <SelectItem value="price-down">Баасы: жогору</SelectItem>
              <SelectItem value="rating">Рейтинг</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant={available ? 'default' : 'outline'} onClick={() => setAvailable(!available)}>
          <SlidersHorizontal className="mr-2 size-4" />
          Складда
        </Button>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Фильтрди тазалоо">
          <X />
        </Button>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Жүктөлүүдө...' : `${filtered.length} товар табылды`}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Каталог жүктөлүүдө...</div>
      ) : filtered.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filtered.map((p) => {
            const safeImage = p.image_url || p.image || (Array.isArray(p.images) ? p.images[0] : '/placeholder.jpg')
            const safeProduct = {
              ...p,
              id: p.id,
              title: p.title || p.name || 'Аталышы жок',
              name: p.name || p.title || 'Аталышы жок',
              price: Number(p.price) || 0,
              image: safeImage,
              image_url: safeImage,
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [safeImage],
              category: p.category || 'Курулуш материалдары',
              brand: p.brand || 'ELTOY',
              inStock: p.in_stock ?? true,
              in_stock: p.in_stock ?? true,
              rating: Number(p.rating) || 5,
              badges: Array.isArray(p.badges) ? p.badges : [],
            }

            return <ProductCard key={p.id} product={safeProduct} />
          })}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card py-20 text-center">
          <p className="text-lg font-semibold">Товар табылган жок</p>
          <Button variant="link" onClick={reset}>
            Фильтрлерди тазалоо
          </Button>
        </div>
      )}
    </div>
  )
}