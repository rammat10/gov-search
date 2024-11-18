import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter that allows 50 requests per hour
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, '1 h'),
  analytics: true, // Optional: Enable analytics
  prefix: '@upstash/ratelimit',
})

export async function rateLimit(ip: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(ip)
  
  return {
    success,
    limit,
    remaining,
    reset: new Date(reset),
  }
} 