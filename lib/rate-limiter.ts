import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export class RateLimiter {
  async checkEmailCooldown(email: string): Promise<boolean> {
    const key = `cooldown:${email}`
    const exists = await redis.get(key)
    if (exists) return true
    
    await redis.setex(key, 1800, 1)
    return false
  }

  async checkGlobalLimit(): Promise<boolean> {
    const window = Math.floor(Date.now() / 300000)
    const key = `global:${window}`
    const count = await redis.get(key) as number || 0
    
    if (count >= 30) return true
    
    await redis.setex(key, 300, count + 1)
    return false
  }

  async trackDomainActivity(domain: string): Promise<boolean> {
    const window = Math.floor(Date.now() / 600000)
    const key = `domain_activity:${domain}:${window}`
    const count = await redis.get(key) as number || 0
    
    if (count >= 5) return true
    
    await redis.setex(key, 600, count + 1)
    return false
  }
}
