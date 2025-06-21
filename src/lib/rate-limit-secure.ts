import { NextRequest } from 'next/server'
import crypto from 'crypto'

// In-memory store for rate limiting (in production, use Redis with persistence)
const rateLimitStore = new Map()
const nonceStore = new Set() // Track used nonces to prevent replay attacks

// Security configuration
const SECURITY_CONFIG = {
  SECRET_KEY: process.env.RATE_LIMIT_SECRET || 'your-super-secret-key-change-in-production',
  NONCE_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  MAX_CLOCK_SKEW_MS: 30 * 1000, // 30 seconds
  SUSPICIOUS_THRESHOLD: 5, // Suspicious activity threshold
}

// Rate limiting configuration
export const RATE_LIMITS = {
  FREE_GENERATIONS_PER_MONTH: 3,
  MAX_ATTEMPTS_PER_HOUR: 10,
  COOLDOWN_PERIOD_MS: 60 * 60 * 1000, // 1 hour
  MONTHLY_RESET_MS: 30 * 24 * 60 * 60 * 1000, // 30 days
  SUSPICIOUS_BLOCK_MS: 24 * 60 * 60 * 1000, // 24 hours for suspicious activity
}

// User data interface
interface UserData {
  generationsUsed: number
  lastReset: number
  attempts: number
  lastAttempt: number
  isBlocked: boolean
  blockUntil: number
  suspiciousActivity: number
  firstSeen: number
}

// Enhanced IP detection with anti-spoofing measures
function getClientIP(request: NextRequest): string {
  // Priority order for IP detection (most trusted first)
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  const xRealIP = request.headers.get('x-real-ip')
  const xForwardedFor = request.headers.get('x-forwarded-for')
  
  // Cloudflare is most trusted if present
  if (cfConnectingIP && isValidIP(cfConnectingIP)) {
    return cfConnectingIP
  }
  
  // X-Real-IP is next most trusted
  if (xRealIP && isValidIP(xRealIP)) {
    return xRealIP
  }
  
  // X-Forwarded-For (take first IP, validate)
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim())
    const firstIP = ips[0]
    if (firstIP && isValidIP(firstIP)) {
      // Check for suspicious patterns in forwarded headers
      if (ips.length > 5 || ips.some(ip => !isValidIP(ip))) {
        // Suspicious forwarding chain, create special identifier
        return `suspicious-${crypto.createHash('sha256').update(xForwardedFor).digest('hex').slice(0, 16)}`
      }
      return firstIP
    }
  }
  
  // Fallback: create identifier from multiple headers
  return createFallbackIdentifier(request)
}

function isValidIP(ip: string): boolean {
  // IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.').map(Number)
    return parts.every(part => part >= 0 && part <= 255) && 
           !isPrivateIP(ip) && 
           !isReservedIP(ip)
  }
  
  // IPv6 basic validation (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv6Regex.test(ip)
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  return (
    (parts[0] === 10) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 127) // localhost
  )
}

function isReservedIP(ip: string): boolean {
  const reserved = ['0.0.0.0', '255.255.255.255', '127.0.0.1']
  return reserved.includes(ip) || ip.startsWith('169.254.') // link-local
}

