'use client'

import { useState, useEffect } from 'react'
import { Star, CheckCircle2, Trash2, MessageSquare, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('eltoy_reviews')
    if (saved) {
      setReviews(JSON.parse(saved))
    } else {
      // Базалык демо пикирлер
      const initialReviews = [
        {
          id: 'rev-1',
          author: 'Асан Бердибеков',
          productName: 'Bosch GBH 2-28 F Перфоратор',
          rating: 5,
          comment: 'Абдан сапаттуу перфоратор экен, курулушта жакшы иштеп жатат. Жеткирүү да заматта болду!',
          status: 'опубликовано',
          createdAt: '2026-07-20'
        },
        {
          id: 'rev-2',
          author: 'Бакыт Токтогулов',
          productName: 'Makita HR2470 Перфоратор',
          rating: 4,
          comment: 'Жакшы товар, баасы да арзан экен. Батареясы бир аз бат отурат экен бирок кубаттуу.',
          status: 'на модерации',
          createdAt: '2026-07-21'
        }
      ]
      setReviews(initialReviews)
      localStorage.setItem('eltoy_reviews', JSON.stringify(initialReviews))
    }
  }, [])

  // Пикирди сайтка чыгарууга уруксат берүү
  const handleApprove = (id: string) => {
    const updated = reviews.map((r) => r.id === id ? { ...r, status: 'опубликовано' } : r)
    setReviews(updated)
    localStorage.setItem('eltoy_reviews', JSON.stringify(updated))
  }

  // Пикирди өчүрүү
  const handleDelete = (id: string) => {
    if (confirm('Бул пикирди өчүрүүнү каалайсызбы?')) {
      const updated = reviews.filter((r) => r.id !== id)
      setReviews(updated)
      localStorage.setItem('eltoy_reviews', JSON.stringify(updated))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold uppercase">Пикирлерди модерациялоо</h1>
        <p className="text-sm text-muted-foreground">
          Кардарлар тарабынан калтырылган отзывдарды текшерип, сайтка чыгарыңыз же өчүрүңүз.
        </p>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            <MessageSquare className="mx-auto size-12 opacity-30" />
            <p className="mt-3 font-medium">Азырынча пикирлер жок</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h3 className="font-bold text-base">{rev.author}</h3>
                  <p className="text-xs text-muted-foreground">Товар: <span className="font-medium text-foreground">{rev.productName}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    rev.status === 'опубликовано' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {rev.status === 'опубликовано' ? 'Сайтка чыкты' : 'Текшерилүүдө'}
                  </span>
                  <span className="text-xs text-muted-foreground">{rev.createdAt}</span>
                </div>
              </div>

              {/* ЖЫЛДЫЗЧАЛАР */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < rev.rating ? 'fill-current' : 'text-muted stroke-muted-foreground'}`}
                  />
                ))}
              </div>

              {/* ПИКИРДИН ТЕКСТИ */}
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                "{rev.comment}"
              </p>

              {/* БАСКЫЧТАР */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {rev.status !== 'опубликовано' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(rev.id)}
                    className="font-bold bg-primary text-black hover:bg-primary/90"
                  >
                    <CheckCircle2 className="mr-1.5 size-4" />
                    Сайтка чыгаруу
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(rev.id)}
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <Trash2 className="mr-1.5 size-4" />
                  Өчүрүү
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}