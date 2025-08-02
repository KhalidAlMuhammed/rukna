"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ExperienceData {
  id: string
  title: string
  description: string
  category: string
  price_per_person: number
  duration_hours: number
  duration_text: string
  max_participants: number
  min_participants: number
  included_services: string[]
  excluded_services: string[]
  meeting_point: string
  difficulty_level: string
  photos: string[]
  guide_profiles: {
    id: string
    bio: string
    specialties: string[]
    languages_spoken: string[]
    years_experience: number
    service_areas: string[]
    max_group_size: number
    has_transportation: boolean
    average_rating: number
    total_reviews: number
    total_bookings: number
    profiles: {
      id: string
      full_name: string
      avatar_url: string
      location: string
    }
  }
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Star, 
  Users, 
  Clock, 
  Car,
  Languages,
  Medal,
  Calendar,
  ArrowLeft,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { ExperienceBooking } from "@/components/experience-booking"

interface Guide {
  id: string
  bio: string
  specialties: string[]
  languages_spoken: string[]
  years_experience: number
  service_areas: string[]
  max_group_size: number
  has_transportation: boolean
  average_rating: number
  total_reviews: number
  total_bookings: number
  matchScore?: number
  profiles: {
    id: string
    full_name: string
    avatar_url: string
    location: string
  }
  experiences: Array<{
    id: string
    title: string
    description: string
    category: string
    price_per_person: number
    duration_hours: number
    duration_text: string
    max_participants: number
    min_participants: number
    included_services: string[]
    excluded_services: string[]
    meeting_point: string
    difficulty_level: string
    photos: string[]
  }>
}

export default function GuideProfile() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchGuideData(params.id as string)
    }
  }, [params.id])

  const fetchGuideData = async (guideId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/experiences/${guideId}`)
      const data = await response.json()
      
      if (response.ok && data.experiences?.length > 0) {
        // Transform the data structure from experiences to guide
        const firstExp = data.experiences[0]
        const guideData = {
          id: guideId,
          ...firstExp.guide_profiles,
          profiles: firstExp.guide_profiles.profiles,
          experiences: data.experiences.map((exp: ExperienceData) => ({
            id: exp.id,
            title: exp.title,
            description: exp.description,
            category: exp.category,
            price_per_person: exp.price_per_person,
            duration_hours: exp.duration_hours,
            duration_text: exp.duration_text,
            max_participants: exp.max_participants,
            min_participants: exp.min_participants,
            included_services: exp.included_services,
            excluded_services: exp.excluded_services,
            meeting_point: exp.meeting_point,
            difficulty_level: exp.difficulty_level,
            photos: exp.photos
          }))
        }
        setGuide(guideData)
      } else {
        console.error('Failed to fetch guide:', data.error)
      }
    } catch (error) {
      console.error('Error fetching guide:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="h-64 bg-muted rounded mb-6"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
          <Link href="/discover">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to discovery
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/discover">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to guides
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guide Header */}
            <Card className="elegant-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="h-24 w-24 border-4 border-border">
                    <AvatarImage src={guide.profiles.avatar_url} />
                    <AvatarFallback className="text-2xl font-bold">
                      {guide.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-camel font-bold">
                        {guide.profiles.full_name}
                      </h1>
                      {guide.matchScore && (
                        <Badge className="match-score">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {guide.matchScore}% match
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {guide.profiles.location}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{guide.average_rating || 'New'}</span>
                        <span className="text-sm text-muted-foreground">
                          ({guide.total_reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{guide.years_experience} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Max {guide.max_group_size}</span>
                      </div>
                      {guide.has_transportation && (
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Transport</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3">About {guide.profiles.full_name?.split(' ')[0]}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {guide.bio}
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.languages_spoken.map(lang => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experiences */}
            <Card className="elegant-border">
              <CardHeader>
                <CardTitle className="font-camel">Available Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {guide.experiences.map((experience) => (
                  <div key={experience.id} className="border border-border/20 rounded-lg p-6 hover:border-border/40 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {experience.description}
                        </p>
                      </div>
                      <Badge className="ml-4">
                        {experience.category}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {experience.duration_text}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {experience.min_participants}-{experience.max_participants} people
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {experience.meeting_point}
                      </div>
                      <div className="text-sm">
                        <Badge variant="outline" className="text-xs">
                          {experience.difficulty_level}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">{experience.price_per_person} SAR</span>
                        <span className="text-muted-foreground ml-1">/person</span>
                      </div>
                      <Button 
                        onClick={() => setSelectedExperience(experience.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="elegant-border sticky top-4">
              <CardHeader>
                <CardTitle className="font-camel">Quick Book</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an experience to start booking
                </p>
                <div className="space-y-3">
                  {guide.experiences.slice(0, 2).map((exp) => (
                    <Button
                      key={exp.id}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setSelectedExperience(exp.id)}
                    >
                      <div>
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {exp.price_per_person} SAR - {exp.duration_text}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="elegant-border">
              <CardHeader>
                <CardTitle className="font-camel text-lg">Service Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guide.service_areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {area}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedExperience && (
        <ExperienceBooking
          experienceId={selectedExperience}
          guideId={guide.id}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  )
}