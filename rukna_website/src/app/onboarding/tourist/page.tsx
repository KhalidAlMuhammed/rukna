"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Send, User, Bot, MapPin } from "lucide-react"


interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  options?: string[]
  timestamp: Date
}

interface UserProfile {
  interests: string[]
  budget_range: 'budget' | 'moderate' | 'premium' | 'luxury'
  group_size_preference: number
  activity_level: 'low' | 'medium' | 'high'
  duration_preference: string[]
  travel_style: string
}

const CONVERSATION_FLOW = [
  {
    id: 'welcome',
    aiMessage: "مرحباً! Welcome to Rukna! 🌟 I'm your AI travel companion, and I'm here to help you discover the most authentic experiences in beautiful Asir. Think of me as your personal guide to finding adventures that match your soul. Shall we begin this journey together?",
    options: ["Yes, let's start! 🚀", "Tell me more about Asir first"]
  },
  {
    id: 'about_asir',
    aiMessage: "Asir is Saudi Arabia's hidden gem! 🏔️ Imagine misty mountains, ancient villages carved into cliffs, aromatic coffee farms, and warm-hearted locals who've preserved traditions for centuries. From adrenaline-pumping adventures to peaceful cultural immersions - Asir has experiences that will touch your heart. Ready to find yours?",
    options: ["Perfect! Let's find my experience", "Sounds amazing, I'm ready"]
  },
  {
    id: 'interests',
    aiMessage: "Tell me, what makes your heart race when you travel? What kind of experiences make you feel truly alive? I want to understand your travel soul so I can connect you with the perfect local guides.",
    options: [
      "🏔️ Adventure & Thrills",
      "🎨 Culture & Heritage", 
      "🍯 Food & Flavors",
      "🌿 Nature & Wildlife",
      "🏛️ History & Stories",
      "🕌 Spiritual & Peaceful"
    ],
    multiSelect: true,
    field: 'interests'
  },
  {
    id: 'budget',
    aiMessage: "I love that! Now, let's talk about your travel budget - not to judge, but to find experiences that give you incredible value. Every budget can unlock amazing adventures in Asir. What feels comfortable for you?",
    options: [
      "💰 Budget-conscious (Under 200 SAR/day)",
      "🌟 Moderate comfort (200-500 SAR/day)", 
      "✨ Premium experience (500-800 SAR/day)",
      "💎 Luxury immersion (800+ SAR/day)"
    ],
    field: 'budget_range'
  },
  {
    id: 'group_size',
    aiMessage: "Perfect choice! Now, are you the solo adventurer type, traveling with your special someone, or bringing the whole crew? This helps me find guides who specialize in your group dynamic.",
    options: [
      "🧍 Just me (Solo traveler)",
      "👫 Me + 1 (Couple/Friend)",
      "👨‍👩‍👧 Small group (3-4 people)",
      "👨‍👩‍👧‍👦 Family/Large group (5+ people)"
    ],
    field: 'group_size_preference'
  },
  {
    id: 'activity_level',
    aiMessage: "Excellent! I can already see some amazing experiences for your group. One more thing - what's your energy level like? Are you ready to conquer mountains, or do you prefer to savor experiences at a gentle pace?",
    options: [
      "🚶‍♀️ Relaxed pace (Low activity)",
      "🚶‍♂️ Moderate adventures (Medium activity)", 
      "🏃‍♀️ High energy explorer (High activity)"
    ],
    field: 'activity_level'
  },
  {
    id: 'duration',
    aiMessage: "I'm getting such a clear picture of your perfect Asir adventure! Last question - how do you like to experience places? Quick tastes or deep dives?",
    options: [
      "⏰ Quick experiences (2-4 hours)",
      "🌅 Half-day adventures", 
      "🌄 Full-day immersions",
      "🏕️ Multi-day journeys"
    ],
    multiSelect: true,
    field: 'duration_preference'
  },
  {
    id: 'travel_style',
    aiMessage: "Amazing! I can feel your travel personality shining through. Before I work my magic and find your perfect guide matches, tell me in your own words - what does your ideal travel experience feel like? What do you hope to discover in Asir?",
    freeText: true,
    field: 'travel_style'
  }
]

