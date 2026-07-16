'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { brands, categories, products } from '@/lib/data'

export function CatalogClient() {
  const params = useSearchParams(); const initialFilter = params.get('filter') || ''
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [brand, setBrand] = useState(params.get('brand') || 'all')
  const [sort, setSort] = useState('featured')
  const [available, setAvailable] = useState(false)
  const filtered = useMemo(() => products.filter((p) => {
    const text = `${p.name} ${p.shortDescription}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase())) && (category === 'all' || p.category === category) && (brand === 'all' || p.brand === brand) && (!initialFilter || p.badges.includes(initialFilter as 'new' | 'sale')) && (!available || p.stock > 0)
  }).sort((a,b) => sort === 'price-up' ? a.price-b.price : sort === 'price-down' ? b.price-a.price : sort === 'rating' ? b.rating-a.rating : Number(b.badges.includes('featured'))-Number(a.badges.includes('featured'))), [query, category, brand, sort, available, initialFilter])
  const reset = () => { setQuery(''); setCategory('all'); setBrand('all'); setAvailable(false) }
  return <div className="container-px mx-auto max-w-7xl py-10">
    <div className="mb-8 flex flex-col gap-3"><p className="font-mono text-sm uppercase tracking-widest text-primary">Профессионалдык ассортимент</p><h1 className="font-mono text-4xl font-bold uppercase md:text-5xl">Инструменттер каталогу</h1><p className="max-w-2xl text-muted-foreground">18 түп нуска товар. Бишкек боюнча 24 саатта жеткирүү жана расмий кепилдик.</p></div>
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Товар издөө..." className="pl-10"/></div>
      <Select value={category} onValueChange={setCategory}><SelectTrigger className="lg:w-52"><SelectValue placeholder="Категория"/></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">Бардык категория</SelectItem>{categories.map(c=><SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectGroup></SelectContent></Select>
      <Select value={brand} onValueChange={setBrand}><SelectTrigger className="lg:w-44"><SelectValue placeholder="Бренд"/></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">Бардык бренд</SelectItem>{brands.map(b=><SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>)}</SelectGroup></SelectContent></Select>
      <Select value={sort} onValueChange={setSort}><SelectTrigger className="lg:w-48"><SelectValue/></SelectTrigger><SelectContent><SelectGroup><SelectItem value="featured">Сунушталган</SelectItem><SelectItem value="price-up">Баасы: төмөн</SelectItem><SelectItem value="price-down">Баасы: жогору</SelectItem><SelectItem value="rating">Рейтинг</SelectItem></SelectGroup></SelectContent></Select>
      <Button variant={available?'default':'outline'} onClick={()=>setAvailable(!available)}><SlidersHorizontal data-icon="inline-start"/>Складда</Button>
      <Button variant="ghost" size="icon" onClick={reset} aria-label="Фильтрди тазалоо"><X/></Button>
    </div>
    <div className="mb-5 flex items-center justify-between"><p className="text-sm text-muted-foreground">{filtered.length} товар табылды</p></div>
    {filtered.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="rounded-2xl border bg-card py-20 text-center"><p className="text-lg font-semibold">Товар табылган жок</p><Button variant="link" onClick={reset}>Фильтрлерди тазалоо</Button></div>}
  </div>
}
