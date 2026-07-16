import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SiteShell } from '@/components/site/site-shell'
import { news } from '@/lib/data'
export default async function NewsPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=news.find(n=>n.slug===slug);if(!item)notFound();return <SiteShell><article className="container-px mx-auto max-w-4xl py-12"><p className="text-sm text-primary">{item.category} · {item.date}</p><h1 className="mt-3 text-balance font-mono text-4xl font-bold uppercase md:text-6xl">{item.title}</h1><div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-secondary"><Image src={item.image} alt={item.title} fill className="object-contain p-8"/></div><p className="mt-8 text-lg leading-relaxed text-muted-foreground">{item.content}</p></article></SiteShell>}
