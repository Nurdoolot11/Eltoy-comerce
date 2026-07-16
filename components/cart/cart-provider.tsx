'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { products, type Product } from '@/lib/data'

export type CartItem = {
  id: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  wishlist: string[]
  compare: string[]
  addToCart: (id: string, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (id: string) => void
  toggleCompare: (id: string) => void
  cartCount: number
  cartTotal: number
  getProductById: (id: string) => Product | undefined
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_KEY = 'eltoy-cart'
const WISH_KEY = 'eltoy-wishlist'
const COMPARE_KEY = 'eltoy-compare'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(CART_KEY) || '[]'))
      setWishlist(JSON.parse(localStorage.getItem(WISH_KEY) || '[]'))
      setCompare(JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]'))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, hydrated])
  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist, hydrated])
  useEffect(() => {
    if (hydrated) localStorage.setItem(COMPARE_KEY, JSON.stringify(compare))
  }, [compare, hydrated])

  const getProductById = (id: string) => products.find((p) => p.id === id)

  const addToCart = (id: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { id, quantity }]
    })
    toast.success('Себетке кошулду', {
      description: getProductById(id)?.name,
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        toast('Тандалгандардан алынды')
        return prev.filter((x) => x !== id)
      }
      toast.success('Тандалгандарга кошулду')
      return [...prev, id]
    })
  }

  const toggleCompare = (id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) {
        toast.error('Салыштыруу үчүн 4 товар жетиштүү')
        return prev
      }
      toast.success('Салыштырууга кошулду')
      return [...prev, id]
    })
  }

  const cartCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const cartTotal = useMemo(
    () =>
      items.reduce((s, i) => {
        const p = getProductById(i.id)
        return s + (p ? p.price * i.quantity : 0)
      }, 0),
    [items],
  )

  const value: CartContextValue = {
    items,
    wishlist,
    compare,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    toggleCompare,
    cartCount,
    cartTotal,
    getProductById,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
