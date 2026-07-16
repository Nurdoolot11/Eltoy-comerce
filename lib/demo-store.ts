'use client'

export type DemoUser = { id: string; name: string; email: string; phone: string; password: string; role: 'customer' | 'admin' }
export type DemoOrder = { id: string; userId: string; customer: string; phone: string; address: string; items: { id: string; name: string; price: number; quantity: number }[]; total: number; payment: string; status: string; createdAt: string }

const USERS = 'eltoy-users-v1'
const SESSION = 'eltoy-session-v1'
const ORDERS = 'eltoy-orders-v1'

const admin: DemoUser = { id: 'admin', name: 'ELTOY Администратор', email: 'admin@eltoy.kg', phone: '+996 700 000 001', password: 'admin123', role: 'admin' }
const customer: DemoUser = { id: 'demo', name: 'Демо кардар', email: 'demo@eltoy.kg', phone: '+996 700 000 002', password: 'demo123', role: 'customer' }

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('eltoy-store-change', { detail: key }))
}
export function seedStore() {
  const users = read<DemoUser[]>(USERS, [])
  const seeded = [admin, customer].reduce((list, account) => list.some((u) => u.id === account.id) ? list : [account, ...list], users)
  if (seeded.length !== users.length) write(USERS, seeded)
}
export const getUsers = () => read<DemoUser[]>(USERS, [admin, customer])
export const getOrders = () => read<DemoOrder[]>(ORDERS, [])
export const saveOrders = (orders: DemoOrder[]) => write(ORDERS, orders)
export const getSession = () => {
  const id = read<string | null>(SESSION, null)
  return getUsers().find((u) => u.id === id) || null
}
export function registerUser(input: Omit<DemoUser, 'id' | 'role'>) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) throw new Error('Бул email мурда катталган')
  const user: DemoUser = { ...input, id: `u-${Date.now()}`, role: 'customer' }
  write(USERS, [...users, user]); write(SESSION, user.id); return user
}
export function loginUser(email: string, password: string) {
  const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!user) throw new Error('Email же сырсөз туура эмес')
  write(SESSION, user.id); return user
}
export const logoutUser = () => write(SESSION, null)
export function updateUser(user: DemoUser) {
  write(USERS, getUsers().map((u) => u.id === user.id ? user : u)); return user
}
export function addOrder(order: DemoOrder) { saveOrders([order, ...getOrders()]) }
