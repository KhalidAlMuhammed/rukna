import { supabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.json();
  const { email } = formData;

  try {
    // Check if a user with this email already exists
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Ignore 'not found' error
      throw userError;
    }

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    // Store the application in the pending_applications table
    const { error: applicationError } = await supabase.from('pending_applications').insert({
      email,
      application_type: 'guide',
      form_data: formData,
    });

    if (applicationError) {
      if (applicationError.code === '23505') { // unique_violation
        return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });
      }
      throw applicationError;
    }

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting guide application:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}