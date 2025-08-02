import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser/user operations (RLS enabled)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  user_type: 'tourist' | 'guide'
  interests?: string[]
  specialties?: string[]
  bio?: string
  location?: string
  created_at: string
}

export interface Experience {
  id: string
  guide_id: string
  title: string
  description: string
  category: string
  price: number
  duration: string
  created_at: string
  guide?: Profile
}

export interface Booking {
  id: string
  tourist_id: string
  experience_id: string
  status: 'pending' | 'confirmed' | 'completed'
  created_at: string
  experience?: Experience
  tourist?: Profile
}

export interface Message {
  id: string
  from_user: string
  to_user: string
  content: string
  created_at: string
}