import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { guideId: string } }
) {
  try {
    const { data: experiences, error } = await supabaseAdmin
      .from('experiences')
      .select(`
        *,
        guide_profiles!inner(
          *,
          profiles!inner(id, full_name, avatar_url, location)
        )
      `)
      .eq('guide_id', params.guideId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching experiences:', error)
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}