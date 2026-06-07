import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/lib/supabase'

const categoryLabel: Record<string, string> = {
  web: 'Web',
  bot: 'Telegram Bot',
  design: 'Dizayn',
  other: 'Boshqa',
}

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter(p => p.is_featured)
  const rest = projects.filter(p => !p.is_featured)

  return (
    <section id="projects" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 reveal">
          <span className="font-mono text-neon text-sm mb-3 block">// loyihalar</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">
            Qilgan <span className="neon-text">ishlarim</span>
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted font-mono">
            // Loyihalar tez orada qo'shiladi...
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {featured.map((p, i) => (
                  <ProjectCard key={p.id} project={p} large={i === 0} />
                ))}
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rest.map(p => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project: p, large }: { project: Project; large?: boolean }) {
  return (
    <div className={`glass rounded-2xl overflow-hidden reveal group hover:border-neon/30 transition-all duration-300 border border-border ${large ? 'md:col-span-1' : ''}`}>
      {p.thumbnail_url && (
        <div className="h-48 overflow-hidden">
          <img src={p.thumbnail_url} alt={p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 rounded-full bg-neon/10 text-neon text-xs font-mono border border-neon/20">
            {categoryLabel[p.category] ?? p.category}
          </span>
          {p.completed_at && (
            <span className="text-xs text-muted font-mono">
              {new Date(p.completed_at).getFullYear()}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-lg text-text mb-2 group-hover:text-neon transition-colors">
          {p.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4">{p.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {p.technologies?.slice(0, 4).map(tech => (
            <span key={tech} className="px-2 py-1 rounded bg-border text-xs font-mono text-muted">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {p.demo_url && (
            <a href={p.demo_url} target="_blank"
              className="flex items-center gap-1 text-xs text-neon hover:underline">
              <ExternalLink size={12} /> Demo
            </a>
          )}
          {p.github_url && (
            <a href={p.github_url} target="_blank"
              className="flex items-center gap-1 text-xs text-muted hover:text-text">
              <Github size={12} /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
