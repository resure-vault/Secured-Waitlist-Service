import { kv } from '@vercel/kv'

const WINDOW_SIZE = 300
const MAX_GLOBAL_REQUESTS = 50
const EMAIL_COOLDOWN = 3600
const PATTERN_THRESHOLD = 3
const BURST_WINDOW = 60

export class RateLimiter {
  private async incrementCounter(key: string, ttl: number): Promise<number> {
    const current = await kv.get(key) as number || 0
    const newValue = current + 1
    await kv.setex(key, ttl, newValue)
    return newValue
  }

  async checkGlobalLimit(): Promise<boolean> {
    const key = `global:${Math.floor(Date.now() / (WINDOW_SIZE * 1000))}`
    const count = await this.incrementCounter(key, WINDOW_SIZE)
    return count > MAX_GLOBAL_REQUESTS
  }

  async checkEmailCooldown(email: string): Promise<boolean> {
    const key = `email:${email}`
    const exists = await kv.get(key)
    if (exists) return true
    
    await kv.setex(key, EMAIL_COOLDOWN, 1)
    return false
  }

  async checkBurstPattern(email: string): Promise<boolean> {
    const prefix = email.split('@')[0].replace(/\d+$/, 'X')
    const domain = email.split('@')[1]
    const key = `burst:${prefix}:${domain}`
    
    const count = await this.incrementCounter(key, BURST_WINDOW)
    return count > PATTERN_THRESHOLD
  }

  async markSuspicious(identifier: string): Promise<void> {
    await kv.setex(`suspicious:${identifier}`, 7200, 1)
  }

  async isSuspicious(identifier: string): Promise<boolean> {
    return !!(await kv.get(`suspicious:${identifier}`))
  }
}
