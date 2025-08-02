"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Send, User, Bot, Briefcase } from "lucide-react"


interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  options?: string[]
  timestamp: Date
}

interface GuideProfile {
  bio: string
  specialties: string[]
  languages_spoken: string[]
  years_experience: number
  service_areas: string[]
  max_group_size: number
  has_transportation: boolean
}

const GUIDE_CONVERSATION_FLOW = [
  {
    id: 'welcome',
    aiMessage: "مرحباً أهلاً وسهلاً! Welcome to Rukna, future guide! 🌟 I'm here to help you share the magic of Asir with travelers from around the world. You're about to become an ambassador for your beautiful region. Are you excited to start this journey with me?",
    options: ["Absolutely! Let's begin! 🚀", "Tell me more about being a guide"]
  },
  {
    id: 'about_guiding',
    aiMessage: "Being a Rukna guide means you're not just showing places - you're sharing your heart, your stories, and your culture! 💫 You'll connect with curious travelers, create unforgettable memories, and earn income doing what you love. Plus, you're helping preserve and share Asir's incredible heritage. Ready to become a cultural bridge?",
    options: ["Yes, I'm ready to share my Asir!", "Sounds perfect, let's do this!"]
  },
  {
    id: 'specialties',
    aiMessage: "Amazing! Now, tell me about your superpowers. What aspects of Asir do you know like the back of your hand? What makes your eyes light up when you talk about it? I want to understand your passions so I can match you with the perfect travelers.",
    options: [
      "🏔️ Adventure & Mountain Guiding",
      "🎨 Cultural Heritage & Traditions",
      "🍯 Local Food & Cooking",
      "🌿 Nature & Wildlife",
      "🏛️ Historical Sites & Stories",
      "🕌 Spiritual & Religious Sites"
    ],
    multiSelect: true,
    field: 'specialties'
  },
  {
    id: 'experience',
    aiMessage: "I can feel your passion! Now, let's talk about your experience. Don't worry if you're just starting - everyone begins somewhere, and enthusiasm often matters more than years. How long have you been sharing Asir with others?",
    options: [
      "🌱 I'm new but passionate (0-1 years)",
      "🌿 Some experience (2-3 years)",
      "🌳 Experienced guide (4-7 years)",
      "🌲 Veteran guide (8+ years)"
    ],
    field: 'years_experience'
  },
  {
    id: 'languages',
    aiMessage: "Perfect! Communication is the bridge between cultures. What languages do you speak? This helps me connect you with travelers you can communicate with naturally.",
    options: [
      "🇸🇦 Arabic (native)",
      "🇬🇧 English",
      "🇫🇷 French",
      "🇩🇪 German",
      "🇪🇸 Spanish",
      "🇮🇳 Hindi/Urdu"
    ],
    multiSelect: true,
    field: 'languages_spoken'
  },
  {
    id: 'service_areas',
    aiMessage: "Excellent! Now, which areas of Asir do you know best? Where do you feel most confident showing travelers around? Your local knowledge is your greatest asset!",
    options: [
      "🏔️ Abha (The crown jewel)",
      "🌲 Khamis Mushait",
      "🏘️ Rijal Almaa (Heritage village)",
      "🌿 Al Namas (Green valleys)",
      "☁️ Tanoumah (Cloud forests)",
      "🗻 Jabal Sawda (Highest peak)"
    ],
    multiSelect: true,
    field: 'service_areas'
  },
  {
    id: 'group_size',
    aiMessage: "That's wonderful coverage! Now, what's your sweet spot for group sizes? Some guides love intimate one-on-one experiences, others thrive with larger groups. What feels most comfortable for you?",
    options: [
      "👤 Intimate groups (1-2 people)",
      "👥 Small groups (3-4 people)",
      "👨‍👩‍👧‍👦 Medium groups (5-8 people)",
      "🚌 Large groups (9+ people)"
    ],
    field: 'max_group_size'
  },
  {
    id: 'transportation',
    aiMessage: "Great choice! One last practical question - can you provide transportation for your guests, or do you prefer meeting at specific locations? Both options work perfectly fine!",
    options: [
      "🚗 Yes, I have transportation available",
      "📍 I prefer meeting at locations"
    ],
    field: 'has_transportation'
  },
  {
    id: 'bio',
    aiMessage: "Perfect! Now comes the fun part - tell me your story! What makes you unique? Share your background, what you love about Asir, and why you want to be a guide. This is your chance to shine and connect with future guests on a personal level.",
    freeText: true,
    field: 'bio'
  }
]

