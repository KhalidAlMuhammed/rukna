import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData = await request.json()
    
    // Update user type to guide
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ user_type: 'guide' })
      .eq('id', session.user.id)

    if (profileError) {
      console.error('Error updating user type:', profileError)
      return NextResponse.json({ error: 'Failed to update user type' }, { status: 500 })
    }

    // Create guide profile
    const { data, error } = await supabaseAdmin
      .from('guide_profiles')
      .upsert({ id: session.user.id, ...profileData })
      .select()

    if (error) {
      console.error('Error creating guide profile:', error)
      return NextResponse.json({ error: 'Failed to create guide profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}