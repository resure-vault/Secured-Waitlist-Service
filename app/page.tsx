"use client"

import type React from "react"
import Link from "next/link"
import useSWR from "swr"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SignupsResponse = { count: number }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-black text-white selection:bg-white/20">
      <Header />
      <main className="relative">
        <section className="relative overflow-hidden px-6 md:px-10 py-32 md:py-44 min-h-screen flex items-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
              animation: 'float 25s ease-in-out infinite',
            }}
          />
          
          <div className="mx-auto max-w-4xl text-center w-full">
            <div className="space-y-8">
              <a
                href="https://github.com/resure-vault"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
              >
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-white">Open Source</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
                Your API Keys.
                <br />
                <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                  Finally Safe.
                </span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                The open-source vault that developers trust.
                <br />
                <span className="text-white font-normal">Zero compromises. Zero breaches.</span>
              </p>
              
              <div className="pt-8">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
      `}</style>
    </div>
  )
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight hover:scale-105 transition-transform duration-200">
          Resure
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/roadmap" 
            className="text-sm text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
          >
            Roadmap
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
              aria-label={link.label}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          
          <a
            href="https://github.com/resure-vault"
            target="_blank"
            rel="noreferrer"
            className="ml-4 px-4 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Star on GitHub
          </a>
        </nav>

        <button className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}

function WaitlistForm() {
  const { data, mutate } = useSWR<SignupsResponse>("/api/signups", fetcher, { 
    refreshInterval: 15000,
    revalidateOnFocus: false 
  })
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [hasJoined, setHasJoined] = useState(false)

  // Check if user has already joined on component mount
  useEffect(() => {
    const joinedWaitlist = localStorage.getItem('resure-waitlist-joined')
    const joinedEmail = localStorage.getItem('resure-waitlist-email')
    
    if (joinedWaitlist === 'true') {
      setHasJoined(true)
      if (joinedEmail) {
        setSuccess(true)
      }
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || loading || hasJoined) return
    
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const result = await res.json()
      
      if (res.ok) {
        setSuccess(true)
        setHasJoined(true)
        setEmail("")
        mutate()
        
        // Store in localStorage to prevent future signups
        localStorage.setItem('resure-waitlist-joined', 'true')
        localStorage.setItem('resure-waitlist-email', email)
        localStorage.setItem('resure-waitlist-date', new Date().toISOString())
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show already joined state if user has previously joined
  if (hasJoined || success) {
    const joinedEmail = localStorage.getItem('resure-waitlist-email')
    const joinedDate = localStorage.getItem('resure-waitlist-date')
    
    return (
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">You're already in!</h3>
          <p className="text-lg text-gray-300">
            We'll notify you as soon as Resure is ready to secure your keys.
          </p>
          {joinedEmail && (
            <p className="text-sm text-gray-400">
              Joined with: {joinedEmail}
            </p>
          )}
          {joinedDate && (
            <p className="text-xs text-gray-500">
              Joined on: {new Date(joinedDate).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <button
          onClick={() => {
            // Allow user to clear their local storage if they want to join with a different email
            localStorage.removeItem('resure-waitlist-joined')
            localStorage.removeItem('resure-waitlist-email')
            localStorage.removeItem('resure-waitlist-date')
            setHasJoined(false)
            setSuccess(false)
          }}
          className="text-gray-400 hover:text-gray-300 underline transition-colors text-sm"
        >
          Join with a different email
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={cn(
              "h-12 px-4 text-base bg-white/5 text-white placeholder:text-gray-400 border border-white/15",
              "focus-visible:ring-0 focus-visible:border-white/40",
              "rounded-xl transition-all duration-200",
              error && "border-red-500/50 focus-visible:border-red-500/40"
            )}
            disabled={loading}
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading || !email}
          className={cn(
            "h-12 px-6 text-base font-semibold rounded-xl sm:min-w-[140px]",
            "bg-white text-black hover:bg-gray-100 active:scale-95",
            "transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Joining...
            </div>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-center font-medium">{error}</p>
        </div>
      )}

      <div className="text-center space-y-2">
        <p className="text-base text-gray-300">
          {typeof data?.count === "number" ? (
            <>
              <span className="font-bold text-white text-lg">{data.count.toLocaleString()}</span>
              <span className="text-gray-400 ml-1">developers joined</span>
            </>
          ) : (
            <span className="animate-pulse text-gray-500">Loading...</span>
          )}
        </p>
        <p className="text-sm text-gray-500">
          No spam, just updates when we launch.
        </p>
      </div>
    </div>
  )
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/resure-vault" },
  { label: "Discord", href: "https://discord.gg/5z9gb4Fyxx" },
  { label: "X", href: "https://x.com/resure_" }
]
