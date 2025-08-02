import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      experience_id,
      guide_id,
      booking_date,
      booking_time,
      participants,
      total_amount,
      commission_amount,
      special_requests,
      contact_phone
    } = await request.json()

    // Get user's tourist profile ID
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ 
        error: 'Tourist profile not found' 
      }, { status: 404 })
    }

    // Create booking
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        tourist_id: profile.id,
        experience_id,
        guide_id,
        booking_date,
        booking_time,
        participants,
        total_amount,
        commission_amount,
        status: 'pending',
        special_requests,
        contact_phone,
        payment_status: 'paid', // Mock payment as successful
        payment_method: 'mock_payment'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ 
        error: 'Failed to create booking',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, user_type')
      .eq('email', session.user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        experiences(id, title, description, category, duration_text, meeting_point),
        tourist_profiles!tourist_id(profiles!inner(full_name, avatar_url)),
        guide_profiles!guide_id(profiles!inner(full_name, avatar_url))
      `)

    // Filter based on user type
    if (profile.user_type === 'tourist') {
      query = query.eq('tourist_id', profile.id)
    } else if (profile.user_type === 'guide') {
      query = query.eq('guide_id', profile.id)
    }

    const { data: bookings, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}