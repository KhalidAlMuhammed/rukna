# Rukna User Journey & Database Design

## 🎯 Tourist User Journey

### 1. **Discovery & Registration (2 minutes)**
- Tourist lands on homepage
- Sees problem statement in Arabic and English
- Clicks "I'm a Tourist" button
- **Registers with:**
  - Full name
  - Email address
  - Password
  - Phone number (optional)

### 2. **Profile Setup (3 minutes)**
- **Selects interests from categories:**
  - Adventure (hiking, rock climbing, paragliding)
  - Cultural (traditional crafts, heritage sites, folklore)
  - Food (cooking classes, local cuisine, food tours)
  - Nature (wildlife, botanical tours, photography)
  - Historical (archaeological sites, museums, storytelling)
  - Religious/Spiritual (mosque visits, spiritual retreats)
- **Travel preferences:**
  - Group size (1-10 people)
  - Budget range (Budget/Moderate/Premium/Luxury)
  - Physical activity level (Low/Medium/High)
  - Duration preference (2-4 hours/Half day/Full day/Multi-day)
- **Accessibility needs** (if any)
- **Language preference** (Arabic/English)

### 3. **AI Matching & Discovery (2 minutes)**
- System generates AI embeddings from interests
- **Displays top 5 matched guides with:**
  - Match score percentage
  - Shared interests highlighted
  - Guide photo and basic info
  - Specialties that align with tourist interests
  - Average rating and review count
  - Sample experiences offered

### 4. **Guide Selection & Experience Browsing (5 minutes)**
- Tourist clicks on interesting guide
- **Views guide profile:**
  - Full bio and background
  - Years of experience
  - Spoken languages
  - Verification badges
  - Photo gallery
  - All available experiences
  - Reviews from other tourists
- **Browses experiences offered:**
  - Experience title and description
  - Category and duration
  - Price per person
  - What's included/excluded
  - Meeting point
  - Photos/videos

### 5. **Booking Process (3 minutes)**
- Tourist selects desired experience
- **Booking form:**
  - Preferred date and time
  - Number of participants
  - Special requests/dietary restrictions
  - Contact information confirmation
- **Mock payment process:**
  - Total amount calculation
  - Payment method selection (simulated)
  - Booking confirmation

### 6. **Communication (Ongoing)**
- **Chat with guide:**
  - Pre-experience planning
  - Meeting point confirmation
  - WhatsApp/phone number exchange
  - Experience customization
  - Emergency contact

### 7. **Experience Completion (Future feature)**
- Check-in at meeting point
- Experience delivery
- Real-time location sharing (safety)

### 8. **Post-Experience (Future feature)**
- **Rate and review:**
  - 1-5 star rating
  - Written review
  - Photo uploads
  - Recommendation to others

---

## 🗺️ Guide User Journey

### 1. **Discovery & Registration (2 minutes)**
- Local resident discovers Rukna
- Clicks "I'm a Local Guide"
- **Registers with:**
  - Full name
  - Email address
  - Password
  - Phone number
  - Location in Asir region

### 2. **Profile Setup (10 minutes)**
- **Personal information:**
  - Professional bio (300 words)
  - Years of guiding experience
  - Languages spoken
  - Age and background
  - Profile photo
- **Specialties selection:**
  - Adventure guiding (mountain trails, climbing)
  - Cultural expertise (traditional crafts, folklore)
  - Culinary knowledge (local cuisine, cooking)
  - Historical knowledge (archaeological sites, stories)
  - Nature expertise (wildlife, plants, photography)
  - Spiritual/religious knowledge
- **Service areas:**
  - Specific locations in Asir they cover
  - Transportation availability
  - Group size capacity
- **Certifications & Documents (Future):**
  - Government ID
  - Guiding certifications
  - First aid training
  - Language certificates