export default function TouristOnboarding() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    interests: [],
    budget_range: 'moderate',
    group_size_preference: 2,
    activity_level: 'medium',
    duration_preference: [],
    travel_style: ''
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
      addAIMessage(CONVERSATION_FLOW[0].aiMessage, CONVERSATION_FLOW[0].options)
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
    const step = CONVERSATION_FLOW[currentStep]
    
    if (step.multiSelect) {
      // For multi-select, just update the profile and add selection feedback
      updateUserProfile(step.field, option, step.multiSelect)
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
        updateUserProfile(step.field, option, step.multiSelect)
      }
      
      // Move to next step
      proceedToNextStep(option)
    }
  }
  
  const proceedToNextStep = (option?: string) => {
    // Move to next step or handle special cases
    if (currentStep === 0 && option === "Tell me more about Asir first") {
      setCurrentStep(1)
      setTimeout(() => addAIMessage(CONVERSATION_FLOW[1].aiMessage, CONVERSATION_FLOW[1].options), 1500)
    } else if (currentStep < CONVERSATION_FLOW.length - 1) {
      const nextStepIndex = currentStep === 1 ? 2 : currentStep + 1
      setCurrentStep(nextStepIndex)
      
      if (nextStepIndex < CONVERSATION_FLOW.length) {
        const nextStep = CONVERSATION_FLOW[nextStepIndex]
        setTimeout(() => addAIMessage(nextStep.aiMessage, nextStep.options), 1500)
      }
    } else {
      completeOnboarding()
    }
  }

  const handleFreeTextSubmit = () => {
    if (!freeTextInput.trim()) return
    
    addUserMessage(freeTextInput)
    updateUserProfile('travel_style', freeTextInput)
    setFreeTextInput('')
    completeOnboarding()
  }

  const updateUserProfile = (field: string, value: string, multiSelect = false) => {
    setUserProfile(prev => {
      if (field === 'interests' && multiSelect) {
        const cleanValue = value.split(' ')[1] || value // Remove emoji
        const interests = prev.interests.includes(cleanValue) 
          ? prev.interests.filter(i => i !== cleanValue)
          : [...prev.interests, cleanValue]
        return { ...prev, interests }
      }
      
      if (field === 'duration_preference' && multiSelect) {
        const cleanValue = value.split(' ')[1] || value
        const durations = prev.duration_preference.includes(cleanValue)
          ? prev.duration_preference.filter(d => d !== cleanValue)  
          : [...prev.duration_preference, cleanValue]
        return { ...prev, duration_preference: durations }
      }
      
      if (field === 'budget_range') {
        const budgetMap: Record<string, 'budget' | 'moderate' | 'premium' | 'luxury'> = {
          'Budget-conscious': 'budget',
          'Moderate': 'moderate',
          'Premium': 'premium', 
          'Luxury': 'luxury'
        }
        const mappedValue = Object.entries(budgetMap).find(([key]) => 
          value.includes(key)
        )?.[1] || 'moderate'
        return { ...prev, [field]: mappedValue }
      }
      
      if (field === 'group_size_preference') {
        const sizeMap: Record<string, number> = {
          'Just me': 1,
          'Me + 1': 2,
          'Small group': 3,
          'Family/Large': 5
        }
        const mappedValue = Object.entries(sizeMap).find(([key]) => 
          value.includes(key)
        )?.[1] || 2
        return { ...prev, [field]: mappedValue }
      }
      
      if (field === 'activity_level') {
        const levelMap: Record<string, 'low' | 'medium' | 'high'> = {
          'Relaxed': 'low',
          'Moderate': 'medium',
          'High energy': 'high'
        }
        const mappedValue = Object.entries(levelMap).find(([key]) => 
          value.includes(key)
        )?.[1] || 'medium'
        return { ...prev, [field]: mappedValue }
      }
      
      return { ...prev, [field]: value }
    })
  }

  const completeOnboarding = async () => {
    setIsComplete(true)
    
    addAIMessage(
      "✨ Perfect! I can see your travel soul clearly now. You're going to love what Asir has in store for you! I'm now finding the most compatible local guides who share your passions and can create experiences that will become lifelong memories. This will just take a moment...",
      undefined,
      2000
    )

    try {
      // Update user profile via API
      console.log('Sending profile data:', userProfile)
      const response = await fetch('/api/profile/tourist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      })
      
      const responseData = await response.json()
      console.log('API Response:', response.status, responseData)
      
      if (response.ok) {
        setTimeout(() => {
          addAIMessage(
            "🎉 Welcome to the Rukna family! Your profile is ready and I've found some incredible guides who can't wait to share their Asir with you. Ready to start discovering?",
            ["Take me to my matches! 🚀"]
          )
        }, 3000)
      } else {
        console.error('API Error:', responseData)
        throw new Error(`Failed to update profile: ${responseData.error}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      addAIMessage(
        "I've got your preferences saved! Let's get you started on discovering amazing Asir experiences.",
        ["Continue to discover guides"]
      )
    }
  }

  const handleFinalContinue = () => {
    router.push('/discover')
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const currentStepData = CONVERSATION_FLOW[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">AI Travel Companion</h1>
          </div>
          <p className="text-muted-foreground">
            Let&apos;s discover your perfect Asir experience together
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
          
          {/* Free text input for travel style */}
          {currentStepData?.freeText && !isComplete && (
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={freeTextInput}
                  onChange={(e) => setFreeTextInput(e.target.value)}
                  placeholder="Tell me about your ideal travel experience..."
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
                <MapPin className="mr-2 h-4 w-4" />
                Discover My Guide Matches
              </Button>
            </div>
          )}
        </Card>
        
        {/* Progress indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {CONVERSATION_FLOW.map((_, index) => (
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