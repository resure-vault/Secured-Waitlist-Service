export class EmailValidator {
    private suspiciousPatterns = [
      /^[a-z]+\d{4,}@\d+\.com$/i,
      /^[a-z]{1,3}\d+@[a-z]{1,3}\d+\.(com|org|net)$/i,
      /^(test|demo|fake|spam|temp)\d*@/i,
      /^[a-z]*\d{5,}@/i,
      /([a-z])\1{5,}/i
    ]
  
    private disposableDomains = new Set([
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'temp-mail.org', 'throwaway.email',
      'sharklasers.com', 'yopmail.com', 'getnada.com'
    ])
  
    isValid(email: string): boolean {
      if (!email || typeof email !== 'string') return false
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false
      if (email.length > 320) return false
      
      const [local, domain] = email.split('@')
      if (local.length > 64 || domain.length > 255) return false
      
      return true
    }
  
    isSpam(email: string): boolean {
      return this.suspiciousPatterns.some(pattern => pattern.test(email))
    }
  
    isDisposable(email: string): boolean {
      const domain = email.split('@')[1]?.toLowerCase()
      return this.disposableDomains.has(domain)
    }
  
    normalize(email: string): string {
      return email.toLowerCase().trim()
    }
  }
  