### 3. **Experience Creation (15 minutes)**
- **Create experience listings:**
  - Title and catchy description
  - Category selection
  - Duration (2 hours to multi-day)
  - Price per person
  - Maximum participants
  - What's included (transport, food, equipment)
  - What's excluded
  - Meeting point and instructions
  - Difficulty level
  - Age restrictions
  - Photo gallery
  - Cancellation policy

### 4. **AI Matching & Visibility**
- System creates embeddings from guide specialties
- **Gets matched with tourists based on:**
  - Interest alignment
  - Language compatibility
  - Location proximity
  - Availability
  - Experience type requested

### 5. **Booking Management (Ongoing)**
- **Receives booking notifications:**
  - Tourist details and preferences
  - Booking request details
  - Special requirements
- **Manages bookings:**
  - Accept/decline requests
  - Calendar availability
  - Booking modifications
  - Payment tracking

### 6. **Communication (Ongoing)**
- **Chat with tourists:**
  - Experience planning
  - Custom itinerary creation
  - Meeting logistics
  - Pre-experience briefing
  - Cultural sensitivity discussions

### 7. **Experience Delivery (Future)**
- Meet tourists at designated location
- Provide authentic cultural experience
- Ensure safety and enjoyment
- Handle payments and tips

### 8. **Performance Tracking (Future)**
- **View analytics:**
  - Booking conversion rates
  - Average ratings
  - Revenue tracking
  - Most popular experiences
  - Tourist feedback trends

---

## 🗄️ Database Schema Design

