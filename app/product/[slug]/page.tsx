import { notFound } from 'next/navigation'
import { SiteShell } from '@/components/site/site-shell'
import { ProductDetail } from '@/components/product/product-detail'
import { getProduct } from '@/lib/data'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = getProduct(slug); if (!product) notFound()
  return <SiteShell><ProductDetail product={product}/></SiteShell>
}
