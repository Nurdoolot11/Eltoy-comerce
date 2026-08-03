'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiteShell } from "@/components/site/site-shell"
import { products as localProducts, formatSom } from "@/lib/data"
import { supabase } from "@/lib/supabase"
import { Flame, Sparkles, Layers, ShieldCheck, ShoppingCart, Play } from "lucide-react"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Баары')
  const [products, setProducts] = useState<any[]>(localProducts)

  // 🔄 Supabase базасынан жана локалдык файлдан товарларды БИРИКТИРИП тартуу
  useEffect(() => {
    async function fetchSupabaseProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          // Базадан келген товарларды форматтоо
          const formattedDbProducts = data.map((p) => ({
            id: p.id,
            name: p.name || p.title,
            price: p.price,
            oldPrice: p.old_price,
            image: p.image_url || p.image || (p.images && p.images[0]) || '/placeholder.svg',
            category: p.category || 'Шаймандар',
            isSale: p.is_sale,
            videoUrl: p.video_url,
            stock: p.stock ?? 10,
          }))

          // 🤝 Supabase товарларын жана локалдык эски товарларды чогуу көрсөтүү
          setProducts([...formattedDbProducts, ...localProducts])
        }
      } catch (err) {
        console.error('Supabase өнүмдөрүн жүктөөдө ката:', err)
      }
    }

    fetchSupabaseProducts()
  }, [])

  // Саймандардын категориялары үчүн кыргызча котормолор
  const categoryMap: { [key: string]: string } = {
    'perforatorlor': 'Перфораторлор',
    'dreldar': 'Дреллер',
    'bolgarkalar': 'Болгаркалар',
    'generatorlor': 'Генераторлор',
    'kompressorlor': 'Компрессорлор',
    'shiretuu-apparattary': 'Ширетүү аппараттары',
    'araalar': 'Араалар',
    'kol-shaymandary': 'Кол шаймандары',
    'olchoo-shaymandary': 'Өлчөө шаймандары'
  }

  const categories = ['Баары', ...Array.from(new Set(products.map(p => p.category || 'Шаймандар')))]

  // Категория боюнча гана чыпкалоо
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      return selectedCategory === 'Баары' || p.category === selectedCategory
    })
  }, [selectedCategory, products])

  return (
    <SiteShell>
      <div className="bg-[#f4f5f8] dark:bg-neutral-950 pb-20">
        
        {/* КАТЕГОРИЯЛАР ПАНЕЛИ (Pinduoduo Sticky Bar) */}
        <div className="sticky top-0 z-35 bg-white/90 dark:bg-neutral-900/90 px-4 py-3 shadow-sm backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto whitespace-nowrap max-w-7xl mx-auto px-1">
            <span className="flex items-center gap-1.5 text-xs font-black text-neutral-800 dark:text-neutral-200 mr-2 uppercase tracking-wide">
              <Layers className="size-4 text-rose-600 animate-pulse" /> Категория:
            </span>
            {categories.map((cat) => {
              const displayName = categoryMap[cat] || cat;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md shadow-rose-500/25 scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {displayName}
                </button>
              )
            })}
          </div>
        </div>

        {/* АТАЙЫН АРЗАНДАТУУЛАР БЛОГУ (Pinduoduo Blitz-Deal Banner) */}
        {selectedCategory === 'Баары' && (
          <div className="max-w-7xl mx-auto px-4 mt-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 p-4 sm:p-5 text-white shadow-xl shadow-orange-500/15">
              
              {/* Фондук кооз декорация */}
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <Flame className="w-64 h-64 text-white" />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2.5 font-black text-base sm:text-lg tracking-tight">
                  <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                    <Flame className="size-5 fill-amber-200 text-amber-200 animate-bounce" />
                  </div>
                  <span>БЛИЦ-АКЦИЯ / ХИТ ТОВАРЛАР</span>
                </div>
                <span className="rounded-full bg-black/30 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-amber-200 border border-white/10">
                  Чектелген сан 🔥
                </span>
              </div>

              {/* Блиц Товарлар Карусели */}
              <div className="no-scrollbar flex gap-3.5 overflow-x-auto pb-1 relative z-10">
                {products.slice(0, 8).map((p) => (
                  <Link 
                    key={p.id} 
                    href={`/product/${p.id}`} 
                    className="group flex-shrink-0 w-36 sm:w-40 rounded-2xl bg-white dark:bg-neutral-900 p-2.5 text-black dark:text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/20"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-950 p-2">
                      <Image 
                        src={p.image || '/placeholder.svg'} 
                        alt={p.name} 
                        fill 
                        className="object-contain p-1 transition-transform duration-500 group-hover:scale-110" 
                      />
                      {p.isSale || p.oldPrice ? (
                        <span className="absolute top-1 left-1 rounded-md bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow-sm">
                          -АКЦИЯ
                        </span>
                      ) : null}

                      {p.videoUrl && (
                        <span className="absolute bottom-1 right-1 rounded-full bg-black/60 p-1 text-white backdrop-blur-md">
                          <Play className="size-3 fill-white" />
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs font-semibold line-clamp-1 text-neutral-800 dark:text-neutral-200 group-hover:text-rose-600 transition-colors">
                      {p.name}
                    </p>

                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xs font-black text-rose-600 dark:text-rose-500">
                        {formatSom(p.price)}
                      </span>
                      {p.oldPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatSom(p.oldPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ТОВАРЛАР СЕТКАСЫ (Pinduoduo/Poizon Grid Style) */}
        <div className="max-w-7xl mx-auto px-4 mt-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-mono text-lg sm:text-xl font-black uppercase text-neutral-900 dark:text-white tracking-tight">
              <Sparkles className="size-5 text-rose-600" /> 
              {selectedCategory === 'Баары' ? 'Бардык шаймандар' : (categoryMap[selectedCategory] || selectedCategory)} 
              <span className="text-xs font-bold text-neutral-400 font-sans">({filteredProducts.length} даана)</span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-neutral-900 p-12 text-center shadow-sm border border-neutral-200/60 dark:border-neutral-800">
              <p className="text-neutral-500">Бул категорияда азырынча товарлар жок.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-neutral-200/70 dark:border-neutral-800 hover:border-rose-500/40"
                >
                  {/* Товардын сүрөтү */}
                  <div className="relative aspect-square w-full bg-neutral-50 dark:bg-neutral-950/60 overflow-hidden p-3">
                    <Image
                      src={p.image || '/placeholder.svg'}
                      alt={p.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Хит / Акция / Видео Бейдждери */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {p.isSale || p.oldPrice ? (
                        <span className="rounded-lg bg-gradient-to-r from-rose-600 to-orange-500 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-md">
                          АКЦИЯ
                        </span>
                      ) : (
                        <span className="rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white">
                          ОРИГИНАЛ
                        </span>
                      )}
                    </div>

                    {/* Видео индикатору */}
                    {p.videoUrl && (
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md shadow-md">
                        <Play className="size-3.5 fill-white" />
                      </span>
                    )}
                  </div>

                  {/* Товардын маалыматы */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      {/* B2B / Кепилдик теги */}
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3" />
                        <span>Гарантия • Оптом</span>
                      </div>

                      <h3 className="line-clamp-2 text-xs font-bold leading-snug text-neutral-800 dark:text-neutral-100 group-hover:text-rose-600 transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[11px] font-black text-rose-600 dark:text-rose-500">сом</span>
                            <span className="text-lg font-black tracking-tight text-rose-600 dark:text-rose-500 leading-none">
                              {p.price}
                            </span>
                          </div>
                          {p.oldPrice && (
                            <span className="text-[10px] text-neutral-400 line-through block mt-0.5">
                              {formatSom(p.oldPrice)}
                            </span>
                          )}
                        </div>

                        {/* Тез Корзина баскычы */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                          <ShoppingCart className="size-4" />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Складда: {p.stock ?? 10} даана</span>
                        <span className="font-extrabold text-orange-500">
                          Хит 🚀
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </SiteShell>
  )
}