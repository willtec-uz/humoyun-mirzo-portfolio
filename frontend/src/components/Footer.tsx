export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display font-bold text-lg neon-text">HM.</p>
        <p className="text-xs text-muted font-mono">
          © {new Date().getFullYear()} Humoyun Mirzo. Barcha huquqlar himoyalangan.
        </p>
        <p className="text-xs text-muted font-mono">
          Made with <span className="text-neon">♥</span> in Farg'ona
        </p>
      </div>
    </footer>
  )
}
