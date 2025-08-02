import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

/**
 * Generate embeddings for text using Google Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Store user embeddings in the database
 */
export async function storeUserEmbeddings(
  userId: string,
  contentType: 'interests' | 'specialties' | 'bio' | 'experience',
  contentText: string
): Promise<void> {
  try {
    // Generate embedding
    const embeddingVector = await generateEmbedding(contentText)
    
    // Store in database (upsert to handle updates)
    const { error } = await supabaseAdmin
      .from('ai_embeddings')
      .upsert({
        user_id: userId,
        content_type: contentType,
        content_text: contentText,
        embedding_vector: embeddingVector,
        model_name: 'text-embedding-004'
      })
    
    if (error) {
      console.error('Error storing embedding:', error)
      throw new Error('Failed to store embedding')
    }
    
    console.log(`✅ Stored ${contentType} embedding for user:`, userId)
  } catch (error) {
    console.error('Error in storeUserEmbeddings:', error)
    // Don't throw - embeddings are optional for now
  }
}

/**
 * Find similar users based on embeddings
 */
export async function findSimilarUsers(
  userId: string,
  contentType: 'interests' | 'specialties' = 'interests',
  threshold: number = 0.7,
  limit: number = 10
) {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('find_similar_profiles', {
        target_user_id: userId,
        content_type_filter: contentType,
        similarity_threshold: threshold,
        max_results: limit
      })
    
    if (error) {
      console.error('Error finding similar users:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in findSimilarUsers:', error)
    return []
  }
}

/**
 * Generate match score between tourist interests and guide specialties
 */
export async function calculateMatchScore(
  touristId: string, 
  guideId: string
): Promise<number> {
  try {
    // Get tourist interests embedding
    const { data: touristEmbedding } = await supabaseAdmin
      .from('ai_embeddings')
      .select('embedding_vector')
      .eq('user_id', touristId)
      .eq('content_type', 'interests')
      .single()
    
    // Get guide specialties embedding  
    const { data: guideEmbedding } = await supabaseAdmin
      .from('ai_embeddings')
      .select('embedding_vector')
      .eq('user_id', guideId)
      .eq('content_type', 'specialties')
      .single()
    
    if (!touristEmbedding || !guideEmbedding) {
      return 0.5 // Default score if embeddings don't exist
    }
    
    // Calculate cosine similarity using Supabase vector operations
    const { data } = await supabaseAdmin
      .rpc('vector_cosine_similarity', {
        vector1: touristEmbedding.embedding_vector,
        vector2: guideEmbedding.embedding_vector
      })
    
    return Math.max(0, Math.min(1, data || 0.5)) // Ensure score is between 0-1
  } catch (error) {
    console.error('Error calculating match score:', error)
    return 0.5 // Default fallback score
  }
}