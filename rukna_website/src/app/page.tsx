import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { MapPin, Users, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-gradient">رُكْنَة</span>
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Hackathon MVP
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <UserNav />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Discover{" "}
              <span className="text-gradient">Authentic Asir</span>
              <br />
              Through Local Eyes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered platform connecting tourists with certified local guides for 
              authentic cultural experiences in the beautiful Asir region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/signin?type=tourist">
                  <Users className="mr-2 h-5 w-5" />
                  I&apos;m a Tourist
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/auth/signin?type=guide">
                  <MapPin className="mr-2 h-5 w-5" />
                  I&apos;m a Local Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
            <p className="text-lg text-muted-foreground mb-8">
              <strong>المشكلة:</strong> السائح يزور عسير… بس ما يعيشها.
            </p>
            <p className="text-lg text-muted-foreground">
              Tourists visit Asir but don&apos;t truly experience it. Most tourism experiences 
              rely only on famous destinations, limiting opportunities to discover authentic 
              culture and unique local experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Rukna Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered matching system connects you with the perfect local guide 
              based on your interests and travel style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <Sparkles className="h-8 w-8 mb-2" />
                <CardTitle>AI-Powered Matching</CardTitle>
                <CardDescription>
                  Smart algorithm analyzes your interests to find the perfect local guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our Google Gemini-powered system creates semantic embeddings of your 
                  preferences to match you with guides who specialize in exactly what you love.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Heart className="h-8 w-8 mb-2" />
                <CardTitle>Authentic Experiences</CardTitle>
                <CardDescription>
                  Discover hidden gems and local traditions off the beaten path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From traditional cooking classes to mountain adventures, experience 
                  Asir through the eyes of passionate locals who know every hidden corner.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <Users className="h-8 w-8 mb-2" />
                <CardTitle>Verified Guides</CardTitle>
                <CardDescription>
                  Certified local experts committed to sharing their culture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All guides go through our verification process to ensure safety, 
                  quality, and authentic cultural knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Expected Impact</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">10M</div>
                <div className="text-muted-foreground">Tourists by 2030</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">94,000</div>
                <div className="text-muted-foreground">New Tourism Jobs</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">#1</div>
                <div className="text-muted-foreground">Fastest Growing Tourism Destination</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4 text-gradient">رُكْنَة</h3>
            <p className="text-muted-foreground mb-4">
              Connecting hearts, cultures, and authentic experiences in Asir.
            </p>
            <Badge variant="outline">Built for Saudi Hackathon 2024</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
