import { NextResponse } from "next/server"
import { pool, getCount } from "@/lib/db"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const count = await getCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching count:', error)
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email || typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const existingEmail = await pool.query(
      'SELECT email FROM waitlist_emails WHERE email = $1',
      [email]
    )

    if (existingEmail.rows.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    await pool.query(
      'INSERT INTO waitlist_emails (email) VALUES ($1)',
      [email]
    )

    try {
      await resend.contacts.create({
        email: email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
        unsubscribed: false,
      })
    } catch (resendError) {
      console.error('Failed to add to Resend audience:', resendError)
    }

    const count = await getCount()
    return NextResponse.json({ ok: true, count })
    
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
  }
}
