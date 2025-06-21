'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [generationsLeft, setGenerationsLeft] = useState(3)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resetTime, setResetTime] = useState<number | null>(null)
  const [isCheckingLimit, setIsCheckingLimit] = useState(true)

  // Check rate limit on component mount
  useEffect(() => {
    checkRateLimit()
  }, [])

  // Disable scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const checkRateLimit = async () => {
    try {
      const response = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check' }),
      })

      const data = await response.json()
      
      if (data.allowed) {
        setGenerationsLeft(data.generationsLeft)
        setResetTime(data.resetTime)
      } else {
        setGenerationsLeft(0)
        setError(data.message)
        setResetTime(data.resetTime)
      }
    } catch (err) {
      console.error('Failed to check rate limit:', err)
      // Fallback to client-side tracking if API fails
      setGenerationsLeft(3)
    } finally {
      setIsCheckingLimit(false)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate pixel art.')
      return
    }

    if (generationsLeft <= 0) {
      setError('You\'ve used all your free generations. Get more credits to continue!')
      return
    }

    setIsLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await fetch('/api/generate-pixel-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error types from rate limiting
        if (data.reason === 'rate_limited') {
          setError(data.error)
          setGenerationsLeft(data.generationsLeft)
          setResetTime(data.resetTime)
        } else if (data.reason === 'monthly_limit') {
          setError(data.error)
          setGenerationsLeft(0)
          setResetTime(data.resetTime)
        } else if (data.reason === 'invalid_prompt') {
          setError(data.error)
          setGenerationsLeft(data.generationsLeft)
        } else {
          setError(data.error || 'Failed to generate pixel art')
        }
        return
      }

      setImageUrl(data.imageUrl)
      setGenerationsLeft(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const formatResetTime = (resetTime: number) => {
    const now = Date.now()
    const timeLeft = resetTime - now
    
    if (timeLeft <= 0) return 'Now'
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleDownload = () => {
    if (!imageUrl) return
    
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `pixelsynth-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-pixel gradient-text mb-6 leading-tight">
            AI Pixel Art Generator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-pink to-neon-blue mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            Describe your vision and watch it come to life in <span className="text-neon-pink font-bold">retro pixel style</span>
          </p>
          <div className="glass-effect inline-block px-6 py-3 rounded-full">
            {isCheckingLimit ? (
              <span className="text-neon-blue font-pixel text-sm">
                Checking limits...
              </span>
            ) : (
              <div className="text-center">
                <span className="text-neon-blue font-pixel text-sm">
                  Generations remaining: <span className="text-neon-pink font-bold text-lg">{generationsLeft}</span>
                </span>
                {resetTime && generationsLeft === 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    Resets in: {formatResetTime(resetTime)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div className="neon-card p-8">
              <label htmlFor="prompt" className="block text-2xl font-pixel text-neon-blue mb-6 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                Enter Your Vision
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={generationsLeft <= 0 ? "Get credits to start generating amazing pixel art..." : "A cyberpunk city with neon lights, retro cars flying through the streets, purple and blue color scheme..."}
                className={`w-full h-48 p-6 rounded-xl text-white placeholder-gray-400 focus:outline-none resize-none text-lg transition-all duration-300 ${
                  generationsLeft <= 0 
                    ? 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-60' 
                    : 'bg-synth-dark border-2 border-neon-blue focus:border-neon-pink focus:shadow-neon-glow'
                }`}
                disabled={isLoading || generationsLeft <= 0}
              />
            </div>

            {generationsLeft > 0 ? (
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`retro-button w-full text-xl py-6 ${
                  isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105'
                }`}
              >
                {isLoading ? '🎨 Generating Your Masterpiece...' : '🚀 Generate Pixel Art'}
              </button>
            ) : (
              <Link
                href="/pricing"
                className="retro-button w-full text-xl py-6 text-center block hover:scale-105 transition-transform duration-300"
              >
                💎 Get More Credits
              </Link>
            )}

            {error && generationsLeft > 0 && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {generationsLeft <= 0 && !isCheckingLimit && (
              <div className="p-6 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-pink rounded-lg text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-pixel text-neon-pink mb-2">
                  Free Credits Used Up!
                </h3>
                <p className="text-gray-300 mb-4">
                  You've used all 3 free generations this month. Get credits to continue creating amazing pixel art!
                </p>
                {resetTime && (
                  <p className="text-sm text-gray-400 mb-4">
                    Free credits reset in: <span className="text-neon-blue font-bold">{formatResetTime(resetTime)}</span>
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/pricing" 
                    className="retro-button text-lg px-6 py-3"
                  >
                    🚀 View Pricing Plans
                  </Link>
                  <button
                    onClick={checkRateLimit}
                    className="bg-synth-dark border-2 border-neon-blue text-neon-blue px-6 py-3 font-pixel hover:bg-neon-blue hover:text-synth-dark transition-all duration-300"
                  >
                    🔄 Check Status
                  </button>
                </div>
              </div>
            )}

            {/* Loading Animation */}
            {isLoading && (
              <div className="neon-card p-8 text-center">
                <div className="relative mb-8">
                  <div className="inline-block animate-spin text-6xl text-neon-blue mb-4">⚡</div>
                  <div className="absolute inset-0 animate-ping">
                    <div className="inline-block text-6xl text-neon-pink opacity-30">⚡</div>
                  </div>
                </div>
                <p className="text-neon-blue font-pixel text-lg mb-6">
                  Crafting your pixel masterpiece...
                </p>
                <div className="relative bg-synth-dark rounded-full h-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue opacity-50"></div>
                  <div className="bg-gradient-to-r from-neon-pink to-neon-blue h-4 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-8">
            <div className="neon-card p-8 min-h-[500px] flex items-center justify-center">
              {imageUrl ? (
                <div className="text-center w-full">
                  <div className="relative inline-block mb-8">
                    <img
                      src={imageUrl}
                      alt="Generated pixel art"
                      className="max-w-full h-auto rounded-xl shadow-neon-glow-lg mx-auto border-2 border-neon-blue cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <div className="absolute -inset-4 bg-gradient-to-r from-neon-pink to-neon-blue rounded-xl opacity-20 blur-xl"></div>
                    {/* Click to expand hint */}
                    <div className="absolute top-2 right-2 bg-synth-dark/80 text-neon-blue text-xs px-2 py-1 rounded font-pixel">
                      🔍 Click to expand
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="retro-button text-lg px-8 py-4"
                    >
                      📥 Download Image
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-synth-dark border-2 border-neon-blue text-neon-blue px-8 py-4 font-pixel hover:bg-neon-blue hover:text-synth-dark transition-all duration-300"
                    >
                      🔍 View Full Size
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-8xl mb-8 opacity-50">🎨</div>
                  <p className="font-pixel text-lg text-neon-blue">
                    {isLoading ? 'Generating...' : 'Your pixel art will appear here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Enter a prompt and click generate to create your masterpiece
                  </p>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="neon-card p-6">
              <h3 className="text-xl font-pixel text-neon-blue mb-6 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Quick Prompts
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { text: 'Synthwave sunset with palm trees', icon: '🌴' },
                  { text: 'Cyberpunk motorcycle in neon city', icon: '🏍️' },
                  { text: 'Retro arcade cabinet', icon: '🕹️' },
                  { text: 'Space station with Earth in background', icon: '🚀' }
                ].map((quickPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(quickPrompt.text)}
                    className="flex items-center gap-3 text-left p-4 bg-synth-dark hover:bg-neon-blue/10 border border-synth-light hover:border-neon-blue rounded-lg transition-all duration-300 text-sm group"
                    disabled={isLoading}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {quickPrompt.icon}
                    </span>
                    <span className="group-hover:text-neon-blue transition-colors duration-300">
                      {quickPrompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && imageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 z-10 text-white hover:text-neon-pink text-xl font-pixel bg-synth-dark border-2 border-neon-pink px-3 py-2 rounded-full transition-colors duration-300 shadow-lg"
            >
              ✕
            </button>
            
            {/* Modal content */}
            <div 
              className="relative bg-synth-dark border-2 border-neon-blue rounded-xl shadow-neon-glow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image container */}
              <div className="p-6">
                <div className="relative flex justify-center">
                  <img
                    src={imageUrl}
                    alt="Generated pixel art - Full size"
                    className="max-w-full max-h-[65vh] h-auto rounded-lg shadow-neon-glow border border-neon-blue/50"
                    style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-neon-pink to-neon-blue rounded-lg opacity-10 blur-lg pointer-events-none"></div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="border-t border-neon-blue/30 p-6 bg-synth-dark/95">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <button
                    onClick={handleDownload}
                    className="retro-button text-base px-6 py-3"
                  >
                    📥 Download Full Size
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-synth-dark border-2 border-neon-pink text-neon-pink px-6 py-3 font-pixel hover:bg-neon-pink hover:text-synth-dark transition-all duration-300"
                  >
                    ← Back to Generator
                  </button>
                </div>
                
                {/* Prompt display */}
                {prompt && (
                  <div className="p-4 bg-synth-medium/50 rounded-lg border border-neon-blue/30">
                    <p className="text-neon-blue font-pixel text-sm mb-2">Generated from:</p>
                    <p className="text-gray-300 text-sm italic">"{prompt}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 