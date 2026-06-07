'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#home', label: 'Bosh sahifa' },
  { href: '#services', label: 'Xizmatlar' },
  { href: '#projects', label: 'Loyihalar' },
  { href: '#skills', label: "Ko'nikmalar" },
  { href: '#contact', label: "Bog'lanish" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-border' : ''}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="font-display font-bold text-lg neon-text tracking-tight">
          HM<span className="text-text">.</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-muted hover:text-neon transition-colors duration-200 font-body">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neon text-neon text-sm font-medium hover:bg-neon hover:text-bg transition-all duration-200">
          Xizmat olish
        </a>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-text">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-b border-border px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-muted hover:text-neon transition-colors text-sm">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
