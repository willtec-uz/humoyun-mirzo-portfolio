import type { Service } from '@/lib/supabase'

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 reveal">
          <span className="font-mono text-neon text-sm mb-3 block">// xizmatlar</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">
            Nima qila <span className="neon-text">olaman?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <div key={s.id} className="glass rounded-2xl p-8 reveal gradient-border group hover:bg-surface/50 transition-all duration-300"
              style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-5">{s.icon}</div>
              <h3 className="font-display font-bold text-xl text-text mb-3 group-hover:text-neon transition-colors">
                {s.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-5">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.technologies?.map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-border text-xs font-mono text-muted border border-border/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
