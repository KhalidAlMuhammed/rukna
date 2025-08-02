// App configuration constants

export const CONFIG = {
  APP_NAME: 'Rukna',
  APP_VERSION: '1.0.0',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
};

export const SIZES = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  iconSize: 24,
  headerHeight: 60,
  tabHeight: 80,
};

export const INTERESTS = [
  'adventure',
  'cultural',
  'food',
  'nature',
  'history',
  'art',
  'music',
  'photography',
  'hiking',
  'traditional_crafts',
  'cooking',
  'storytelling',
];

export const LANGUAGES = [
  'Arabic',
  'English',
  'French',
  'German',
  'Spanish',
  'Italian',
  'Chinese',
  'Japanese',
];

export const BUDGET_RANGES = [
  'budget',
  'mid-range',
  'luxury',
];

export const TRAVEL_STYLES = [
  'solo',
  'couple',
  'family',
  'group',
  'business',
];

export const DIFFICULTY_LEVELS = [
  'easy',
  'moderate',
  'challenging',
];