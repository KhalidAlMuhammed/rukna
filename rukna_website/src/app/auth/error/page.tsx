"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Configuration Error",
          description: "There's an issue with the authentication setup. Please contact support.",
          suggestion: "This might be a temporary issue. Try again in a few minutes."
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You don't have permission to sign in with this account.",
          suggestion: "Make sure you're using the correct Google account."
        }
      case "Verification":
        return {
          title: "Verification Error",
          description: "The verification token is invalid or has expired.",
          suggestion: "Please try signing in again."
        }
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        return {
          title: "Authentication Error",
          description: "There was an error during the authentication process.",
          suggestion: "Please try signing in again. If the problem persists, contact support."
        }
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          description: "This account is already associated with a different authentication method.",
          suggestion: "Try signing in with the method you used previously."
        }
      case "EmailSignin":
        return {
          title: "Email Sign-in Error",
          description: "Unable to send sign-in email.",
          suggestion: "Check your email address and try again."
        }
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          description: "The provided credentials are incorrect.",
          suggestion: "Please check your email and password and try again."
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "You need to be signed in to access this page.",
          suggestion: "Please sign in and try again."
        }
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication.",
          suggestion: "Please try again. If the problem persists, contact support."
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Error card */}
        <Card className="w-full border-destructive/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-gradient">رُكْنَة</h1>
              <Badge variant="secondary">Hackathon MVP</Badge>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-xl text-destructive">
                  {errorInfo.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {errorInfo.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error details */}
            {error && (
              <div className="p-3 rounded-md bg-muted border text-sm">
                <p className="font-medium mb-1">Error Code:</p>
                <p className="text-muted-foreground font-mono">{error}</p>
              </div>
            )}

            {/* Suggestion */}
            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Suggestion:</strong> {errorInfo.suggestion}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>

            {/* Support info */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Need help? This is a hackathon demo. 
                Check the console for technical details.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Debug Info (Dev Only)</h3>
                <div className="text-xs font-mono text-muted-foreground space-y-1">
                  <div>Error: {error || 'Unknown'}</div>
                  <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                  <div>Time: {new Date().toISOString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}