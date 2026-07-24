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
  const initialFilter = params.get('filter') || ''

  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [brand, setBrand] = useState(params.get('brand') || 'all')
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
    return dbProducts
      .filter((p) => {
        const title = p.title || p.name || ''
        const desc = p.description || p.shortDescription || ''
        const text = `${title} ${desc}`.toLowerCase()

        const matchesQuery = !query || text.includes(query.toLowerCase())
        const matchesCategory = category === 'all' || p.category === category
        const matchesBrand = brand === 'all' || p.brand === brand
        const badges = p.badges || []
        const matchesInitialFilter = !initialFilter || badges.includes(initialFilter)

        const isStockAvailable = p.in_stock !== undefined ? p.in_stock : (p.stock > 0)
        const matchesStock = !available || isStockAvailable

        return matchesQuery && matchesCategory && matchesBrand && matchesInitialFilter && matchesStock
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0
        const priceB = Number(b.price) || 0
        const ratingA = Number(a.rating) || 0
        const ratingB = Number(b.rating) || 0

        if (sort === 'price-up') return priceA - priceB
        if (sort === 'price-down') return priceB - priceA
        if (sort === 'rating') return ratingB - ratingA

        const badgesA = a.badges || []
        const badgesB = b.badges || []
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
        <Select value={category} onValueChange={(val) => val && setCategory(val)}>
          <SelectTrigger className="lg:w-52">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Бардык категория</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Бренд таңдоо */}
        <Select value={brand} onValueChange={(val) => val && setBrand(val)}>
          <SelectTrigger className="lg:w-44">
            <SelectValue placeholder="Бренд" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Бардык бренд</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.slug} value={b.slug}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Сорттоо */}
        <Select value={sort} onValueChange={(val) => val && setSort(val)}>
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
          <SlidersHorizontal data-icon="inline-start" />
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
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
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