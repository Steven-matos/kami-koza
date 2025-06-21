'use client'

import { useState, useEffect } from 'react'

interface RateLimitStats {
  totalUsers: number
  timestamp: string
  limits: {
    FREE_GENERATIONS_PER_MONTH: number
    MAX_ATTEMPTS_PER_HOUR: number
    COOLDOWN_PERIOD_MS: number
    MONTHLY_RESET_MS: number
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<RateLimitStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rate-limit')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin text-6xl text-neon-blue mb-4">⚡</div>
          <p className="text-neon-blue font-pixel">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="neon-card p-8 text-center">
            <div className="text-6xl text-red-400 mb-4">⚠️</div>
            <h2 className="text-2xl font-pixel text-red-400 mb-4">Error</h2>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={fetchStats}
              className="retro-button mt-4"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-pixel gradient-text mb-6">
            Admin Dashboard
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-pink to-neon-blue mx-auto mb-8"></div>
          <p className="text-xl text-gray-300">
            Monitor usage and rate limiting statistics
          </p>
        </div>

        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Current Stats */}
            <div className="neon-card p-6">
              <h3 className="text-xl font-pixel text-neon-blue mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Current Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Users:</span>
                  <span className="text-neon-pink font-bold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Updated:</span>
                  <span className="text-neon-blue text-sm">
                    {new Date(stats.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rate Limits */}
            <div className="neon-card p-6">
              <h3 className="text-xl font-pixel text-neon-blue mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Rate Limits
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Free:</span>
                  <span className="text-neon-pink">{stats.limits.FREE_GENERATIONS_PER_MONTH}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Max Attempts/Hour:</span>
                  <span className="text-neon-pink">{stats.limits.MAX_ATTEMPTS_PER_HOUR}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cooldown:</span>
                  <span className="text-neon-pink">{stats.limits.COOLDOWN_PERIOD_MS / 1000 / 60}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Reset:</span>
                  <span className="text-neon-pink">{stats.limits.MONTHLY_RESET_MS / 1000 / 60 / 60 / 24}d</span>
                </div>
              </div>
            </div>

            {/* Abuse Prevention */}
            <div className="neon-card p-6">
              <h3 className="text-xl font-pixel text-neon-blue mb-4 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                Protection
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">IP-based tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Browser fingerprinting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Prompt validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Automatic blocking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Daily limits reset</span>
                </div>
              </div>
            </div>

            {/* Usage Patterns */}
            <div className="neon-card p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-pixel text-neon-blue mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Abuse Prevention Features
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg text-neon-pink mb-3">Multi-Layer Protection</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>IP Address Tracking:</strong> Tracks usage per real IP address</li>
                    <li>• <strong>Browser Fingerprinting:</strong> Combines User-Agent, language, encoding</li>
                    <li>• <strong>Prompt Validation:</strong> Blocks spam, test prompts, and invalid input</li>
                    <li>• <strong>Rate Limiting:</strong> Max 10 attempts per hour, automatic cooldown</li>
                    <li>• <strong>Monthly Limits:</strong> 3 free generations per month, resets every 30 days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg text-neon-pink mb-3">Smart Detection</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• <strong>Suspicious Patterns:</strong> Detects repeated characters, no-letter prompts</li>
                    <li>• <strong>Proxy Detection:</strong> Handles X-Forwarded-For, X-Real-IP headers</li>
                    <li>• <strong>Automatic Blocking:</strong> 1-hour cooldown for excessive attempts</li>
                    <li>• <strong>Graceful Degradation:</strong> Falls back to client-side if API fails</li>
                    <li>• <strong>Production Ready:</strong> Designed for Redis scaling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchStats}
            className="retro-button"
            disabled={isLoading}
          >
            {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Stats'}
          </button>
        </div>
      </div>
    </div>
  )
} 