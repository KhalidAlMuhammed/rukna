"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Chrome, ArrowLeft, Loader2 } from "lucide-react"

const translations = {
  en: {
    welcome: "Welcome Back",
    description: "Sign in to continue your journey in Asir",
    googleSignIn: "Continue with Google",
    signingIn: "Signing in...",
    notA: "Not a",
    tourist: "Tourist",
    guide: "Local Guide",
    imATourist: "I'm a Tourist",
    imAGuide: "I'm a Local Guide",
    terms: "By signing in, you agree to our Terms of Service and Privacy Policy. This is a hackathon prototype for demonstration purposes.",
    demoInstructions: "This is a hackathon MVP. Sign in with Google to explore AI-powered matching between tourists and local guides in the Asir region.",
    demoTitle: "Demo Instructions",
    backToHome: "Back to Home",
    applicationSubmitted: "Application submitted! Please sign up or sign in to complete the process.",
    failedToSignIn: "Failed to sign in with Google. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },
  ar: {
    welcome: "الله يحييك مرة ثانية",
    description: "سجل دخولك عشان تكمل رحلتك في ديرتنا.",
    googleSignIn: "كمل مع جوجل",
    signingIn: "لحظة... نسجل دخولك",
    notA: "مانت",
    tourist: "سايح",
    guide: "مرشد",
    imATourist: "أنا سايح",
    imAGuide: "أنا مرشد",
    terms: "يوم تسجل دخولك، ترا توافق على شروطنا وسياسة الخصوصية. ذا نموذج أولي لهاكاثون للعرض بس.",
    demoInstructions: "ذا نموذج أولي لهاكاثون. سجل دخولك بجوجل عشان تشوف كيف نوفق بين السياح والمرشدين في ديرتنا.",
    demoTitle: "تعليمات",
    backToHome: "ارجع للرئيسية",
    applicationSubmitted: "استلمنا طلبك! سجل دخولك أو سو حساب عشان تكمل.",
    failedToSignIn: "ما قدرنا نسجل دخولك بجوجل. حاول مرة ثانية.",
    unexpectedError: "صارت مشكلة. حاول مرة ثانية.",
  }
}

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = translations[lang];
  
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const userType = searchParams.get("type") || "tourist"

  useEffect(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang === 'ar' || urlLang === 'en') {
      setLang(urlLang);
    }
    const urlMessage = searchParams.get("message");
    if (urlMessage) {
      setMessage(t.applicationSubmitted);
    }
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl, searchParams, t.applicationSubmitted])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      
      const result = await signIn("google", {
        callbackUrl: userType === "guide" ? "/onboarding/guide" : "/onboarding/tourist",
        redirect: false
      })

      if (result?.error) {
        setError(t.failedToSignIn)
      } else if (result?.url) {
        // After successful sign-in, process any pending application
        const session = await getSession();
        if (session?.user) {
          await fetch('/api/auth/process-application', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: session.user }),
          });
        }
        router.push(result.url)
      }
    } catch (error) {
      setError(t.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </Link>
          </Button>
        </div>

        {/* Sign in card */}
        <Card className="w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-gradient">رُكْنَة</h1>
              <Badge variant="secondary">Hackathon MVP</Badge>
            </div>
            <div>
              <CardTitle className="text-2xl">{t.welcome}</CardTitle>
              <CardDescription className="mt-2">
                {t.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm">
                {message}
              </div>
            )}

            {/* User type indicator */}
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                {lang === 'en' ? `Signing in as ${userType === "guide" ? "Local Guide" : "Tourist"}` : `تسجيل الدخول كـ ${userType === "guide" ? "مرشد" : "سايح"}`}
              </Badge>
            </div>

            {/* Google Sign In */}
            <Button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base"
              size="lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-5 w-5" />
              )}
              {loading ? t.signingIn : t.googleSignIn}
            </Button>

            {/* Change user type */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t.notA} {userType === 'guide' ? t.guide : t.tourist}?</p>
              <div className="flex gap-2 justify-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin?type=tourist">
                    {t.imATourist}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin?type=guide">
                    {t.imAGuide}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center">
              {t.terms}
            </p>
          </CardContent>
        </Card>

        {/* Demo note */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">{t.demoTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {t.demoInstructions}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}