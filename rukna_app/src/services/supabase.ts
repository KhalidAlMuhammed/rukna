import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { CONFIG } from '../constants';

// Create Supabase client
export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Helper functions for authentication
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

// Database service functions
export const dbService = {
  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  },

  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  // Tourist profile operations
  async getTouristProfile(profileId: string) {
    const { data, error } = await supabase
      .from('tourist_profiles')
      .select('*')
      .eq('profile_id', profileId)
      .single();
    return { data, error };
  },

  async updateTouristProfile(profileId: string, updates: any) {
    const { data, error } = await supabase
      .from('tourist_profiles')
      .update(updates)
      .eq('profile_id', profileId)
      .select()
      .single();
    return { data, error };
  },

  async createTouristProfile(profile: any) {
    const { data, error } = await supabase
      .from('tourist_profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  // Guide profile operations
  async getGuideProfile(profileId: string) {
    const { data, error } = await supabase
      .from('guide_profiles')
      .select('*')
      .eq('profile_id', profileId)
      .single();
    return { data, error };
  },

  async updateGuideProfile(profileId: string, updates: any) {
    const { data, error } = await supabase
      .from('guide_profiles')
      .update(updates)
      .eq('profile_id', profileId)
      .select()
      .single();
    return { data, error };
  },

  async createGuideProfile(profile: any) {
    const { data, error } = await supabase
      .from('guide_profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },

  // Experience operations
  async getExperiences() {
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        guide_profiles!inner(
          *,
          profiles!inner(*)
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getExperience(id: string) {
    const { data, error } = await supabase
      .from('experiences')
      .select(`
        *,
        guide_profiles!inner(
          *,
          profiles!inner(*)
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getExperiencesByGuide(guideId: string) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('guide_id', guideId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Booking operations
  async createBooking(booking: any) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    return { data, error };
  },

  async getBookings(userId: string, userType: 'tourist' | 'guide') {
    const column = userType === 'tourist' ? 'tourist_id' : 'guide_id';
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        experiences(*),
        tourist_profiles!inner(profiles!inner(*)),
        guide_profiles!inner(profiles!inner(*))
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateBooking(id: string, updates: any) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
};