function createFallbackIdentifier(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || ''
  const acceptLanguage = request.headers.get('accept-language') || ''
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  const connection = request.headers.get('connection') || ''
  
  // Create a more sophisticated fingerprint
  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}|${connection}`
  return `fallback-${crypto.createHash('sha256').update(fingerprint).digest('hex').slice(0, 16)}`
}

// Enhanced device fingerprinting with multiple factors
function createDeviceFingerprint(request: NextRequest): string {
  const factors = [
    request.headers.get('user-agent') || '',
    request.headers.get('accept-language') || '',
    request.headers.get('accept-encoding') || '',
    request.headers.get('accept') || '',
    request.headers.get('dnt') || '', // Do Not Track
    request.headers.get('upgrade-insecure-requests') || '',
    request.headers.get('sec-fetch-site') || '',
    request.headers.get('sec-fetch-mode') || '',
    request.headers.get('sec-fetch-dest') || '',
    getClientIP(request),
  ]
  
  // Create HMAC-based fingerprint for security
  const data = factors.join('|')
  return crypto.createHmac('sha256', SECURITY_CONFIG.SECRET_KEY)
    .update(data)
    .digest('hex')
    .slice(0, 32)
}

// Cryptographic request verification (currently unused but ready for future implementation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function verifyRequestSignature(request: NextRequest, timestamp: number, nonce: string): boolean {
  const signature = request.headers.get('x-signature')
  if (!signature) return false
  
  const userAgent = request.headers.get('user-agent') || ''
  const origin = request.headers.get('origin') || ''
  
  // Create expected signature
  const data = `${timestamp}|${nonce}|${userAgent}|${origin}`
  const expectedSignature = crypto.createHmac('sha256', SECURITY_CONFIG.SECRET_KEY)
    .update(data)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

// Enhanced prompt validation with ML-like patterns
function isValidPrompt(prompt: string): boolean {
  if (!prompt || typeof prompt !== 'string') return false
  if (prompt.trim().length < 3) return false
  if (prompt.length > 500) return false
  
  // Enhanced suspicious patterns
  const suspiciousPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /^[^a-zA-Z]*$/, // No letters at all
    /^\s*$/, // Only whitespace
    /test{3,}/i, // Multiple "test"
    /spam/i,
    /abuse/i,
    /^(.{1,3})\1{5,}$/, // Short repeated patterns
    /^[0-9\s\-_\.]{10,}$/, // Only numbers and basic chars
    /lorem\s+ipsum/i, // Lorem ipsum
    /asdf{2,}/i, // Keyboard mashing
    /qwerty/i, // Keyboard patterns
    /^\w{1,2}(\s+\w{1,2}){10,}$/, // Many short words
  ]
  
  // Check for suspicious patterns
  if (suspiciousPatterns.some(pattern => pattern.test(prompt))) {
    return false
  }
  
  // Check character diversity (prevent simple repeating)
  const uniqueChars = new Set(prompt.toLowerCase().replace(/\s/g, '')).size
  const totalChars = prompt.replace(/\s/g, '').length
  if (totalChars > 0 && uniqueChars / totalChars < 0.3) {
    return false // Too little character diversity
  }
  
  return true
}

// Detect suspicious activity patterns
function detectSuspiciousActivity(userData: UserData, request: NextRequest): boolean {
  const now = Date.now()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const recentWindow = 10 * 60 * 1000 // 10 minutes
  
  // Check for rapid attempts
  if (userData.attempts > 3 && (now - userData.lastAttempt) < 60000) {
    return true
  }
  
  // Check for header manipulation patterns
  const userAgent = request.headers.get('user-agent') || ''
  if (userAgent.length < 10 || userAgent.includes('curl') || userAgent.includes('wget')) {
    return true
  }
  
  // Check for missing common headers
  const requiredHeaders = ['accept', 'accept-language', 'accept-encoding']
  const missingHeaders = requiredHeaders.filter(header => !request.headers.get(header))
  if (missingHeaders.length > 1) {
    return true
  }
  
  return false
}

export interface RateLimitResult {
  allowed: boolean
  reason?: string
  message: string
  generationsLeft: number
  resetTime: number
  suspicious?: boolean
}

export async function checkRateLimit(
  request: NextRequest, 
  prompt: string, 
  action: 'check' | 'consume'
): Promise<RateLimitResult> {
  const now = Date.now()
  
  // Extract security headers
  const timestamp = parseInt(request.headers.get('x-timestamp') || '0')
  const nonce = request.headers.get('x-nonce') || ''
  const origin = request.headers.get('origin') || ''
  
  // Verify request timing (prevent replay attacks)
  if (Math.abs(now - timestamp) > SECURITY_CONFIG.MAX_CLOCK_SKEW_MS) {
    return {
      allowed: false,
      reason: 'invalid_timestamp',
      message: 'Request timestamp is invalid.',
      generationsLeft: 0,
      resetTime: now + RATE_LIMITS.MONTHLY_RESET_MS,
      suspicious: true
    }
  }
  
  // Verify nonce (prevent replay attacks)
  if (nonceStore.has(nonce)) {
    return {
      allowed: false,
      reason: 'replay_attack',
      message: 'Request replay detected.',
      generationsLeft: 0,
      resetTime: now + RATE_LIMITS.MONTHLY_RESET_MS,
      suspicious: true
    }
  }
  
  // Store nonce (cleanup old ones periodically)
  nonceStore.add(nonce)
  if (nonceStore.size > 10000) {
    // Simple cleanup - in production, use proper expiry
    nonceStore.clear()
  }
  
  // Verify origin for legitimate requests
  const validOrigins = [
    'http://localhost:3000',
    'https://your-domain.com', // Add your production domain
  ]
  
  if (origin && !validOrigins.includes(origin)) {
    return {
      allowed: false,
      reason: 'invalid_origin',
      message: 'Request from unauthorized origin.',
      generationsLeft: 0,
      resetTime: now + RATE_LIMITS.MONTHLY_RESET_MS,
      suspicious: true
    }
  }
  
  const clientIP = getClientIP(request)
  const fingerprint = createDeviceFingerprint(request)
  
  // Create composite user key
  const userKey = `${clientIP}-${fingerprint}`
  const userData = rateLimitStore.get(userKey) || {
    generationsUsed: 0,
    lastReset: now,
    attempts: 0,
    lastAttempt: 0,
    isBlocked: false,
    blockUntil: 0,
    suspiciousActivity: 0,
    firstSeen: now,
  }
  
  // Reset monthly counter if 30 days have passed
  if (now - userData.lastReset > RATE_LIMITS.MONTHLY_RESET_MS) {
    userData.generationsUsed = 0
    userData.lastReset = now
    userData.attempts = 0
    userData.suspiciousActivity = Math.max(0, userData.suspiciousActivity - 1) // Decay suspicion
  }
  
  // Check for suspicious activity
  if (detectSuspiciousActivity(userData, request)) {
    userData.suspiciousActivity++
    
    if (userData.suspiciousActivity >= SECURITY_CONFIG.SUSPICIOUS_THRESHOLD) {
      userData.isBlocked = true
      userData.blockUntil = now + RATE_LIMITS.SUSPICIOUS_BLOCK_MS
      rateLimitStore.set(userKey, userData)
      
      return {
        allowed: false,
        reason: 'suspicious_activity',
        message: 'Suspicious activity detected. Account temporarily blocked.',
        generationsLeft: 0,
        resetTime: userData.blockUntil,
        suspicious: true
      }
    }
  }
  
  // Check if user is currently blocked
  if (userData.isBlocked && now < userData.blockUntil) {
    const remainingTime = Math.ceil((userData.blockUntil - now) / 1000 / 60)
    return {
      allowed: false,
      reason: 'rate_limited',
      message: `Account blocked. Please try again in ${remainingTime} minutes.`,
      generationsLeft: Math.max(0, RATE_LIMITS.FREE_GENERATIONS_PER_MONTH - userData.generationsUsed),
      resetTime: userData.lastReset + RATE_LIMITS.MONTHLY_RESET_MS
    }
  }
  
  // Remove block if time has passed
  if (userData.isBlocked && now >= userData.blockUntil) {
    userData.isBlocked = false
    userData.blockUntil = 0
    userData.attempts = 0
  }
  
  // Validate prompt if provided
  if (prompt && !isValidPrompt(prompt)) {
    userData.attempts++
    userData.suspiciousActivity++
    rateLimitStore.set(userKey, userData)
    
    return {
      allowed: false,
      reason: 'invalid_prompt',
      message: 'Please enter a valid prompt (3-500 characters, descriptive text).',
      generationsLeft: Math.max(0, RATE_LIMITS.FREE_GENERATIONS_PER_MONTH - userData.generationsUsed),
      resetTime: userData.lastReset + RATE_LIMITS.MONTHLY_RESET_MS
    }
  }
  
  // Check monthly generation limit
  if (userData.generationsUsed >= RATE_LIMITS.FREE_GENERATIONS_PER_MONTH) {
    return {
      allowed: false,
      reason: 'monthly_limit',
      message: 'Monthly free generation limit reached. Purchase credits to continue.',
      generationsLeft: 0,
      resetTime: userData.lastReset + RATE_LIMITS.MONTHLY_RESET_MS
    }
  }
  
  // Check for too many attempts in short time
  const hourAgo = now - RATE_LIMITS.COOLDOWN_PERIOD_MS
  if (userData.lastAttempt > hourAgo) {
    userData.attempts++
  } else {
    userData.attempts = 1
  }
  
  userData.lastAttempt = now
  
  // Block user if too many attempts
  if (userData.attempts > RATE_LIMITS.MAX_ATTEMPTS_PER_HOUR) {
    userData.isBlocked = true
    userData.blockUntil = now + RATE_LIMITS.COOLDOWN_PERIOD_MS
    rateLimitStore.set(userKey, userData)
    
    return {
      allowed: false,
      reason: 'rate_limited',
      message: 'Too many generation attempts. Please try again in 1 hour.',
      generationsLeft: Math.max(0, RATE_LIMITS.FREE_GENERATIONS_PER_MONTH - userData.generationsUsed),
      resetTime: userData.lastReset + RATE_LIMITS.MONTHLY_RESET_MS
    }
  }
  
  // If action is 'consume', actually use a generation
  if (action === 'consume') {
    userData.generationsUsed++
  }
  
  // Save updated data
  rateLimitStore.set(userKey, userData)
  
  const generationsLeft = Math.max(0, RATE_LIMITS.FREE_GENERATIONS_PER_MONTH - userData.generationsUsed)
  
  return {
    allowed: true,
    generationsLeft,
    resetTime: userData.lastReset + RATE_LIMITS.MONTHLY_RESET_MS,
    message: generationsLeft > 0 ? 
      `${generationsLeft} free generations remaining this month.` : 
      'This was your last free generation this month.'
  }
}

export function getRateLimitStats() {
  const stats = {
    totalUsers: rateLimitStore.size,
    timestamp: new Date().toISOString(),
    limits: RATE_LIMITS,
    security: {
      nonceStoreSize: nonceStore.size,
      suspiciousBlocks: Array.from(rateLimitStore.values()).filter((u: UserData) => u.suspiciousActivity > 0).length,
      activeBlocks: Array.from(rateLimitStore.values()).filter((u: UserData) => u.isBlocked && Date.now() < u.blockUntil).length,
    }
  }
  
  return stats
} 