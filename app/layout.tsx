import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import { CartProvider } from '@/components/cart/cart-provider'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eltoystroy.kg'),
  title: {
    default: 'ELTOY STROY — Профессионалдык шаймандар жана курулуш жабдуулары',
    template: '%s | ELTOY STROY',
  },
  description:
    'ELTOY STROY — Кыргызстандагы профессионалдык электроинструменттер жана курулуш жабдууларынын премиум дүкөнү. Bosch, Makita, DeWalt, INGCO, Total жана башка дүйнөлүк бренддер. Тез жеткирүү жана расмий кепилдик.',
  keywords: [
    'электроинструмент',
    'перфоратор',
    'болгарка',
    'дрель',
    'курулуш шаймандары',
    'Bosch',
    'Makita',
    'DeWalt',
    'ELTOY STROY',
    'Бишкек',
  ],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'ky_KG',
    siteName: 'ELTOY STROY',
    title: 'ELTOY STROY — Профессионалдык шаймандар',
    description:
      'Профессионалдык электроинструменттер жана курулуш жабдууларынын премиум дүкөнү.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ky" className={`dark bg-background ${manrope.variable} ${oswald.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
