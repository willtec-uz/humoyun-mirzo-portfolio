import type { Skill } from '@/lib/supabase'

const categoryLabel: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Toollar',
  languages: 'Tillar',
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 reveal">
          <span className="font-mono text-neon text-sm mb-3 block">// ko'nikmalar</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">
            Texnik <span className="neon-text">bilimlar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="reveal">
              <h3 className="font-mono text-sm text-accent mb-5">{categoryLabel[cat] ?? cat}</h3>
              <div className="flex flex-col gap-4">
                {items.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text font-medium">{s.name}</span>
                      <span className="text-xs font-mono text-muted">{s.level}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
