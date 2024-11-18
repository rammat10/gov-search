import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type Duration = `${number} ms` | `${number} s` | `${number} m` | `${number} h` | `${number} d` | `${number}ms` | `${number}s` | `${number}m` | `${number}h` | `${number}d`

const RATE_LIMIT_WINDOW = (process.env.RATE_LIMIT_WINDOW || '1 h') as Duration
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '50');

// Create a new ratelimiter that allows 50 requests per hour
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW),
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