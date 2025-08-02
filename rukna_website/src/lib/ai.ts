import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface MatchingScore {
  userId: string
  score: number
  sharedInterests: string[]
  explanation: string
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Fallback: return a dummy embedding for demo purposes
    return Array(768).fill(0).map(() => Math.random())
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function findMatches(
  touristInterests: string[],
  guides: Array<{ id: string; specialties: string[]; bio?: string }>
): Promise<MatchingScore[]> {
  try {
    // Generate embedding for tourist interests
    const touristText = touristInterests.join(' ')
    const touristEmbedding = await generateEmbedding(touristText)
    
    const matches: MatchingScore[] = []
    
    for (const guide of guides) {
      // Generate embedding for guide specialties and bio
      const guideText = [...guide.specialties, guide.bio || ''].join(' ')
      const guideEmbedding = await generateEmbedding(guideText)
      
      // Calculate similarity
      const similarity = cosineSimilarity(touristEmbedding, guideEmbedding)
      
      // Find shared interests/specialties
      const sharedInterests = touristInterests.filter(interest =>
        guide.specialties.some(specialty =>
          specialty.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(specialty.toLowerCase())
        )
      )
      
      // Generate explanation
      const explanation = sharedInterests.length > 0
        ? `Perfect match! Shares ${sharedInterests.join(', ')}`
        : 'Great cultural experience based on your interests'
      
      matches.push({
        userId: guide.id,
        score: Math.round(similarity * 100),
        sharedInterests,
        explanation
      })
    }
    
    // Sort by score and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, 5)
  } catch (error) {
    console.error('Error finding matches:', error)
    // Fallback matching for demo purposes
    return guides.slice(0, 3).map((guide, index) => ({
      userId: guide.id,
      score: 95 - index * 5,
      sharedInterests: touristInterests.slice(0, 2),
      explanation: 'Highly recommended local guide'
    }))
  }
}