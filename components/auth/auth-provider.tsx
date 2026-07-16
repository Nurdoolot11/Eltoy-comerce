'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getSession, loginUser, logoutUser, registerUser, seedStore, updateUser, type DemoUser } from '@/lib/demo-store'

type AuthContextValue = {
  user: DemoUser | null; ready: boolean; login: (email: string, password: string) => boolean
  register: (data: { name: string; email: string; phone: string; password: string }) => boolean
  logout: () => void; update: (user: DemoUser) => void
}
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { seedStore(); setUser(getSession()); setReady(true) }, [])
  const login = (email: string, password: string) => { try { const next = loginUser(email, password); setUser(next); toast.success('Кош келиңиз!'); return true } catch (e) { toast.error(e instanceof Error ? e.message : 'Ката кетти'); return false } }
  const register = (data: { name: string; email: string; phone: string; password: string }) => { try { const next = registerUser(data); setUser(next); toast.success('Аккаунт түзүлдү'); return true } catch (e) { toast.error(e instanceof Error ? e.message : 'Ката кетти'); return false } }
  const logout = () => { logoutUser(); setUser(null); toast('Аккаунттан чыктыңыз') }
  const update = (next: DemoUser) => { setUser(updateUser(next)); toast.success('Маалымат сакталды') }
  return <AuthContext.Provider value={{ user, ready, login, register, logout, update }}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be inside AuthProvider'); return value }
