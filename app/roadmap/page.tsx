"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tight hover:scale-105 transition-transform duration-200">
          Resure
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm text-gray-300 hover:text-white transition-all duration-300 font-medium relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <Link 
            href="/roadmap" 
            className="text-sm text-white font-medium relative"
          >
            Roadmap
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"></span>
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

type Status = "not-started" | "pending" | "in-progress" | "complete"

type RoadmapItem = {
  id: string
  title: string
  status: Status
  quarter: string
  description: string
  languages: string[]
}

const items: RoadmapItem[] = [
  {
    id: "backend-rewrite",
    title: "Web backend rewrite (Go → TypeScript)",
    status: "in-progress",
    quarter: "Q3–Q4 2025",
    description: "Migrating from Go to TypeScript for a unified stack, faster iteration, and better developer experience. This includes API redesign, database optimization, and improved error handling.",
    languages: ["go", "typescript"]
  },
  {
    id: "frontend",
    title: "Frontend Dashboard & UI",
    status: "in-progress",
    quarter: "Q4 2025",
    description: "Modern React-based dashboard for key management with intuitive flows, team collaboration features, and responsive design. Includes dark mode, accessibility improvements, and mobile support.",
    languages: ["typescript", "react"]
  },
  {
    id: "cli-go",
    title: "CLI Tool",
    status: "in-progress",
    quarter: "Q4 2025",
    description: "Lightweight command-line interface for developers to interact with the vault from local development environments and CI/CD pipelines. Cross-platform support with auto-updates.",
    languages: ["go"]
  },
  {
    id: "db-operator",
    title: "Database Operator",
    status: "complete",
    quarter: "Q3 2025",
    description: "High-performance database operations engine for handling encrypted key storage, retrieval, and synchronization across distributed systems.",
    languages: ["cpp"]
  },
  {
    id: "gui",
    title: "Desktop GUI Application",
    status: "pending",
    quarter: "Q2 2026",
    description: "Cross-platform desktop application built with Tauri and Rust. Native performance with system tray integration, local caching, and offline capabilities.",
    languages: ["rust"]
  },
]

// Language icons component using your SVG files
function LanguageIcon({ language }: { language: string }) {
  const iconMap = {
    go: "/go.svg",
    typescript: "/typescript.svg",
    react: "/react.svg",
    rust: "/rust.svg",
    cpp: "/cpp.svg"
  }

  const iconPath = iconMap[language as keyof typeof iconMap]
  
  if (!iconPath) return null
  
  return (
    <div className="w-5 h-5 flex items-center justify-center">
      <Image
        src={iconPath}
        alt={`${language} icon`}
        width={20}
        height={20}
        className="w-5 h-5 opacity-80"
      />
    </div>
  )
}

export default function RoadmapPage() {
  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <Header />
      <main className="relative pt-24 pb-16">
        <section className="px-6 md:px-10 py-16 border-b border-white/5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Live Updates</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Development
              <span className="block text-gray-400">Roadmap</span>
            </h1>
            
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
              Transparent progress on Resure's development. Track features, timelines, and what's coming next.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-10 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <StatCard 
                number={items.filter(i => i.status === 'complete').length.toString()}
                label="Completed" 
              />
              <StatCard 
                number={items.filter(i => i.status === 'in-progress').length.toString()}
                label="In Progress" 
              />
              <StatCard 
                number={items.filter(i => i.status === 'pending').length.toString()}
                label="Planned" 
              />
              <StatCard 
                number={items.length.toString()}
                label="Total Items" 
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
              
              <div className="space-y-12">
                {items.map((item, index) => (
                  <TimelineItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-xl border border-white/10 bg-white/5">
      <div className="text-3xl font-black text-white mb-2">{number}</div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </div>
  )
}

function StatusDot({ status }: { status: Status }) {
  const config = {
    complete: { 
      bg: "bg-green-400", 
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.6)]",
      ring: "ring-2 ring-green-400/30" 
    },
    "in-progress": { 
      bg: "bg-blue-400", 
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.6)]",
      ring: "ring-2 ring-blue-400/30" 
    },
    pending: { 
      bg: "bg-yellow-400", 
      glow: "shadow-[0_0_16px_rgba(251,191,36,0.5)]",
      ring: "ring-2 ring-yellow-400/30" 
    },
    "not-started": { 
      bg: "bg-gray-500", 
      glow: "",
      ring: "ring-2 ring-gray-500/30" 
    }
  }
  
  const { bg, glow, ring } = config[status]
  
  return (
    <div className={cn("w-4 h-4 rounded-full relative", bg, glow, ring)}>
      {status === "in-progress" && (
        <div className={cn("absolute inset-0 rounded-full animate-ping", bg, "opacity-75")} />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const config = {
    complete: { text: "Complete", bg: "bg-green-500/10", border: "border-green-500/20", color: "text-green-400" },
    "in-progress": { text: "In Progress", bg: "bg-blue-500/10", border: "border-blue-500/20", color: "text-blue-400" },
    pending: { text: "Planned", bg: "bg-yellow-500/10", border: "border-yellow-500/20", color: "text-yellow-400" },
    "not-started": { text: "Not Started", bg: "bg-gray-500/10", border: "border-gray-500/20", color: "text-gray-400" }
  }
  
  const { text, bg, border, color } = config[status]
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", bg, border, color)}>
      {text}
    </span>
  )
}

function TimelineItem({ item, index }: { item: RoadmapItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="relative pl-12 group">
      <div className="absolute left-2 top-2">
        <StatusDot status={item.status} />
      </div>

      <div 
        className={cn(
          "rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm",
          "hover:border-white/20 hover:from-white/10 transition-all duration-300",
          "group-hover:shadow-2xl group-hover:shadow-white/5"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left"
          aria-expanded={isExpanded}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-400 font-mono">{item.quarter}</p>
                <div className="flex items-center gap-3">
                  {item.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <LanguageIcon language={lang} />
                      <span className="text-xs text-gray-500 capitalize">
                        {lang === 'cpp' ? 'C++' : lang === 'typescript' ? 'TypeScript' : lang}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <svg 
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-6 pb-6 border-t border-white/10">
            <p className="text-gray-300 leading-relaxed pt-4">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/resure-vault" },
  { label: "Discord", href: "https://discord.gg/5z9gb4Kyxx" },
  { label: "X", href: "https://x.com/resure_" }
]