export default function GuideOnboarding() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [guideProfile, setGuideProfile] = useState<GuideProfile>({
    bio: '',
    specialties: [],
    languages_spoken: ['Arabic'],
    years_experience: 0,
    service_areas: [],
    max_group_size: 4,
    has_transportation: false
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [freeTextInput, setFreeTextInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    // Start the conversation
    if (messages.length === 0) {
      addAIMessage(GUIDE_CONVERSATION_FLOW[0].aiMessage, GUIDE_CONVERSATION_FLOW[0].options)
    }
  }, [messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addAIMessage = (content: string, options?: string[], delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content,
        options,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, delay)
  }

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }])
  }

  const handleOptionSelect = (option: string, messageId: string) => {
    const step = GUIDE_CONVERSATION_FLOW[currentStep]
    
    if (step.multiSelect) {
      // For multi-select, just update the profile and add selection feedback
      updateGuideProfile(step.field, option, step.multiSelect)
      addUserMessage(option)
      
      // Add continue button if this is the first selection for multi-select
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId && msg.options) {
          const hasNextButton = msg.options.some(opt => opt.startsWith("✅ Continue"))
          if (!hasNextButton) {
            return { 
              ...msg, 
              options: [...msg.options, "✅ Continue with my selections"]
            }
          }
        }
        return msg
      }))
    } else {
      // For single select, proceed as normal
      addUserMessage(option)
      
      // Remove options from the AI message that was clicked
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, options: undefined } : msg
      ))
      
      // Handle different response types
      if (step.field) {
        updateGuideProfile(step.field, option, step.multiSelect)
      }
      
      // Move to next step
      proceedToNextStep(option)
    }
  }
  
  const proceedToNextStep = (option?: string) => {
    // Move to next step or handle special cases
    if (currentStep === 0 && option === "Tell me more about being a guide") {
      setCurrentStep(1)
      setTimeout(() => addAIMessage(GUIDE_CONVERSATION_FLOW[1].aiMessage, GUIDE_CONVERSATION_FLOW[1].options), 1500)
    } else if (currentStep < GUIDE_CONVERSATION_FLOW.length - 1) {
      const nextStepIndex = currentStep === 1 ? 2 : currentStep + 1
      setCurrentStep(nextStepIndex)
      
      if (nextStepIndex < GUIDE_CONVERSATION_FLOW.length) {
        const nextStep = GUIDE_CONVERSATION_FLOW[nextStepIndex]
        setTimeout(() => addAIMessage(nextStep.aiMessage, nextStep.options), 1500)
      }
    } else {
      completeOnboarding()
    }
  }

  const handleFreeTextSubmit = () => {
    if (!freeTextInput.trim()) return
    
    addUserMessage(freeTextInput)
    updateGuideProfile('bio', freeTextInput)
    setFreeTextInput('')
    completeOnboarding()
  }

  const updateGuideProfile = (field: string, value: string, multiSelect = false) => {
    setGuideProfile(prev => {
      if (field === 'specialties' && multiSelect) {
        const cleanValue = value.split(' ')[1]?.replace('&', '').toLowerCase() || value.toLowerCase()
        const specialties = prev.specialties.includes(cleanValue) 
          ? prev.specialties.filter(s => s !== cleanValue)
          : [...prev.specialties, cleanValue]
        return { ...prev, specialties }
      }
      
      if (field === 'languages_spoken' && multiSelect) {
        const langMap: Record<string, string> = {
          'Arabic': 'Arabic',
          'English': 'English', 
          'French': 'French',
          'German': 'German',
          'Spanish': 'Spanish',
          'Hindi/Urdu': 'Hindi'
        }
        const cleanValue = Object.entries(langMap).find(([key]) => value.includes(key))?.[1] || value
        const languages = prev.languages_spoken.includes(cleanValue)
          ? prev.languages_spoken.filter(l => l !== cleanValue)
          : [...prev.languages_spoken, cleanValue]
        return { ...prev, languages_spoken: languages }
      }
      
      if (field === 'service_areas' && multiSelect) {
        const areaMap: Record<string, string> = {
          'Abha': 'Abha',
          'Khamis Mushait': 'Khamis Mushait',
          'Rijal Almaa': 'Rijal Almaa',
          'Al Namas': 'Al Namas',
          'Tanoumah': 'Tanoumah',
          'Jabal Sawda': 'Jabal Sawda'
        }
        const cleanValue = Object.entries(areaMap).find(([key]) => value.includes(key))?.[1] || value
        const areas = prev.service_areas.includes(cleanValue)
          ? prev.service_areas.filter(a => a !== cleanValue)
          : [...prev.service_areas, cleanValue]
        return { ...prev, service_areas: areas }
      }
      
      if (field === 'years_experience') {
        const expMap: Record<string, number> = {
          'new but passionate': 0,
          'Some experience': 2,
          'Experienced': 5,
          'Veteran': 10
        }
        const mappedValue = Object.entries(expMap).find(([key]) => 
          value.toLowerCase().includes(key.toLowerCase())
        )?.[1] || 0
        return { ...prev, [field]: mappedValue }
      }
      
      if (field === 'max_group_size') {
        const sizeMap: Record<string, number> = {
          'Intimate': 2,
          'Small': 4,
          'Medium': 8,
          'Large': 15
        }
        const mappedValue = Object.entries(sizeMap).find(([key]) => 
          value.includes(key)
        )?.[1] || 4
        return { ...prev, [field]: mappedValue }
      }
      
      if (field === 'has_transportation') {
        return { ...prev, [field]: value.includes('Yes, I have') }
      }
      
      return { ...prev, [field]: value }
    })
  }

  const completeOnboarding = async () => {
    setIsComplete(true)
    
    addAIMessage(
      "🌟 Fantastic! Your guide profile is shaping up beautifully. I can already see how you'll create amazing experiences for travelers. Just give me a moment to set everything up and get you ready to welcome your first guests...",
      undefined,
      2000
    )

    try {
      // Create guide profile via API
      const response = await fetch('/api/profile/guide', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guideProfile),
      })
      
      if (response.ok) {
        setTimeout(() => {
          addAIMessage(
            "🎉 Welcome to the Rukna guide family! Your profile is now live and ready to connect with adventurous travelers. You're about to embark on an incredible journey of sharing your beloved Asir with the world!",
            ["Take me to my guide dashboard! 🚀"]
          )
        }, 3000)
      } else {
        throw new Error('Failed to create guide profile')
      }
    } catch (error) {
      console.error('Error creating guide profile:', error)
      addAIMessage(
        "Your guide profile is ready! Let's get you started on creating amazing experiences for travelers.",
        ["Continue to dashboard"]
      )
    }
  }

  const handleFinalContinue = () => {
    router.push('/guide/dashboard')
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const currentStepData = GUIDE_CONVERSATION_FLOW[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Guide AI Companion</h1>
          </div>
          <p className="text-muted-foreground">
            Let&apos;s create your guide profile and start sharing Asir&apos;s magic
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'ai'
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground ml-auto'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={option.startsWith("✅ Continue") ? "default" : "outline"}
                          size="sm"
                          className="mr-2 mb-2 text-xs"
                          onClick={() => {
                            if (option.startsWith("✅ Continue")) {
                              // Remove options and proceed to next step
                              setMessages(prev => prev.map(msg => 
                                msg.id === message.id ? { ...msg, options: undefined } : msg
                              ))
                              proceedToNextStep()
                            } else {
                              handleOptionSelect(option, message.id)
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
          
          {/* Free text input for bio */}
          {currentStepData?.freeText && !isComplete && (
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={freeTextInput}
                  onChange={(e) => setFreeTextInput(e.target.value)}
                  placeholder="Share your story and what makes you a unique guide..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
                />
                <Button onClick={handleFreeTextSubmit} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Final continue button */}
          {isComplete && messages[messages.length - 1]?.options && (
            <div className="border-t p-4">
              <Button 
                onClick={handleFinalContinue}
                className="w-full"
                size="lg"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Open My Guide Dashboard
              </Button>
            </div>
          )}
        </Card>
        
        {/* Progress indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {GUIDE_CONVERSATION_FLOW.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}