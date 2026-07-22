import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezzmhrflnivuycgocjdc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_h4JPfZBitmY3oY64m28T-A_1JmFibt3'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)