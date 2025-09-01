import { kv } from '@vercel/kv'
import validator from 'validator'
import { promisify } from 'util'
import { resolveMx } from 'dns'

const resolveMxAsync = promisify(resolveMx)

export class SpamDetector {
  private readonly patterns = [
    /^\d+@\d+\.com$/i,
    /^[a-z]{1,3}\d+@\d+\.com$/i,
    /^[a-z]+\d{4,}@\d+\.com$/i,
    /^[a-z]{1,5}@\d{1,5}\.com$/i,
    /^[a-z]+\d+@[a-z]*\d{3,}\.(com|org|net)$/i,
    /^(test|demo|fake|spam|temp|example)\d*@/i,
    /^\w{1,3}@\w{1,3}\.(com|net|org)$/i,
    /^[a-z]*\d{5,}@/i,
    /^[a-z]+@[a-z]*\d+\.(tk|ml|ga|cf)$/i
  ]

  private readonly disposableDomains = new Set([
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'sharklasers.com', 'yopmail.com',
    'getnada.com', 'maildrop.cc', '1secmail.com', 'disposable.email',
    'mailnesia.com', 'trashmail.com', 'temporary-mail.net'
  ])

  private readonly suspiciousTlds = new Set([
    'tk', 'ml', 'ga', 'cf', 'link', 'click', 'download', 'zip'
  ])

  async isSpam(email: string): Promise<boolean> {
    const normalized = email.toLowerCase().trim()
    
    if (!validator.isEmail(normalized)) return true
    if (this.patterns.some(pattern => pattern.test(normalized))) return true
    
    const domain = normalized.split('@')[1]
    if (this.disposableDomains.has(domain)) return true
    if (this.suspiciousTlds.has(domain.split('.').pop()!)) return true
    if (this.hasObviousSpamStructure(normalized)) return true
    
    return false
  }

  private hasObviousSpamStructure(email: string): boolean {
    const [local, domain] = email.split('@')
    
    if (local.length <= 2 && /^\d+$/.test(local)) return true
    if (domain.length <= 5 && /^\d+\.com$/.test(domain)) return true
    if (/^[a-z]{1,2}\d+$/.test(local) && /^\d+\.com$/.test(domain)) return true
    
    const localNumbers = (local.match(/\d/g) || []).length
    const domainNumbers = (domain.match(/\d/g) || []).length
    if (localNumbers >= 3 && domainNumbers >= 3) return true
    
    return false
  }

  async checkDomainHealth(domain: string): Promise<boolean> {
    try {
      const cached = await kv.get(`domain:${domain}`)
      if (cached !== null) return cached as boolean
      
      const records = await resolveMxAsync(domain)
      const isHealthy = records && records.length > 0
      
      await kv.setex(`domain:${domain}`, 3600, isHealthy)
      return isHealthy
    } catch {
      return false
    }
  }

  async markSuspiciousDomain(domain: string): Promise<void> {
    const key = `suspicious_domain:${domain}`
    const count = await kv.get(key) as number || 0
    await kv.setex(key, 86400, count + 1)
  }

  async isDomainSuspicious(domain: string): Promise<boolean> {
    const count = await kv.get(`suspicious_domain:${domain}`) as number || 0
    return count >= 3
  }
}
