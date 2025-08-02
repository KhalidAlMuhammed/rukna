import { supabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { hostEmail } = formData;

    // Validate required fields
    if (!hostEmail || !hostEmail.trim()) {
      return NextResponse.json({ error: 'Host email is required' }, { status: 400 });
    }

    if (!formData.title || !formData.description || !formData.category) {
      return NextResponse.json({ error: 'Missing required fields: title, description, and category are required' }, { status: 400 });
    }

    console.log('Processing application for email:', hostEmail);

    // Normalize numeric fields to ensure proper data types
    const normalizedFormData = {
      ...formData,
      durationHours: parseInt(formData.durationHours) || 0,
      pricePerPerson: parseFloat(formData.pricePerPerson) || 0,
      maxParticipants: parseInt(formData.maxParticipants) || 1,
      minParticipants: parseInt(formData.minParticipants) || 1,
    };

    console.log('Normalized form data:', { 
      email: hostEmail, 
      durationHours: normalizedFormData.durationHours,
      pricePerPerson: normalizedFormData.pricePerPerson,
      maxParticipants: normalizedFormData.maxParticipants,
      minParticipants: normalizedFormData.minParticipants
    });
    
    // Check if a user with this email already exists
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', hostEmail)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Ignore 'not found' error
      console.error('Error checking for existing user:', userError);
      throw new Error(`Error checking for existing user: ${JSON.stringify(userError)}`);
    }

    if (existingUser) {
        // If the user exists, we can create the experience directly
        const { error: experienceError } = await supabase.from('experiences').insert({
          guide_id: existingUser.id,
          title: normalizedFormData.title,
          description: normalizedFormData.description,
          category: normalizedFormData.category,
          duration_hours: normalizedFormData.durationHours,
          price_per_person: normalizedFormData.pricePerPerson,
          max_participants: normalizedFormData.maxParticipants,
          min_participants: normalizedFormData.minParticipants,
          included_services: normalizedFormData.includedServices.split(',').map((s: string) => s.trim()),
          excluded_services: normalizedFormData.excludedServices.split(',').map((s: string) => s.trim()),
          meeting_point: normalizedFormData.meetingPoint,
          difficulty_level: normalizedFormData.difficultyLevel,
        });

        if (experienceError) {
          console.error('Error creating experience:', experienceError);
          throw new Error(`Error creating experience: ${JSON.stringify(experienceError)}`);
        }

        return NextResponse.json({ message: 'Experience created successfully' });

    } else {
        // If user does not exist, store application in pending_applications
        console.log('Inserting pending application for:', hostEmail);
        
        const { data: insertedData, error: applicationError } = await supabase.from('pending_applications').insert({
          email: hostEmail.trim(),
          application_type: 'experience',
          form_data: normalizedFormData,
        }).select();

        if (applicationError) {
          console.error('Full application error:', {
            message: applicationError.message,
            details: applicationError.details,
            hint: applicationError.hint,
            code: applicationError.code
          });
          
          if (applicationError.code === '23505') { // unique_violation
            return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });
          }
          
          return NextResponse.json({ 
            error: `Error inserting pending application: ${applicationError.message || 'Unknown error'}` 
          }, { status: 500 });
        }

        console.log('Application inserted successfully:', insertedData);
        
        return NextResponse.json({ message: 'Application submitted successfully' });
    }
  } catch (error) {
    console.error('Unexpected error in /api/become-guide/experience:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}