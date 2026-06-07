import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  full_name: string
  title: string
  bio: string
  location: string
  email: string
  telegram_username: string
  github_url: string
  linkedin_url: string
  avatar_url: string
  is_available_for_work: boolean
}

export type Service = {
  id: string
  title: string
  description: string
  price_from: number
  price_to: number
  currency: string
  technologies: string[]
  icon: string
}

export type Project = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  demo_url: string
  github_url: string
  technologies: string[]
  category: string
  is_featured: boolean
  completed_at: string
}

export type Skill = {
  id: string
  name: string
  category: string
  level: number
}
