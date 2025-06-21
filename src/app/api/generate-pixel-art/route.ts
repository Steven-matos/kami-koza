import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit-secure'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Check rate limiting before processing
    const rateLimitResult = await checkRateLimit(request, prompt.trim(), 'consume')

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: rateLimitResult.message,
          reason: rateLimitResult.reason,
          generationsLeft: rateLimitResult.generationsLeft,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
    }

    const apiKey = process.env.GETIMG_API_KEY
    if (!apiKey) {
      console.error('GETIMG_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'GetImg.ai API key is not configured. Please set GETIMG_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Generate pixel art using GetImg.ai API
    const getimgResponse = await generatePixelArtWithGetImg(prompt, apiKey)
    
    if (!getimgResponse.success) {
      return NextResponse.json(
        { error: getimgResponse.error || 'Failed to generate image from GetImg.ai' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      imageUrl: getimgResponse.imageUrl,
      prompt: prompt.trim()
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate pixel art using GetImg.ai API
async function generatePixelArtWithGetImg(prompt: string, apiKey: string) {
  try {
    // Try FLUX.1 first (recommended for pixel art by GetImg.ai)
    let result = await tryFluxPixelArt(prompt, apiKey)
    
    // If FLUX fails, fallback to Stable Diffusion XL
    if (!result.success) {
      console.log('FLUX failed, trying SDXL fallback:', result.error)
      result = await trySDXLPixelArt(prompt, apiKey)
    }
    
    return result

  } catch (error) {
    console.error('Error in generatePixelArtWithGetImg:', error)
    return {
      success: false,
      error: 'Failed to generate pixel art'
    }
  }
}

// Try FLUX.1 Schnell for pixel art generation
async function tryFluxPixelArt(prompt: string, apiKey: string) {
  try {
    // Enhanced pixel art prompt optimized for FLUX
    const pixelArtPrompt = `pixel art of ${prompt}, 8-bit style, 16-bit graphics, retro game art, pixelated, low resolution, sprite art, video game style, pixel perfect, retro gaming aesthetic, synthwave colors, neon pixel art, detailed pixel work, game asset style`
    
    const response = await fetch('https://api.getimg.ai/v1/flux-schnell/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: pixelArtPrompt,
        width: 512,
        height: 512,
        steps: 4,
        guidance: 3.5,
        output_format: 'jpeg'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: `FLUX API error: ${response.status} - ${errorData.message || 'Unknown error'}`
      }
    }

    const data = await response.json()
    
    if (data.url) {
      return {
        success: true,
        imageUrl: data.url
      }
    } else if (data.image) {
      // GetImg.ai returns base64 encoded image data
      const imageUrl = `data:image/jpeg;base64,${data.image}`
      return {
        success: true,
        imageUrl: imageUrl
      }
    } else {
      return {
        success: false,
        error: 'No image data in FLUX response'
      }
    }

  } catch (error) {
    return {
      success: false,
      error: `FLUX request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Fallback to Stable Diffusion XL for pixel art
async function trySDXLPixelArt(prompt: string, apiKey: string) {
  try {
    // More aggressive pixel art styling for SDXL
    const pixelArtPrompt = `${prompt}, pixel art, 8bit, 16bit, retro, pixelated, low resolution, sprite, video game graphics, nintendo style, sega genesis style, arcade game, pixel perfect, blocky, chunky pixels, retro gaming, synthwave, neon colors, cyberpunk pixel art`
    
    const response = await fetch('https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: pixelArtPrompt,
        negative_prompt: "high resolution, smooth, realistic, photorealistic, detailed, sharp, 3d, modern, clean lines, vector art, smooth gradients",
        width: 512,
        height: 512,
        steps: 20,
        guidance: 8.0,
        output_format: 'jpeg'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('GetImg.ai SDXL API Error:', response.status, errorData)
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid GetImg.ai API key. Please check your GETIMG_API_KEY environment variable.'
        }
      } else if (response.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        }
      } else if (response.status === 400) {
        return {
          success: false,
          error: 'Invalid request parameters. Please try a different prompt.'
        }
      } else {
        return {
          success: false,
          error: `GetImg.ai API error: ${response.status}`
        }
      }
    }

    const data = await response.json()
    
    if (data.url) {
      return {
        success: true,
        imageUrl: data.url
      }
    } else if (data.image) {
      // GetImg.ai returns base64 encoded image data
      const imageUrl = `data:image/jpeg;base64,${data.image}`
      return {
        success: true,
        imageUrl: imageUrl
      }
    } else {
      console.error('Unexpected GetImg.ai SDXL response format:', data)
      return {
        success: false,
        error: 'Unexpected response format from GetImg.ai'
      }
    }

  } catch (error) {
    console.error('Error calling GetImg.ai SDXL API:', error)
    return {
      success: false,
      error: 'Failed to connect to GetImg.ai API'
    }
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    message: 'PixelSynth API is running',
    timestamp: new Date().toISOString()
  })
} 