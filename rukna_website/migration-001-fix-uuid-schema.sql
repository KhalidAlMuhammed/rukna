-- Migration Script: Fix UUID Schema for NextAuth
-- Run this in your Supabase SQL Editor to fix the UUID issues

-- ============================================================================
-- STEP 1: DROP EXISTING TABLES IN CORRECT ORDER (foreign keys first)
-- ============================================================================

-- Drop dependent tables first
DROP TABLE IF EXISTS ai_embeddings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS guide_profiles CASCADE;
DROP TABLE IF EXISTS tourist_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_type_enum CASCADE;
DROP TYPE IF EXISTS budget_range_enum CASCADE;
DROP TYPE IF EXISTS activity_level_enum CASCADE;
DROP TYPE IF EXISTS verification_status_enum CASCADE;
DROP TYPE IF EXISTS experience_category_enum CASCADE;
DROP TYPE IF EXISTS difficulty_level_enum CASCADE;
DROP TYPE IF EXISTS booking_status_enum CASCADE;
DROP TYPE IF EXISTS payment_status_enum CASCADE;
DROP TYPE IF EXISTS message_type_enum CASCADE;

-- ============================================================================
-- STEP 2: ENABLE EXTENSIONS AND CREATE FRESH SCHEMA WITH PROPER UUIDS
-- ============================================================================

-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create custom types/enums
CREATE TYPE user_type_enum AS ENUM ('tourist', 'guide');
CREATE TYPE budget_range_enum AS ENUM ('budget', 'moderate', 'premium', 'luxury');
CREATE TYPE activity_level_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE experience_category_enum AS ENUM ('adventure', 'cultural', 'food', 'nature', 'historical', 'spiritual');
CREATE TYPE difficulty_level_enum AS ENUM ('easy', 'moderate', 'challenging');
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'location', 'system');

-- Main profiles table (for NextAuth users)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  user_type user_type_enum NOT NULL,
  location TEXT DEFAULT 'Asir',
  language_preference TEXT DEFAULT 'ar',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tourist-specific profiles
CREATE TABLE tourist_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  interests TEXT[] DEFAULT '{}',
  budget_range budget_range_enum DEFAULT 'moderate',
  group_size_preference INTEGER DEFAULT 2,
  activity_level activity_level_enum DEFAULT 'medium',
  duration_preference TEXT[] DEFAULT '{}',
  accessibility_needs TEXT[] DEFAULT '{}',
  travel_style TEXT
);

-- Guide-specific profiles  
CREATE TABLE guide_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  languages_spoken TEXT[] DEFAULT '{"Arabic"}',
  years_experience INTEGER DEFAULT 0,
  service_areas TEXT[] DEFAULT '{}',
  max_group_size INTEGER DEFAULT 8,
  has_transportation BOOLEAN DEFAULT false,
  verification_status verification_status_enum DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0
);

-- Experience listings
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES guide_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category experience_category_enum NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  duration_text TEXT,
  price_per_person DECIMAL(8,2) NOT NULL,
  max_participants INTEGER NOT NULL,
  min_participants INTEGER DEFAULT 1,
  included_services TEXT[] DEFAULT '{}',
  excluded_services TEXT[] DEFAULT '{}',
  meeting_point TEXT,
  meeting_instructions TEXT,
  difficulty_level difficulty_level_enum DEFAULT 'easy',
  age_restrictions TEXT,
  cancellation_policy TEXT,
  is_active BOOLEAN DEFAULT true,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE NOT NULL,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  guide_id UUID REFERENCES guide_profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  participants INTEGER NOT NULL,
  total_amount DECIMAL(8,2) NOT NULL,
  commission_amount DECIMAL(8,2) NOT NULL,
  status booking_status_enum DEFAULT 'pending',
  special_requests TEXT,
  contact_phone TEXT,
  payment_status payment_status_enum DEFAULT 'pending',
  payment_method TEXT DEFAULT 'mock_payment',
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages/Chat
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews (for future)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI embeddings table (for AI matching)
CREATE TABLE ai_embeddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- 'interests', 'specialties', 'experience', 'bio'
  content_text TEXT NOT NULL, -- Original text that was embedded
  embedding_vector vector(768), -- Google Gemini embedding dimension (use smaller dims for testing)
  model_name TEXT DEFAULT 'text-embedding-004', -- Track which model generated this
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Performance indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_guide_profiles_active ON guide_profiles(is_active, verification_status);
CREATE INDEX idx_guide_profiles_location ON profiles(location) WHERE user_type = 'guide';
CREATE INDEX idx_experiences_active ON experiences(is_active, guide_id);
CREATE INDEX idx_experiences_category ON experiences(category);
CREATE INDEX idx_bookings_status ON bookings(status, booking_date);
CREATE INDEX idx_bookings_dates ON bookings(booking_date, booking_time);
CREATE INDEX idx_messages_conversation ON messages(from_user_id, to_user_id, created_at);

