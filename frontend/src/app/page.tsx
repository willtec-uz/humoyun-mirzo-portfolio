import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import ScrollReveal from '@/components/ScrollReveal'

export const revalidate = 60 // ISR: har 60 soniyada qayta fetch

async function getData() {
  const [{ data: profile }, { data: services }, { data: projects }, { data: skills }] =
    await Promise.all([
      supabase.from('owner_profile').select('*').single(),
      supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('projects').select('*').eq('is_visible', true).order('sort_order'),
      supabase.from('skills').select('*').eq('is_visible', true).order('sort_order'),
    ])
  return { profile, services: services ?? [], projects: projects ?? [], skills: skills ?? [] }
}

export default async function Home() {
  const { profile, services, projects, skills } = await getData()

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <Services services={services} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact profile={profile} />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollReveal />
    </>
  )
}
