import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase as supabaseAdmin } from "@/lib/supabase-admin"
import type { Account, User, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        if (account?.provider === "google") {
          console.log('🔐 Google sign-in attempt for:', user.email)
          
          // Check if we have the required environment variables
          if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not configured')
            // Allow sign-in but log the issue - we'll handle profile creation later
            return true
          }

          // Check if user already exists in our profiles table
          const { data: existingProfile, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('email', user.email)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('❌ Error checking existing profile:', error)
            // Allow sign-in even if we can't check the database
            console.log('⚠️ Allowing sign-in despite database error')
            return true
          }

          // If user doesn't exist, create profile
          if (!existingProfile) {
            console.log('👤 Creating new profile for:', user.email)
            
            // Generate a proper UUID for the user
            const { data: newProfile, error: insertError } = await supabaseAdmin
              .from('profiles')
              .insert({
                email: user.email,
                full_name: user.name,
                avatar_url: user.image,
                user_type: 'tourist', // Default to tourist, can be changed later
                location: 'Asir',
                language_preference: 'ar'
              })
              .select('id')
              .single()

            if (insertError) {
              console.error('❌ Error creating profile:', insertError)
              // Allow sign-in even if profile creation fails
              console.log('⚠️ Allowing sign-in despite profile creation error')
              return true
            }

            // Create default tourist profile with the new UUID
            if (newProfile?.id) {
              const { error: touristError } = await supabaseAdmin
                .from('tourist_profiles')
                .insert({
                  id: newProfile.id,
                  interests: [],
                  budget_range: 'moderate',
                  group_size_preference: 2,
                  activity_level: 'medium',
                  duration_preference: [],
                  accessibility_needs: [],
                  travel_style: ''
                })

              if (touristError) {
                console.error('❌ Error creating tourist profile:', touristError)
                // Allow sign-in even if tourist profile creation fails
                console.log('⚠️ Allowing sign-in despite tourist profile creation error')
              } else {
                console.log('✅ Successfully created tourist profile for:', user.email)
              }
            }

            
          } else {
            console.log('✅ Existing profile found for:', user.email)
          }
        }
        return true
      } catch (error) {
        console.error('❌ SignIn callback error:', error)
        // Always allow sign-in, even if there are database issues
        console.log('⚠️ Allowing sign-in despite callback error')
        return true
      }
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      // Persist user id and type in token
      if (user?.email) {
        // Fetch user profile to get user_type and UUID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('user_type, id')
          .eq('email', user.email)
          .single()

        if (profile) {
          token.userId = profile.id
          token.userType = profile.user_type
          token.email = user.email
        }
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      if (token && token.userId) {
        session.user.id = token.userId
        session.user.userType = token.userType
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt" as const,
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }