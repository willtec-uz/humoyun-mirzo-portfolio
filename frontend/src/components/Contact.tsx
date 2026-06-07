'use client'
import { useState } from 'react'
import { Send, Mail, MapPin, Github } from 'lucide-react'
import type { Profile } from '@/lib/supabase'

export default function Contact({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: `Yangi murojaat!\nIsm: ${form.name}\nEmail: ${form.email}\nXabar: ${form.message}`,
            user_info: { name: form.name, email: form.email },
          }),
        }
      )
      if (res.ok) {
        setSent(true)
        setForm({ name: '', email: '', message: '' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 reveal">
          <span className="font-mono text-neon text-sm mb-3 block">// bog'lanish</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">
            Loyiha <span className="neon-text">boshlaylik</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="reveal">
            <p className="text-muted leading-relaxed mb-8">
              Yangi loyiha, savol yoki hamkorlik bo'yicha murojaat qilishingiz mumkin. 24 soat ichida javob beraman.
            </p>
            <div className="flex flex-col gap-5">
              {profile?.telegram_username && (
                <a href={`https://t.me/${profile.telegram_username}`} target="_blank"
                  className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                    <Send size={16} className="text-neon" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Telegram</p>
                    <p className="text-text text-sm font-medium">@{profile.telegram_username}</p>
                  </div>
                </a>
              )}
              {profile?.email && (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Mail size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Email</p>
                    <p className="text-text text-sm font-medium">{profile.email}</p>
                  </div>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-border flex items-center justify-center">
                    <MapPin size={16} className="text-muted" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Joylashuv</p>
                    <p className="text-text text-sm font-medium">{profile.location}</p>
                  </div>
                </div>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-border flex items-center justify-center group-hover:bg-border/80 transition-colors">
                    <Github size={16} className="text-muted group-hover:text-text" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">GitHub</p>
                    <p className="text-text text-sm font-medium">willtec-uz</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            {sent ? (
              <div className="glass rounded-2xl p-8 text-center border border-neon/30">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-display font-bold text-xl text-neon mb-2">Xabar yuborildi!</h3>
                <p className="text-muted text-sm">Tez orada javob beraman.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 flex flex-col gap-5">
                <div>
                  <label className="text-xs text-muted font-mono mb-2 block">Ismingiz *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Humoyun" required
                    className="w-full bg-border text-text px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-neon/50 placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono mb-2 block">Email</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com" type="email"
                    className="w-full bg-border text-text px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-neon/50 placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="text-xs text-muted font-mono mb-2 block">Xabar *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Loyiha haqida qisqacha yozing..." required rows={4}
                    className="w-full bg-border text-text px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-neon/50 placeholder:text-muted/50 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-neon text-bg font-semibold rounded-xl hover:bg-neon/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                  {loading ? 'Yuborilmoqda...' : (
                    <><Send size={16} /> Yuborish</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
