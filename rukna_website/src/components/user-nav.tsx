"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signIn, signOut } from "next-auth/react"
import { User, LogOut, Settings, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => signIn()}>
          Sign In
        </Button>
        <Button asChild>
          <Link href="/auth/signin">Get Started</Link>
        </Button>
      </div>
    )
  }

  const userType = session.user?.userType || 'tourist'
  const initials = session.user?.name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="flex items-center space-x-3">
      {/* User type badge */}
      <Badge variant={userType === 'guide' ? 'default' : 'secondary'} className="hidden sm:inline-flex">
        {userType === 'guide' ? (
          <>
            <MapPin className="w-3 h-3 mr-1" />
            Guide
          </>
        ) : (
          <>
            <Users className="w-3 h-3 mr-1" />
            Tourist
          </>
        )}
      </Badge>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Navigation items based on user type */}
          {userType === 'guide' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/guide/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Guide Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/guide/experiences" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>My Experiences</span>
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/tourist/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/discover" className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Discover Guides</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 dark:text-red-400"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}