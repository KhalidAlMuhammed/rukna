// Shared types that match the web application

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  user_type: 'tourist' | 'guide';
  created_at: string;
  updated_at: string;
}

export interface TouristProfile {
  id: string;
  profile_id: string;
  interests: string[];
  budget_range: string;
  group_size: number;
  preferred_language: string;
  accessibility_needs?: string;
  travel_style: string;
  created_at: string;
  updated_at: string;
}

export interface GuideProfile {
  id: string;
  profile_id: string;
  bio: string;
  specialties: string[];
  languages: string[];
  experience_years: number;
  hourly_rate: number;
  availability_schedule: Record<string, any>;
  verification_status: 'pending' | 'verified' | 'rejected';
  rating_average?: number;
  total_reviews?: number;
  certification_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  guide_id: string;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  price_per_person: number;
  max_participants: number;
  location: string;
  latitude?: number;
  longitude?: number;
  included_items: string[];
  requirements?: string;
  difficulty_level: 'easy' | 'moderate' | 'challenging';
  age_restriction?: string;
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  tourist_id: string;
  experience_id: string;
  guide_id: string;
  scheduled_date: string;
  participants_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  user_type: 'tourist' | 'guide';
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  OnboardingTourist: undefined;
  OnboardingGuide: undefined;
  ExperienceDetails: { experienceId: string };
  GuideProfile: { guideId: string };
  Booking: { experienceId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Bookings: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}