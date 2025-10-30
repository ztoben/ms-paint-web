import { createClient } from 'redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Create Redis client - connects to REDIS_URL environment variable
const redis = createClient({
  url: process.env.REDIS_URL
})

redis.on('error', (err) => console.error('Redis Client Error', err))

// Connect to Redis (connection is maintained across invocations)
let isConnected = false
async function ensureConnected() {
  if (!isConnected) {
    await redis.connect()
    isConnected = true
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = request.body

    if (!url || typeof url !== 'string') {
      return response.status(400).json({ error: 'URL is required' })
    }

    // Validate URL length (prevent abuse)
    if (url.length > 100000) {
      return response.status(400).json({ error: 'URL is too long' })
    }

    // Ensure Redis is connected
    await ensureConnected()

    // Generate a short ID (6 characters, base36)
    const shortId = generateShortId()

    // Store in Redis with 30 day expiration
    await redis.setEx(`url:${shortId}`, 60 * 60 * 24 * 30, url)

    // Return the short URL
    const shortUrl = `${request.headers.host}/${shortId}`
    return response.status(200).json({ shortUrl, shortId })
  } catch (error) {
    console.error('Error creating short URL:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }
}

function generateShortId(): string {
  // Generate 6-character random string using base36 (0-9, a-z)
  return Math.random().toString(36).substring(2, 8)
}
