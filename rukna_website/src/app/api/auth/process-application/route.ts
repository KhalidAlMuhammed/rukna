
import { supabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function POST(req: Request) {
  const { user } = await req.json();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'User not provided' }, { status: 400 });
  }

  try {
    const { data: application, error: applicationError } = await supabase
      .from('pending_applications')
      .select('*')
      .eq('email', user.email)
      .single();

    if (applicationError || !application) {
      // No pending application found, or an error occurred.
      // This is not necessarily an error in the flow, so we return success.
      return NextResponse.json({ message: 'No pending application to process' });
    }

    const { application_type, form_data } = application;

    if (application_type === 'guide') {
      await processGuideApplication(user.id, form_data);
    } else if (application_type === 'experience') {
      await processExperienceApplication(user.id, form_data);
    }

    // Delete the pending application
    await supabase.from('pending_applications').delete().eq('id', application.id);

    return NextResponse.json({ message: 'Application processed successfully' });
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function processGuideApplication(userId: string, formData: any) {
  const {
    fullName,
    email,
    phone,
    bio,
    specialties,
    languagesSpoken,
    yearsExperience,
    serviceAreas,
    maxGroupSize,
    hasTransportation,
    preferences,
  } = formData;

  // Update the existing profile
  await supabase.from('profiles').update({
    full_name: fullName,
    phone,
    user_type: 'guide',
  }).eq('id', userId);

  // Create the guide profile
  await supabase.from('guide_profiles').insert({
    id: userId,
    bio,
    specialties: specialties.split(',').map((s: string) => s.trim()),
    languages_spoken: languagesSpoken.split(',').map((s: string) => s.trim()),
    years_experience: yearsExperience,
    service_areas: serviceAreas.split(',').map((s: string) => s.trim()),
    max_group_size: maxGroupSize,
    has_transportation: hasTransportation,
    guiding_preferences: Object.keys(preferences).filter((key) => preferences[key]),
  });
}

async function processExperienceApplication(userId: string, formData: any) {
    const {
    title,
    description,
    category,
    durationHours,
    pricePerPerson,
    maxParticipants,
    minParticipants,
    includedServices,
    excludedServices,
    meetingPoint,
    difficultyLevel,
    hostName,
    hostPhone,
  } = formData;

  // Update the existing profile
  await supabase.from('profiles').update({
    full_name: hostName,
    phone: hostPhone,
    user_type: 'guide',
  }).eq('id', userId);

  // Create the guide profile if it doesn't exist
  const { data: existingGuideProfile } = await supabase
    .from('guide_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existingGuideProfile) {
    await supabase.from('guide_profiles').insert({
      id: userId,
      bio: 'Experience Host',
    });
  }

  // Create the experience
  await supabase.from('experiences').insert({
    guide_id: userId,
    title,
    description,
    category,
    duration_hours: durationHours,
    price_per_person: pricePerPerson,
    max_participants: maxParticipants,
    min_participants: minParticipants,
    included_services: includedServices.split(',').map((s: string) => s.trim()),
    excluded_services: excludedServices.split(',').map((s: string) => s.trim()),
    meeting_point: meetingPoint,
    difficulty_level: difficultyLevel,
  });
}
