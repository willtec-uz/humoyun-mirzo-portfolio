import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Humoyun Mirzo — Front-End Developer',
  description: 'Front-End Developer, Telegram Bot va Web sayt ishlab chiqish bo\'yicha mutaxassis',
  keywords: ['Humoyun Mirzo', 'Front-End Developer', 'Telegram Bot', 'Web sayt', 'Farg\'ona'],
  openGraph: {
    title: 'Humoyun Mirzo — Front-End Developer',
    description: 'Web sayt, Telegram bot va dizayn xizmatlari',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
