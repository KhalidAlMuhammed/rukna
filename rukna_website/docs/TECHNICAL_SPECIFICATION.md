# Rukna - Hackathon MVP Technical Specification

## 🚀 24-48 Hour Development Plan

### Hour 0-8: Project Foundation & Setup

#### MVP Project Setup
**Objective**: Get a working foundation as quickly as possible

**Essential Tasks (2 hours)**:
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Tailwind CSS for rapid styling
- [ ] Configure Supabase client
- [ ] Set up basic environment variables
- [ ] Deploy to Vercel for instant hosting

**Simplified Folder Structure**:
```
rukna/
├── src/
│   ├── app/                  # Next.js 14 app directory
│   │   ├── api/             # API routes
│   │   ├── auth/            # Auth pages
│   │   ├── dashboard/       # User dashboards
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   │   ├── supabase.ts      # Supabase client
│   │   └── ai.ts            # AI matching logic
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

**Technical Requirements**:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase for backend services
- ESLint + Prettier for code quality

#### Supabase Quick Setup
**Objective**: Get database and auth working quickly

**Essential Tasks (2 hours)**:
- [ ] Create Supabase project
- [ ] Set up email authentication
- [ ] Create minimal database schema
- [ ] Add sample data for demo
- [ ] Test authentication flow

**Minimal Database Schema** (MVP):

```sql
-- Basic user profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('tourist', 'guide')) NOT NULL,
  interests TEXT[], -- For tourists: adventure, cultural, food, etc.
  specialties TEXT[], -- For guides: hiking, history, cooking, etc.
  bio TEXT,
  location TEXT DEFAULT 'Asir',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple experiences
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- cultural, adventure, food, nature
  price DECIMAL(8,2) NOT NULL,
  duration TEXT NOT NULL, -- "2 hours", "Half day", etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID REFERENCES profiles(id) NOT NULL,
  experience_id UUID REFERENCES experiences(id) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID REFERENCES profiles(id) NOT NULL,
  to_user UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Hour 8-16: Core Features Implementation

#### Authentication & Profiles
**Objective**: Get users signed up and profiled quickly

**Tasks (3 hours)**:
- [ ] Implement Supabase auth with email/password
- [ ] Create simple registration form
- [ ] Build basic profile setup (tourist vs guide)
- [ ] Add interest/specialty selection
- [ ] Create protected routes

#### AI-Powered Matching
**Objective**: Implement the core value proposition

**Tasks (3 hours)**:
- [ ] Set up Google Gemini API
- [ ] Create profile embedding function
- [ ] Build matching algorithm
- [ ] Display matched guides to tourists
- [ ] Add basic explanation of matches

#### Experience Listings & Booking
**Objective**: Allow guides to list experiences and tourists to book

**Tasks (2 hours)**:
- [ ] Create experience creation form for guides
- [ ] Build experience listing page
- [ ] Implement basic booking flow (mock payment)
- [ ] Create booking confirmation

### Hour 16-24: Polish & Demo Preparation

#### UI/UX Polish
**Objective**: Make it look professional and demo-ready

**Tasks (4 hours)**:
- [ ] Improve styling with Tailwind CSS
- [ ] Add responsive design
- [ ] Create loading states and error handling
- [ ] Add demo data and sample content
- [ ] Test all user flows

#### Demo Preparation
**Objective**: Prepare for presentation

**Tasks (4 hours)**:
- [ ] Deploy to production (Vercel)
- [ ] Create demo script and user stories
- [ ] Test all features thoroughly
- [ ] Prepare presentation materials
- [ ] Practice demo flow

## 🤖 Simplified AI Matching Algorithm

```typescript
// Simplified matching for hackathon
interface UserProfile {
  interests: string[]; // ["adventure", "cultural", "food"]
  location: string;
  userType: "tourist" | "guide";
}

interface MatchingScore {
  userId: string;
  score: number; // 0-100
  sharedInterests: string[];
}

// Use Google Gemini for semantic similarity
async function findMatches(tourist: UserProfile): Promise<MatchingScore[]> {
  // Generate embeddings for tourist interests
  const touristEmbedding = await generateEmbedding(tourist.interests.join(" "));
  
  // Compare with all guides
  const guides = await getGuides();
  const matches = [];
  
  for (const guide of guides) {
    const guideEmbedding = await generateEmbedding(guide.specialties.join(" "));
    const similarity = cosineSimilarity(touristEmbedding, guideEmbedding);
    matches.push({ userId: guide.id, score: similarity * 100 });
  }
  
  return matches.sort((a, b) => b.score - a.score).slice(0, 5);
}
```

## 📱 Tech Stack Decisions

### Frontend
- **Next.js 14**: Server-side rendering and API routes
- **Tailwind CSS**: Rapid styling
- **TypeScript**: Type safety
- **React Hook Form**: Form handling

### Backend
- **Supabase**: Database, Auth, Real-time
- **Google Gemini API**: AI embeddings
- **Vercel**: Hosting and deployment

### Key Features to Build
1. **User Registration**: Simple email signup
2. **Profile Creation**: Interests for tourists, specialties for guides
3. **AI Matching**: Semantic similarity using embeddings
4. **Experience Listing**: Guides create simple offerings
5. **Booking Flow**: Basic booking without real payments
6. **Messaging**: Simple chat between matched users

## 🎯 Success Metrics for Demo

### Technical Demo
- [ ] User can register as tourist or guide
- [ ] AI matching works and shows similarity scores
- [ ] Experience booking flow completes
- [ ] Real-time messaging between users
- [ ] Responsive design works on mobile

### Business Story
- [ ] Clear problem statement (tourists miss authentic experiences)
- [ ] Solution demonstration (AI connects with right local guides)
- [ ] Market opportunity (Asir tourism growth)
- [ ] Technology advantage (semantic matching vs basic filters)
- [ ] Scalability potential (expand to other regions)

## 🛠️ Hackathon Implementation Tips

### Quick Wins
- Use Supabase auth scaffolding
- Leverage Tailwind component libraries
- Mock complex features (payments, notifications)
- Focus on visual demo over perfect code
- Use placeholder images and sample data

### Demo Script
1. **Problem**: Show how tourists currently find guides (generic listings)
2. **Solution**: Tourist signs up, sets interests
3. **Magic**: AI finds perfectly matched local guide
4. **Experience**: Book a cultural experience seamlessly
5. **Communication**: Chat with guide about details
6. **Future**: Explain how this scales to help Asir tourism

---

**Hackathon Success Formula**: Focus on the AI matching demo + simple booking flow. Everything else is nice-to-have. The goal is to prove the concept works and show the potential for transforming tourism in Asir.