### **profiles** (Main user table)
```sql
- id (UUID, primary key, references auth.users)
- email (TEXT, not null)
- full_name (TEXT)
- phone (TEXT)
- avatar_url (TEXT)
- user_type (ENUM: 'tourist', 'guide')
- location (TEXT) -- City/area in Asir
- language_preference (TEXT, default 'ar')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **tourist_profiles** (Tourist-specific data)
```sql
- id (UUID, references profiles.id)
- interests (TEXT[]) -- Array: ['adventure', 'cultural', 'food']
- budget_range (ENUM: 'budget', 'moderate', 'premium', 'luxury')
- group_size_preference (INTEGER, default 2)
- activity_level (ENUM: 'low', 'medium', 'high')
- duration_preference (TEXT[]) -- ['2-4_hours', 'half_day', 'full_day']
- accessibility_needs (TEXT[])
- travel_style (TEXT) -- Free text description
```

### **guide_profiles** (Guide-specific data)
```sql
- id (UUID, references profiles.id)
- bio (TEXT, max 500 chars)
- specialties (TEXT[]) -- Array: ['hiking', 'traditional_crafts', 'cooking']
- languages_spoken (TEXT[]) -- ['Arabic', 'English', 'French']
- years_experience (INTEGER)
- service_areas (TEXT[]) -- Areas in Asir they cover
- max_group_size (INTEGER, default 8)
- has_transportation (BOOLEAN, default false)
- verification_status (ENUM: 'pending', 'approved', 'rejected', default 'pending')
- is_active (BOOLEAN, default true)
- average_rating (DECIMAL(3,2), default 0)
- total_reviews (INTEGER, default 0)
- total_bookings (INTEGER, default 0)
```

### **experiences** (Guide offerings)
```sql
- id (UUID, primary key)
- guide_id (UUID, references guide_profiles.id)
- title (TEXT, not null)
- description (TEXT, not null)
- category (ENUM: 'adventure', 'cultural', 'food', 'nature', 'historical', 'spiritual')
- duration_hours (DECIMAL(4,2)) -- 2.5 for 2.5 hours
- duration_text (TEXT) -- "Half day", "2-3 hours"
- price_per_person (DECIMAL(8,2))
- max_participants (INTEGER)
- min_participants (INTEGER, default 1)
- included_services (TEXT[]) -- ['transport', 'food', 'equipment']
- excluded_services (TEXT[])
- meeting_point (TEXT)
- meeting_instructions (TEXT)
- difficulty_level (ENUM: 'easy', 'moderate', 'challenging')
- age_restrictions (TEXT) -- "8+", "Adults only"
- cancellation_policy (TEXT)
- is_active (BOOLEAN, default true)
- photos (TEXT[]) -- Array of image URLs
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **bookings** (Tourist bookings)
```sql
- id (UUID, primary key)
- tourist_id (UUID, references tourist_profiles.id)
- experience_id (UUID, references experiences.id)
- guide_id (UUID, references guide_profiles.id) -- Denormalized for easier queries
- booking_date (DATE) -- When the experience will happen
- booking_time (TIME) -- Start time
- participants (INTEGER)
- total_amount (DECIMAL(8,2))
- commission_amount (DECIMAL(8,2)) -- Platform commission
- status (ENUM: 'pending', 'confirmed', 'completed', 'cancelled', 'refunded')
- special_requests (TEXT)
- contact_phone (TEXT) -- Tourist's contact for this booking
- payment_status (ENUM: 'pending', 'paid', 'refunded', default 'pending')
- payment_method (TEXT) -- 'mock_payment' for demo
- cancellation_reason (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **messages** (Chat system)
```sql
- id (UUID, primary key)
- booking_id (UUID, references bookings.id) -- Optional, can be general chat
- from_user_id (UUID, references profiles.id)
- to_user_id (UUID, references profiles.id)
- content (TEXT, not null)
- message_type (ENUM: 'text', 'image', 'location', 'system')
- is_read (BOOLEAN, default false)
- created_at (TIMESTAMP)
```

### **reviews** (Future feature)
```sql
- id (UUID, primary key)
- booking_id (UUID, references bookings.id)
- reviewer_id (UUID, references profiles.id)
- reviewee_id (UUID, references profiles.id)
- rating (INTEGER, check 1-5)
- comment (TEXT)
- photos (TEXT[])
- is_public (BOOLEAN, default true)
- created_at (TIMESTAMP)
```

### **ai_embeddings** (AI matching cache)
```sql
- id (UUID, primary key)
- user_id (UUID, references profiles.id)
- content_type (ENUM: 'interests', 'specialties', 'experience')
- content_text (TEXT) -- Original text that was embedded
- embedding_vector (VECTOR) -- Supabase vector extension
- created_at (TIMESTAMP)
```

---

## 🔧 Calculated Fields & Indexes

### **Virtual/Computed Fields:**
- Guide match score (calculated at query time)
- Experience popularity (booking count)
- Guide response rate
- Average experience rating
- Distance from tourist location

### **Database Indexes:**
```sql
-- Performance indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_guide_profiles_active ON guide_profiles(is_active, verification_status);
CREATE INDEX idx_experiences_active ON experiences(is_active, guide_id);
CREATE INDEX idx_bookings_status ON bookings(status, booking_date);
CREATE INDEX idx_messages_conversation ON messages(from_user_id, to_user_id, created_at);

-- Search indexes
CREATE INDEX idx_tourist_interests ON tourist_profiles USING GIN(interests);
CREATE INDEX idx_guide_specialties ON guide_profiles USING GIN(specialties);
CREATE INDEX idx_experience_category ON experiences(category);
```

---

## 📊 Sample Data Requirements

### **For Demo (Minimum):**
- 5-8 Tourist profiles with varied interests
- 10-12 Guide profiles with different specialties
- 20-25 Experience listings across categories
- 5-10 Sample bookings in different states
- 15-20 Sample messages/conversations

### **Interest Categories:**
- **Adventure:** hiking, rock_climbing, paragliding, camping, off_road
- **Cultural:** traditional_crafts, folklore, heritage_sites, storytelling, music
- **Food:** cooking_classes, food_tours, local_cuisine, traditional_recipes
- **Nature:** wildlife_watching, botanical_tours, photography, bird_watching
- **Historical:** archaeological_sites, museums, ancient_stories, architecture
- **Spiritual:** mosque_visits, spiritual_retreats, meditation, religious_history

This comprehensive user journey will guide our hackathon development and ensure we build exactly what users need for authentic Asir experiences! 🎯