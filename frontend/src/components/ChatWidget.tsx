'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Salom! 👋 Men Humoyun Mirzoning AI yordamchisiman. Web sayt, Telegram bot yoki dizayn bo'yicha savollaringizga javob berishga tayyorman." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
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
          body: JSON.stringify({ message: text, conversation_id: convId }),
        }
      )
      const data = await res.json()
      if (data.conversation_id) setConvId(data.conversation_id)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Xatolik yuz berdi.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Kechirasiz, xatolik yuz berdi.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-neon text-bg flex items-center justify-center shadow-[0_0_30px_rgba(0,245,160,0.4)] hover:shadow-[0_0_50px_rgba(0,245,160,0.6)] transition-all duration-300 hover:scale-110"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] md:w-[380px] h-[500px] glass rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-surface/50">
            <div className="w-9 h-9 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center">
              <Bot size={16} className="text-neon" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Humoyun AI</p>
              <p className="text-xs text-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-neon text-bg font-medium rounded-br-sm'
                    : 'bg-border text-text rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Savol yozing..."
              className="flex-1 bg-border text-text text-sm px-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-neon/50 placeholder:text-muted"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-neon text-bg flex items-center justify-center hover:bg-neon/90 disabled:opacity-40 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
