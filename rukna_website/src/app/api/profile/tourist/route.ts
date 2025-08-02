import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session in tourist API:', session)
    
    if (!session?.user?.email) {
      console.log('No session or user email found')
      return NextResponse.json({ 
        error: 'Unauthorized', 
        debug: { hasSession: !!session, hasUser: !!session?.user, hasEmail: !!session?.user?.email }
      }, { status: 401 })
    }
    
    // Get user ID from profiles table using email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single()
    
    if (profileError || !profile) {
      console.log('Profile not found for user:', session.user.email)
      return NextResponse.json({ 
        error: 'Profile not found. Please complete sign-up first.',
        details: profileError?.message
      }, { status: 404 })
    }
    
    const userId = profile.id

    const profileData = await request.json()
    console.log('Profile data to update:', profileData)
    
    // Upsert tourist profile (update if exists, insert if doesn't)
    const { data, error } = await supabaseAdmin
      .from('tourist_profiles')
      .upsert({ id: userId, ...profileData })
      .select()

    if (error) {
      console.error('Error upserting tourist profile:', error)
      return NextResponse.json({ 
        error: 'Failed to update profile', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    console.log('Successfully updated tourist profile:', data)
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}