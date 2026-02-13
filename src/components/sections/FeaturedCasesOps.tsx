import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { featuredProjects } from '../../data/portfolio'
import MotionWrapper from '../ui/MotionWrapper'
import ProgressRadial from '../ui/ProgressRadial'
import MicroBadge from '../ui/MicroBadge'
import { routeEngine } from '../../engine/RouteEngine'

type FeaturedCasesOpsProps = {
  reducedMotion: boolean
}

const formatLocalMonth = (isoDate: string): string => {
  const parsed = new Date(isoDate)
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(parsed)
}

export default function FeaturedCasesOps({ reducedMotion }: FeaturedCasesOpsProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const activeProject = featuredProjects.find((project) => project.id === activeProjectId) ?? null

  useEffect(() => {
    if (!activeProjectId) return

    const currentOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProjectId(null)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = currentOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeProjectId])

  return (
    <section id="projetos" className="relative mt-6 overflow-hidden rounded-3xl border border-sky-400/30 bg-slate-900/70 p-4 shadow-glow sm:p-6 md:p-8">
      <div className="relative z-10" ref={(node) => routeEngine.registerNode('cases-root', node)}>
        <MotionWrapper reducedMotion={reducedMotion} className="mb-6 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">Painéis de Operação</p>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Cases em destaque</h2>
          </div>
          <a href="#lab" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
            Ver todos
          </a>
        </MotionWrapper>

        <div className="relative z-10 grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <MotionWrapper reducedMotion={reducedMotion} key={project.id} delay={index * 0.06}>
              <article
                ref={(node) => routeEngine.registerNode(`case-${project.id}`, node)}
                className="group rounded-2xl border border-sky-300/30 bg-slate-800/72 p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-300">{project.status}</p>
                  <span className="rounded-full border border-sky-300/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-sky-100">
                    OPS
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200/80">{project.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.badges.map((badge) => (
                    <MicroBadge key={badge.label} label={badge.label} hint={badge.hint} reducedMotion={reducedMotion} />
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-[auto_1fr] gap-3 rounded-xl bg-slate-900/40 p-2.5">
                  <ProgressRadial value={project.progress} reducedMotion={reducedMotion} />
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-slate-900/55 p-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-300">Módulos</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-300">{project.kpis.modulos}</p>
                    </div>
                    <div className="rounded-lg bg-slate-900/55 p-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-300">Plataforma</p>
                      <p className="mt-1 text-xs font-semibold text-cyan-300">{project.kpis.plataforma}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setActiveProjectId(project.id)}
                    className="w-full rounded-full border border-sky-300/35 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:border-cyan-300 hover:text-cyan-200 sm:w-auto"
                  >
                    Ver detalhes
                  </button>
                  <small className="text-xs text-slate-300/85">Última atualização: {formatLocalMonth(project.updatedAt)}</small>
                </div>
              </article>
            </MotionWrapper>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject ? (
          <motion.aside
            initial={reducedMotion ? undefined : { x: 380, opacity: 0 }}
            animate={reducedMotion ? undefined : { x: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { x: 380, opacity: 0 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-sky-300/30 bg-slate-950/95 p-6 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do projeto ${activeProject.title}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-white">{activeProject.title}</h3>
              <button onClick={() => setActiveProjectId(null)} className="rounded-full border border-sky-300/35 px-3 py-1 text-xs">
                Fechar
              </button>
            </div>
            <p className="text-sm text-slate-200/80">{activeProject.system.architecture}</p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-sky-200/75">Stack / módulos</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200/80">
                  {activeProject.system.modules.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-sky-200/75">Roadmap</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200/80">
                  {activeProject.system.roadmap.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
