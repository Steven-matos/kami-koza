import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitStats } from '@/lib/rate-limit-secure'

export async function POST(request: NextRequest) {
  try {
    const { prompt, action } = await request.json()
    
    if (action !== 'check' && action !== 'consume') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    const result = await checkRateLimit(request, prompt || '', action)
    
    if (!result.allowed) {
      return NextResponse.json(result, { 
        status: result.reason === 'invalid_prompt' ? 400 : 429 
      })
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Rate limit check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(getRateLimitStats())
} 