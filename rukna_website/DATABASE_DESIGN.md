# 🗄️ Rukna Database Design Choices

## Overview
Our database design is optimized for a **hackathon MVP** with focus on **AI-powered matching**, **rapid development**, and **scalable architecture**. Every decision balances functionality with development speed.

## 🏗️ Architecture Decisions

### 1. **Single Database Approach**
**Decision**: Use one Supabase PostgreSQL database for all data
**Rationale**: 
- Simplifies hackathon development (no microservices complexity)
- PostgreSQL handles complex queries needed for AI matching
- Supabase provides instant API, auth, and real-time features
- Easy to scale later with read replicas

### 2. **Profile Split Strategy**
**Decision**: Split user data into `profiles` + type-specific tables (`tourist_profiles`, `guide_profiles`)
**Rationale**:
```sql
profiles (shared data) 
  ↳ tourist_profiles (interests, budget, group_size)
  ↳ guide_profiles (specialties, experience, verification)
```
- **Type Safety**: Prevents mixing tourist/guide specific fields
- **Performance**: Smaller table scans when querying specific user types
- **Extensibility**: Easy to add new user types (e.g., tour operators)
- **Clean Queries**: `JOIN` only when needed, simpler `WHERE` clauses

### 3. **Array Fields for Flexible Matching**
**Decision**: Use PostgreSQL arrays for `interests[]` and `specialties[]`
**Rationale**:
```sql
tourist: interests = ['adventure', 'cultural', 'food']
guide: specialties = ['hiking', 'traditional_crafts', 'cooking']
```
- **AI Matching**: Arrays → embeddings → semantic similarity
- **Flexible Search**: `interests && specialties` overlap queries
- **No Junction Tables**: Simpler for hackathon (no many-to-many complexity)
- **GIN Indexes**: Fast array searches with `@>` and `&&` operators

### 4. **Denormalization for Performance**
**Decision**: Include `guide_id` directly in `bookings` table
**Rationale**:
```sql
bookings {
  tourist_id → tourist_profiles
  experience_id → experiences
  guide_id → guide_profiles  ✅ Denormalized!
}
```
- **Query Speed**: No need to JOIN through experiences to get guide
- **Dashboard Performance**: Guide can query `bookings WHERE guide_id = me`
- **Consistency**: Updated via foreign key constraints
- **Hackathon Priority**: Fast reads > perfect normalization

### 5. **Enum Types for Data Integrity**
**Decision**: Use PostgreSQL ENUMs for fixed value sets
**Rationale**:
```sql
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
```
- **Type Safety**: Database-level validation
- **Performance**: Enums stored as integers internally
- **API Consistency**: Frontend gets exact allowed values
- **Future-Proof**: Easy to add new enum values

### 6. **Row Level Security (RLS) Design**
**Decision**: Implement granular RLS policies for data privacy
**Rationale**:
```sql
-- Users see only their own bookings
CREATE POLICY "Users can see own bookings" ON bookings 
FOR SELECT USING (tourist_id = auth.uid() OR guide_id = auth.uid());
```
- **Security First**: Users cannot access others' private data
- **Supabase Integration**: Works seamlessly with Supabase Auth
- **Hackathon Safe**: No accidental data leaks during demo
- **Scalable**: Policies enforce security at database level

## 🎯 AI Matching Optimization

### 1. **Embedding Strategy**
**Design**: Store embeddings in separate table with caching
```sql
ai_embeddings {
  user_id,
  content_type: 'interests' | 'specialties' | 'experience',
  content_text: 'adventure cultural food',
  embedding_vector: [0.1, 0.2, 0.3, ...]
}
```
**Benefits**:
- **Performance**: Pre-computed embeddings (no real-time API calls)
- **Cost Effective**: Cache Google Gemini results
- **Flexibility**: Different embedding types for different matching scenarios