-- GIN indexes for array fields (better search performance)
CREATE INDEX idx_tourist_interests ON tourist_profiles USING GIN(interests);
CREATE INDEX idx_guide_specialties ON guide_profiles USING GIN(specialties);
CREATE INDEX idx_guide_languages ON guide_profiles USING GIN(languages_spoken);
CREATE INDEX idx_experience_included ON experiences USING GIN(included_services);

-- Vector indexes for AI similarity search (HNSW for fast approximate nearest neighbor)
CREATE INDEX idx_embeddings_vector ON ai_embeddings USING hnsw (embedding_vector vector_cosine_ops);
CREATE INDEX idx_embeddings_user_content ON ai_embeddings(user_id, content_type);

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================================================

-- Profiles: Everyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true); -- Relaxed for NextAuth
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (true); -- Relaxed for NextAuth

-- Tourist profiles: Relaxed policies for demo
CREATE POLICY "Tourist profiles accessible" ON tourist_profiles FOR ALL USING (true);

-- Guide profiles: Everyone can read approved guides
CREATE POLICY "Guide profiles accessible" ON guide_profiles FOR ALL USING (true);

-- Experiences: Everyone can read active experiences
CREATE POLICY "Experiences accessible" ON experiences FOR ALL USING (true);

-- Bookings: Everyone can access for demo
CREATE POLICY "Bookings accessible" ON bookings FOR ALL USING (true);

-- Messages: Everyone can access for demo  
CREATE POLICY "Messages accessible" ON messages FOR ALL USING (true);

-- Reviews: Everyone can read public reviews
CREATE POLICY "Reviews accessible" ON reviews FOR ALL USING (true);

-- AI Embeddings: Everyone can read for matching, but only system can write
CREATE POLICY "AI embeddings readable" ON ai_embeddings FOR SELECT USING (true);
CREATE POLICY "AI embeddings system writable" ON ai_embeddings FOR INSERT WITH CHECK (true);
CREATE POLICY "AI embeddings system updatable" ON ai_embeddings FOR UPDATE USING (true);

-- ============================================================================
-- STEP 6: CREATE AI HELPER FUNCTIONS
-- ============================================================================

