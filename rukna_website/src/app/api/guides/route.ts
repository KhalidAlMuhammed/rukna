import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface Experience {
  id: string
  title: string
  description: string
  category: string
  price_per_person: number
  duration_text: string
  max_participants: number
  photos: string[]
  difficulty_level: string
}

interface TouristProfile {
  interests: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const session = await getServerSession(authOptions)
    
    let query = supabaseAdmin
      .from('guide_profiles')
      .select(`
        *,
        profiles!inner(id, email, full_name, avatar_url, location),
        experiences(
          id, title, description, category, price_per_person, 
          duration_text, max_participants, photos, difficulty_level
        )
      `)
      .eq('verification_status', 'approved')
      .eq('is_active', true)

    // Apply filters
    if (category) {
      query = query.contains('specialties', [category])
    }
    
    if (location) {
      query = query.contains('service_areas', [location])
    }
    
    if (search) {
      query = query.or(`bio.ilike.%${search}%,specialties.cs.{${search}}`)
    }

    const { data: guides, error } = await query.order('average_rating', { ascending: false })

    if (error) {
      console.error('Error fetching guides:', error)
      return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 })
    }

    // Filter by price range if specified
    let filteredGuides = guides || []
    if (minPrice || maxPrice) {
      filteredGuides = guides?.filter(guide => {
        const experiences = (guide.experiences as Experience[]) || []
        if (experiences.length === 0) return false
        const prices = experiences.map(exp => exp.price_per_person)
        const minGuidePrice = Math.min(...prices)
        const maxGuidePrice = Math.max(...prices)
        
        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : Infinity
        
        return minGuidePrice >= min && maxGuidePrice <= max
      }) || []
    }

    // Calculate match scores if user is logged in
    if (session?.user?.email) {
      // Get user's interests for matching
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          tourist_profiles!inner(interests)
        `)
        .eq('email', session.user.email)
        .single()

      if (userProfile?.tourist_profiles && Array.isArray(userProfile.tourist_profiles) && userProfile.tourist_profiles.length > 0) {
        const touristProfile = userProfile.tourist_profiles[0] as TouristProfile
        const userInterests = touristProfile.interests
        
        filteredGuides = filteredGuides.map(guide => {
          // Calculate simple overlap-based match score
          const guideSpecialties = guide.specialties || []
          const overlap = userInterests.filter((interest: string) => 
            guideSpecialties.some((specialty: string) => 
              specialty.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(specialty.toLowerCase())
            )
          ).length
          
          const matchScore = Math.min(100, Math.max(50, (overlap / Math.max(userInterests.length, guideSpecialties.length)) * 100 + 20))
          
          return { ...guide, matchScore: Math.round(matchScore) }
        })
        
        // Sort by match score
        filteredGuides.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      }
    }

    return NextResponse.json({ guides: filteredGuides })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}