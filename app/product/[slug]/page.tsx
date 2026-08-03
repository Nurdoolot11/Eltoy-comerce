'use client'

import { use, useEffect, useState } from 'react'
import { SiteShell } from '@/components/site/site-shell'
import { ProductDetail } from '@/components/product/product-detail'
import { getProduct, products as staticProducts } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return

      const staticItem = getProduct(slug) || staticProducts.find((p) => p.id === slug || p.slug === slug)
      
      if (staticItem) {
        setProduct(staticItem)
        setLoading(false)
        return
      }

      try {
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .maybeSingle()

        if (!data) {
          const res = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .maybeSingle()
          data = res.data
        }

        if (data) {
          const imgFromArr = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null
          const safeImage = imgFromArr || data.image_url || data.image || '/placeholder.svg'

          setProduct({
            ...data,
            id: data.id,
            slug: data.slug || data.id,
            name: data.name || data.title || 'Товар',
            title: data.title || data.name || 'Товар',
            price: Number(data.price) || 0,
            image: safeImage,
            image_url: safeImage,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [safeImage],
            gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [safeImage],
            // 🎬 Видео талаасын кабыл алуу:
            video_url: data.video_url || data.video || null,
            stock: data.in_stock ? (data.stock ?? 10) : 0,
            inStock: data.in_stock ?? true,
            rating: Number(data.rating) || 5,
            specs: Array.isArray(data.specs) ? data.specs : [],
            description: data.description || '',
          })
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  return (
    <SiteShell>
      {loading ? (
        <div className="container-px mx-auto flex min-h-[50vh] items-center justify-center text-lg font-medium">
          Товар жүктөлүүдө...
        </div>
      ) : product ? (
        <ProductDetail product={product} />
      ) : (
        <div className="container-px mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Товар табылган жок</h1>
          <p className="text-muted-foreground">Мындай ID менен товар базада жок же өчүрүлгөн.</p>
        </div>
      )}
    </SiteShell>
  )
}