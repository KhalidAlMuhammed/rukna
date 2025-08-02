import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // Test basic connection
    const { data: tables, error } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        status: 'database_error',
        error: error.message,
        suggestion: 'Run the supabase-setup.sql script in your Supabase dashboard'
      })
    }

    return NextResponse.json({ 
      status: 'connected',
      message: 'Database is connected and tables exist!'
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'connection_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check your Supabase environment variables'
    })
  }
}