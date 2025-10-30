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
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = request.query

    if (!id || typeof id !== 'string') {
      return response.status(400).json({ error: 'Invalid short URL' })
    }

    // Ensure Redis is connected
    await ensureConnected()

    // Look up the URL in Redis
    const longUrl = await redis.get(`url:${id}`)

    if (!longUrl) {
      return response.status(404).json({ error: 'Short URL not found' })
    }

    // Redirect to the long URL
    return response.redirect(302, longUrl)
  } catch (error) {
    console.error('Error retrieving short URL:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }
}
