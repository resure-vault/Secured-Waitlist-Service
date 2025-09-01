import { NextResponse } from "next/server"
import { pool, getCount } from "@/lib/db"
import { Resend } from 'resend'
import { SpamDetector } from '@/lib/spam-detector'
import { RateLimiter } from '@/lib/rate-limiter'

const resend = new Resend(process.env.RESEND_API_KEY)
const spamDetector = new SpamDetector()
const rateLimiter = new RateLimiter()

export async function GET() {
  try {
    const count = await getCount()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const email = body.email.toLowerCase().trim()
    const domain = email.split('@')[1]
    
    if (await spamDetector.isSpam(email)) {
      await spamDetector.markSuspiciousDomain(domain)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (await spamDetector.isDomainSuspicious(domain)) {
      return NextResponse.json({ error: "Domain temporarily blocked" }, { status: 429 })
    }

    if (await rateLimiter.checkGlobalLimit()) {
      return NextResponse.json({ error: "Service busy" }, { status: 429 })
    }

    if (await rateLimiter.checkEmailCooldown(email)) {
      return NextResponse.json({ error: "Email recently used" }, { status: 429 })
    }

    if (await rateLimiter.trackDomainActivity(domain)) {
      await spamDetector.markSuspiciousDomain(domain)
      return NextResponse.json({ error: "Too many requests from domain" }, { status: 429 })
    }

    const existing = await pool.query(
      'SELECT 1 FROM waitlist_emails WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    await pool.query(
      'INSERT INTO waitlist_emails (email, created_at) VALUES ($1, NOW())',
      [email]
    )

    resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    }).catch(() => {})

    const count = await getCount()
    return NextResponse.json({ ok: true, count })
    
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
