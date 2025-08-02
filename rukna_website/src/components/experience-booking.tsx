"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Experience {
  id: string
  title: string
  description: string
  price_per_person: number
  duration_text: string
  max_participants: number
  min_participants: number
  meeting_point: string
  included_services: string[]
  excluded_services: string[]
}

interface BookingData {
  booking_date: string
  booking_time: string
  participants: number
  special_requests: string
  contact_phone: string
}

interface ExperienceBookingProps {
  experienceId: string
  guideId: string
  onClose: () => void
}

export function ExperienceBooking({ experienceId, guideId, onClose }: ExperienceBookingProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details')
  const [bookingData, setBookingData] = useState<BookingData>({
    booking_date: '',
    booking_time: '',
    participants: 1,
    special_requests: '',
    contact_phone: ''
  })

  const fetchExperienceDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/experiences/${guideId}`)
      const data = await response.json()
      
      if (response.ok) {
        interface ExpData {
          id: string
          title: string
          description: string
          price_per_person: number
          duration_text: string
          max_participants: number
          min_participants: number
          meeting_point: string
          included_services: string[]
          excluded_services: string[]
        }
        const exp = data.experiences.find((e: ExpData) => e.id === experienceId)
        if (exp) {
          setExperience({
            id: exp.id,
            title: exp.title,
            description: exp.description,
            price_per_person: exp.price_per_person,
            duration_text: exp.duration_text,
            max_participants: exp.max_participants,
            min_participants: exp.min_participants,
            meeting_point: exp.meeting_point,
            included_services: exp.included_services || [],
            excluded_services: exp.excluded_services || []
          })
        }
      }
    } catch (error) {
      console.error('Error fetching experience:', error)
    } finally {
      setLoading(false)
    }
  }, [experienceId, guideId])

  useEffect(() => {
    fetchExperienceDetails()
  }, [fetchExperienceDetails])

  const handleBooking = async () => {
    if (!session?.user?.email || !experience) return

    try {
      setBooking(true)
      
      const totalAmount = experience.price_per_person * bookingData.participants
      const commissionAmount = totalAmount * 0.15 // 15% commission
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experience_id: experienceId,
          guide_id: guideId,
          booking_date: bookingData.booking_date,
          booking_time: bookingData.booking_time,
          participants: bookingData.participants,
          total_amount: totalAmount,
          commission_amount: commissionAmount,
          special_requests: bookingData.special_requests,
          contact_phone: bookingData.contact_phone
        })
      })

      if (response.ok) {
        setStep('confirmation')
      } else {
        const data = await response.json()
        console.error('Booking failed:', data.error)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    } finally {
      setBooking(false)
    }
  }

  const isFormValid = () => {
    return bookingData.booking_date && 
           bookingData.booking_time && 
           bookingData.participants >= (experience?.min_participants || 1) &&
           bookingData.participants <= (experience?.max_participants || 10) &&
           bookingData.contact_phone
  }

  const totalAmount = experience ? experience.price_per_person * bookingData.participants : 0

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!experience) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Experience not found</h3>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-camel text-xl">
            {step === 'details' && 'Book Experience'}
            {step === 'payment' && 'Payment Details'}
            {step === 'confirmation' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            {/* Experience Summary */}
            <Card className="bg-muted/20 border-border/40">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{experience.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {experience.duration_text}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {experience.meeting_point}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.booking_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booking_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingData.booking_time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, booking_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="participants">Participants *</Label>
                  <Input
                    id="participants"
                    type="number"
                    min={experience.min_participants}
                    max={experience.max_participants}
                    value={bookingData.participants}
                    onChange={(e) => setBookingData(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: {experience.min_participants}, Max: {experience.max_participants}
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+966 50 123 4567"
                    value={bookingData.contact_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                value={bookingData.special_requests}
                onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
              />
            </div>

            {/* What's Included */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2 text-green-700">✓ Included</h4>
                <ul className="text-sm space-y-1">
                  {experience.included_services.map((service, i) => (
                    <li key={i} className="text-muted-foreground">• {service}</li>
                  ))}
                </ul>
              </div>
              {experience.excluded_services.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-700">✗ Not Included</h4>
                  <ul className="text-sm space-y-1">
                    {experience.excluded_services.map((service, i) => (
                      <li key={i} className="text-muted-foreground">• {service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Price per person</span>
                  <span>{experience.price_per_person} SAR</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Participants</span>
                  <span>× {bookingData.participants}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{totalAmount} SAR</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span>{experience.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>{bookingData.booking_date} at {bookingData.booking_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{bookingData.participants} people</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{totalAmount} SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300">Demo Payment</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This is a demo booking system. No actual payment will be processed. 
                  Click &quot;Complete Booking&quot; to simulate a successful payment.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your booking for {experience.title} has been confirmed. 
                The guide will contact you soon to finalize the details.
              </p>
            </div>

            <Card className="bg-muted/20 text-left">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Your guide will contact you within 24 hours</li>
                  <li>• Check your dashboard for booking details</li>
                  <li>• You can message your guide directly</li>
                  <li>• Arrive at the meeting point on time</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 'details' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('payment')} 
                disabled={!isFormValid()}
              >
                Continue to Payment
              </Button>
            </>
          )}
          
          {step === 'payment' && (
            <>
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button 
                onClick={handleBooking}
                disabled={booking}
              >
                {booking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </Button>
            </>
          )}
          
          {step === 'confirmation' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => router.push('/tourist/dashboard')}>
                View Dashboard
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}