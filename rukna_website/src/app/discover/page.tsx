"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Filter,
  Sparkles
} from "lucide-react"
import Link from "next/link"

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
    duration_text: string
    max_participants: number
    photos: string[]
    difficulty_level: string
  }>
}

const categories = [
  { value: 'adventure', label: '🏔️ Adventure' },
  { value: 'cultural', label: '🎨 Cultural' },
  { value: 'food', label: '🍯 Food' },
  { value: 'nature', label: '🌿 Nature' },
  { value: 'historical', label: '🏛️ Historical' },
  { value: 'spiritual', label: '🕌 Spiritual' }
]

const locations = [
  { value: 'Abha', label: 'Abha' },
  { value: 'Khamis Mushait', label: 'Khamis Mushait' },
  { value: 'Rijal Almaa', label: 'Rijal Almaa' },
  { value: 'Al Namas', label: 'Al Namas' },
  { value: 'Tanoumah', label: 'Tanoumah' },
  { value: 'Jabal Sawda', label: 'Jabal Sawda' }
]

export default function DiscoverGuides() {
  const { data: session } = useSession()
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedLocation && selectedLocation !== 'all') params.append('location', selectedLocation)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/guides?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setGuides(data.guides || [])
      } else {
        console.error('Failed to fetch guides:', data.error)
      }
    } catch (error) {
      console.error('Error fetching guides:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedLocation, priceRange, searchTerm])

  useEffect(() => {
    fetchGuides()
  }, [fetchGuides])

  const handleSearch = () => {
    fetchGuides()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedLocation("all")
    setPriceRange({ min: "", max: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-border/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-camel font-bold mb-4 text-gradient">
              Discover Your Perfect Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find local experts who share your passion for authentic Asir experiences
            </p>
          </div>

          {/* Search & Filters */}
          <Card className="glass elegant-border">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search guides, specialties, or experiences..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-muted-foreground">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No guides found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or explore different categories.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-camel font-semibold">
                  {guides.length} guide{guides.length !== 1 ? 's' : ''} found
                </h2>
                {session && (
                  <Badge variant="secondary" className="match-score">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-matched for you
                  </Badge>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function GuideCard({ guide }: { guide: Guide }) {
  const minPrice = guide.experiences.length > 0 
    ? Math.min(...guide.experiences.map(exp => exp.price_per_person))
    : 0

  return (
    <Card className="card-hover elegant-border group">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={guide.profiles.avatar_url} />
            <AvatarFallback className="text-lg font-semibold">
              {guide.profiles.full_name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-camel font-semibold text-lg leading-tight">
                {guide.profiles.full_name}
              </h3>
              {guide.matchScore && (
                <Badge className="match-score text-xs">
                  {guide.matchScore}% match
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {guide.profiles.location}
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{guide.average_rating || 'New'}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                <span>{guide.years_experience}y exp</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {guide.bio}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {guide.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {guide.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{guide.specialties.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold">{minPrice} SAR</span>
            <span className="text-muted-foreground">/person</span>
          </div>
          
          <Link href={`/guide/${guide.id}`}>
            <Button size="sm" className="group-hover:bg-primary/90">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}