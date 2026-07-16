import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Send, Camera, Play, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/site/header'
import { categories, brands } from '@/lib/data'
import { contact } from '@/lib/nav'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container-px mx-auto max-w-7xl py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ELTOY STROY — Кыргызстандагы профессионалдык электроинструменттер жана курулуш
              жабдууларынын ишенимдүү дүкөнү. Түп нуска товарлар, расмий кепилдик жана тез жеткирүү.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={`https://t.me/${contact.telegram}`}
                aria-label="Telegram"
                className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground"
              >
                <Send className="size-4" />
              </a>
              <a
                href={`https://instagram.com/${contact.instagram}`}
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground"
              >
                <Camera className="size-4" />
              </a>
              <a
                href={`https://youtube.com/${contact.youtube}`}
                aria-label="YouTube"
                className="grid size-10 place-items-center rounded-full border border-border transition hover:bg-primary hover:text-primary-foreground"
              >
                <Play className="size-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider">Категориялар</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link href={`/catalog/${c.slug}`} className="transition hover:text-primary">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider">Пайдалуу шилтемелер</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">Биз жөнүндө</Link></li>
              <li><Link href="/delivery" className="hover:text-primary">Жеткирүү</Link></li>
              <li><Link href="/payment" className="hover:text-primary">Төлөм</Link></li>
              <li><Link href="/warranty" className="hover:text-primary">Кепилдик</Link></li>
              <li><Link href="/news" className="hover:text-primary">Жаңылыктар</Link></li>
              <li><Link href="/brands" className="hover:text-primary">Бренддер</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Байланыш</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider">Байланыш</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-primary">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.hours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-px mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 ELTOY STROY. Бардык укуктар корголгон.</p>
          <p>Профессионалдык шаймандар · Бишкек, Кыргызстан</p>
        </div>
      </div>
    </footer>
  )
}