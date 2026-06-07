'use client'
import { useEffect, useState } from 'react'
import { ArrowDown, Github, Send } from 'lucide-react'
import type { Profile } from '@/lib/supabase'

const roles = ['Front-End Developer', 'Telegram Bot Developer', 'UI/UX Designer', 'IT Teacher']

export default function Hero({ profile }: { profile: Profile | null }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((roleIndex + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-neon/5 mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span className="text-neon text-sm font-mono">
            {profile?.is_available_for_work ? 'Buyurtmalar qabul qilinmoqda' : 'Hozircha band'}
          </span>
        </div>

        {/* Name */}
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-none mb-4" style={{ animationDelay: '0.1s' }}>
          <span className="text-text">Humoyun</span>{' '}
          <span className="neon-text">Mirzo</span>
        </h1>

        {/* Typing role */}
        <div className="font-mono text-xl md:text-2xl text-muted mb-6 h-8 flex items-center justify-center gap-1">
          <span className="text-accent">&gt;</span>
          <span>{displayed}</span>
          <span className="w-0.5 h-5 bg-neon animate-typing" />
        </div>

        {/* Bio */}
        <p className="text-muted max-w-xl mx-auto mb-10 leading-relaxed text-base md:text-lg">
          {profile?.bio ?? "IT sohasida faol ishlaydigan yosh mutaxassis. Web sayt, Telegram bot va dizayn bo'yicha xizmatlar ko'rsataman."}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a href="#projects"
            className="px-6 py-3 bg-neon text-bg font-semibold rounded-lg hover:bg-neon/90 transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,245,160,0.4)] flex items-center gap-2">
            Loyihalarni ko'rish
            <ArrowDown size={16} />
          </a>
          <a href={`https://t.me/${profile?.telegram_username ?? 'humoyun'}`} target="_blank"
            className="px-6 py-3 border border-border text-text rounded-lg hover:border-neon/50 hover:text-neon transition-all duration-200 flex items-center gap-2">
            <Send size={16} />
            Telegram
          </a>
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank"
              className="px-6 py-3 border border-border text-text rounded-lg hover:border-neon/50 hover:text-neon transition-all duration-200 flex items-center gap-2">
              <Github size={16} />
              GitHub
            </a>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 text-muted animate-float">
          <span className="text-xs font-mono">scroll</span>
          <ArrowDown size={14} />
        </div>
      </div>
    </section>
  )
}