### 2. **Matching Query Optimization**
**Design**: Optimized queries for finding compatible guides
```sql
-- Find guides with overlapping specialties
SELECT g.*, similarity_score 
FROM guide_profiles g 
WHERE g.specialties && tourist_interests_array
AND g.verification_status = 'approved'
ORDER BY similarity_score DESC;
```
**Benefits**:
- **Fast Execution**: GIN indexes on arrays
- **Semantic + Keyword**: Hybrid matching approach
- **Filtered Results**: Only show approved, active guides

## 📊 Hackathon-Specific Choices

### 1. **Mock Payment System**
**Decision**: Simple payment status tracking without real payments
```sql
bookings {
  payment_status: 'pending' | 'paid' | 'refunded',
  payment_method: 'mock_payment'
}
```
**Rationale**:
- **Demo Focus**: Show booking flow without payment complexity
- **Time Saving**: No Stripe/payment gateway integration needed
- **Easy Testing**: All payments "succeed" for smooth demos

### 2. **Pre-Approved Sample Guides**
**Decision**: Include verified guides in sample data
```sql
verification_status: 'approved'  -- Ready for demo
```
**Rationale**:
- **Instant Demo**: No waiting for verification process
- **Complete Flow**: Tourists can immediately book experiences
- **Professional Look**: Verified badges show platform quality

### 3. **Rich Sample Data**
**Decision**: Include realistic, diverse sample content
```sql
-- 3 Guide archetypes: Adventure, Cultural, Food
-- 3 Tourist profiles: Different interests & budgets
-- 3 Experiences: Showcasing variety
```
**Rationale**:
- **Demo Ready**: Immediate content for presentation
- **AI Testing**: Diverse data tests matching algorithm
- **Stakeholder Appeal**: Realistic content impresses judges

## 🚀 Performance Optimizations

### 1. **Strategic Indexing**
```sql
-- Core performance indexes
CREATE INDEX idx_guide_profiles_active ON guide_profiles(is_active, verification_status);
CREATE INDEX idx_experiences_category ON experiences(category);
CREATE INDEX idx_tourist_interests ON tourist_profiles USING GIN(interests);
```

### 2. **Query Patterns Optimized For**
- **Tourist browsing**: Fast guide discovery by category/interest
- **Guide management**: Quick access to own experiences/bookings
- **AI matching**: Efficient similarity calculations
- **Chat system**: Fast message history retrieval

### 3. **Auto-Updating Timestamps**
```sql
-- Triggers for audit trails
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

## 🔮 Future Scalability Considerations

### What We Can Scale Later:
1. **Read Replicas**: For heavy read workloads
2. **Partitioning**: Split large tables by date/region
3. **Caching Layer**: Redis for frequently accessed data
4. **Search Engine**: Elasticsearch for complex experience search
5. **File Storage**: CDN for photos/videos

### What We Got Right for Scale:
- **UUID Primary Keys**: Distributed-friendly
- **Proper Foreign Keys**: Data integrity maintained
- **Array Fields**: Avoid complex joins
- **RLS Policies**: Security scales with users
- **Audit Trails**: Track all data changes

## 🎨 Alternative Designs Considered

### ❌ **NoSQL Approach**
**Rejected because**:
- Complex queries needed for AI matching
- Relationships important (bookings → experiences → guides)
- PostgreSQL arrays give NoSQL flexibility + SQL power

### ❌ **Microservices Architecture**
**Rejected because**:
- Hackathon timeline too short
- Single database simpler to manage
- Supabase provides all needed backend services

### ❌ **Perfect Normalization**
**Rejected because**:
- Query performance more important for demo
- Denormalization simplifies common queries
- Can normalize later if needed

## 🎯 Design Success Metrics

Our database design succeeds if:
- ✅ **Sub-100ms queries** for core user flows
- ✅ **Zero data leaks** during demo (RLS working)
- ✅ **AI matching works** with sample data
- ✅ **Easy to query** from Next.js frontend
- ✅ **Demo flows smoothly** without database delays

The design prioritizes **developer velocity** and **demo success** while maintaining **production-ready patterns** for future scaling. Perfect for a hackathon that could become a real product! 🚀