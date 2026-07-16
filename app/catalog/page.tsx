import { Suspense } from 'react'
import { SiteShell } from '@/components/site/site-shell'
import { CatalogClient } from '@/components/catalog/catalog-client'

export default function CatalogPage() {
  return <SiteShell><Suspense fallback={<div className="container-px mx-auto max-w-7xl py-20">Каталог жүктөлүүдө...</div>}><CatalogClient /></Suspense></SiteShell>
}