-- Function to find similar users based on embeddings
CREATE OR REPLACE FUNCTION find_similar_profiles(
  target_user_id UUID,
  content_type_filter TEXT DEFAULT 'interests',
  similarity_threshold FLOAT DEFAULT 0.7,
  max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  similarity_score FLOAT,
  content_text TEXT,
  user_type user_type_enum,
  full_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    1 - (target_embedding.embedding_vector <=> ae.embedding_vector) as similarity_score,
    ae.content_text,
    p.user_type,
    p.full_name
  FROM ai_embeddings ae
  JOIN profiles p ON ae.user_id = p.id
  CROSS JOIN (
    SELECT embedding_vector 
    FROM ai_embeddings 
    WHERE user_id = target_user_id 
    AND content_type = content_type_filter
    LIMIT 1
  ) target_embedding
  WHERE ae.user_id != target_user_id
  AND ae.content_type = content_type_filter
  AND 1 - (target_embedding.embedding_vector <=> ae.embedding_vector) >= similarity_threshold
  ORDER BY target_embedding.embedding_vector <=> ae.embedding_vector
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate cosine similarity between two vectors
CREATE OR REPLACE FUNCTION vector_cosine_similarity(
  vector1 vector,
  vector2 vector
)
RETURNS FLOAT AS $$
BEGIN
  RETURN 1 - (vector1 <=> vector2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 7: CREATE TRIGGER FUNCTIONS
-- ============================================================================

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_embeddings_updated_at BEFORE UPDATE ON ai_embeddings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- STEP 8: INSERT SAMPLE DATA FOR DEMO
-- ============================================================================

-- -- Sample tourist profiles
-- INSERT INTO profiles (id, email, full_name, user_type, location) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', 'sarah.tourist@example.com', 'Sarah Abdullah', 'tourist', 'Riyadh'),
-- ('550e8400-e29b-41d4-a716-446655440002', 'mike.explorer@example.com', 'Mike Johnson', 'tourist', 'International'),
-- ('550e8400-e29b-41d4-a716-446655440003', 'fatima.travel@example.com', 'Fatima Al-Zahra', 'tourist', 'Jeddah');

-- INSERT INTO tourist_profiles (id, interests, budget_range, group_size_preference, activity_level, travel_style) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', '{"adventure", "cultural", "nature"}', 'moderate', 2, 'high', 'Love authentic experiences and local culture'),
-- ('550e8400-e29b-41d4-a716-446655440002', '{"historical", "cultural", "food"}', 'premium', 4, 'medium', 'Photography enthusiast interested in heritage'),
-- ('550e8400-e29b-41d4-a716-446655440003', '{"food", "cultural", "spiritual"}', 'budget', 1, 'low', 'Solo traveler seeking peaceful experiences');

-- -- Sample guide profiles
-- INSERT INTO profiles (id, email, full_name, user_type, location) VALUES
-- ('550e8400-e29b-41d4-a716-446655440010', 'ahmed.guide@example.com', 'Ahmed Al-Ghamdi', 'guide', 'Abha'),
-- ('550e8400-e29b-41d4-a716-446655440011', 'nora.mountain@example.com', 'Nora Al-Shahrani', 'guide', 'Khamis Mushait'),
-- ('550e8400-e29b-41d4-a716-446655440012', 'omar.heritage@example.com', 'Omar Al-Asiri', 'guide', 'Rijal Almaa');

-- INSERT INTO guide_profiles (id, bio, specialties, languages_spoken, years_experience, verification_status, is_active, service_areas, max_group_size, has_transportation) VALUES
-- ('550e8400-e29b-41d4-a716-446655440010', 'Passionate mountain guide with 8 years of experience leading hiking expeditions in the Asir mountains. Specialized in adventure tourism and wildlife photography.', '{"adventure", "hiking", "photography", "nature"}', '{"Arabic", "English"}', 8, 'approved', true, '{"Abha", "Al Namas", "Tanoumah"}', 6, true),
-- ('550e8400-e29b-41d4-a716-446655440011', 'Local cultural expert and traditional crafts teacher. Born and raised in Asir, I love sharing our rich heritage with visitors through hands-on experiences.', '{"cultural", "traditional_crafts", "heritage", "storytelling"}', '{"Arabic", "English", "French"}', 5, 'approved', true, '{"Khamis Mushait", "Abha"}', 8, false),
-- ('550e8400-e29b-41d4-a716-446655440012', 'Food enthusiast and cooking instructor specializing in traditional Asiri cuisine. Join me for authentic cooking classes and food tours.', '{"food", "cooking", "cultural", "local_cuisine"}', '{"Arabic", "English"}', 6, 'approved', true, '{"Rijal Almaa", "Abha"}', 4, true);

-- -- Sample experiences
-- INSERT INTO experiences (guide_id, title, description, category, duration_hours, duration_text, price_per_person, max_participants, included_services, meeting_point, difficulty_level, photos) VALUES
-- ('550e8400-e29b-41d4-a716-446655440010', 'Asir Mountain Hiking Adventure', 'Explore the breathtaking trails of Asir mountains with stunning valley views, diverse wildlife, and traditional villages. Perfect for nature lovers and photography enthusiasts.', 'adventure', 6, 'Full day', 350.00, 6, '{"guide", "transportation", "lunch", "equipment"}', 'Abha Cable Car Station', 'moderate', '{"https://images.unsplash.com/photo-1506905925346-21bda4d32df4"}'),
-- ('550e8400-e29b-41d4-a716-446655440011', 'Traditional Asiri Crafts Workshop', 'Learn the ancient art of Asiri traditional crafts including basket weaving, pottery, and textile work. Take home your handmade souvenirs.', 'cultural', 4, 'Half day', 200.00, 8, '{"materials", "refreshments", "certificate"}', 'Khamis Mushait Heritage Center', 'easy', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96"}'),
-- ('550e8400-e29b-41d4-a716-446655440012', 'Authentic Asiri Cooking Experience', 'Discover the secrets of traditional Asiri cuisine. Cook and enjoy a full meal including Asiri bread, honey, and local specialties in a traditional setting.', 'food', 3, '3 hours', 180.00, 4, '{"ingredients", "recipes", "meal", "beverages"}', 'Rijal Almaa Traditional House', 'easy', '{"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"}');

-- Sample bookings
-- INSERT INTO bookings (tourist_id, experience_id, guide_id, booking_date, booking_time, participants, total_amount, commission_amount, status, contact_phone) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM experiences WHERE title = 'Asir Mountain Hiking Adventure'), '550e8400-e29b-41d4-a716-446655440010', '2024-12-25', '08:00', 2, 700.00, 105.00, 'confirmed', '+966501234567'),
-- ('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM experiences WHERE title = 'Traditional Asiri Crafts Workshop'), '550e8400-e29b-41d4-a716-446655440011', '2024-12-20', '14:00', 3, 600.00, 90.00, 'pending', '+966507654321');

-- -- Sample messages
-- INSERT INTO messages (from_user_id, to_user_id, content, booking_id) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'Hi Ahmed! I''m excited about the hiking trip. Should I bring any special equipment?', (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440001')),
-- ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Hello Sarah! Great to hear from you. I''ll provide all hiking equipment, but please bring comfortable hiking shoes and a water bottle. The weather should be perfect!', (SELECT id FROM bookings WHERE tourist_id = '550e8400-e29b-41d4-a716-446655440001'));

-- Sample AI embeddings will be generated by the application using Google Gemini
-- The ai_embeddings table is ready for 768-dimensional vectors
-- Uncomment below to add sample vectors for testing:

/*
-- Sample embeddings (would need full 768-dimensional vectors)
INSERT INTO ai_embeddings (user_id, content_type, content_text, model_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'interests', 'adventure cultural nature mountain hiking photography', 'text-embedding-004'),
('550e8400-e29b-41d4-a716-446655440010', 'specialties', 'adventure hiking photography nature mountain guiding wildlife', 'text-embedding-004');
-- Note: embedding_vector will be populated by the application
*/

-- ============================================================================
-- MIGRATION COMPLETE! 
-- ============================================================================

SELECT 'Migration completed successfully! ✅' as status;
SELECT 'Tables created: ' || count(*) || ' tables' as result 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'tourist_profiles', 'guide_profiles', 'experiences', 'bookings', 'messages', 'reviews', 'ai_embeddings');

-- Test the AI similarity function
SELECT 'AI similarity function ready! Test with: SELECT * FROM find_similar_profiles(''550e8400-e29b-41d4-a716-446655440001''::UUID);' as ai_test;