import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { systemModules } from '../../data/portfolio'
import MotionWrapper from '../ui/MotionWrapper'
import { routeEngine } from '../../engine/RouteEngine'

type SystemModulesProps = {
  reducedMotion: boolean
}

export default function SystemModules({ reducedMotion }: SystemModulesProps) {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  const activeModule = useMemo(
    () => systemModules.find((moduleItem) => moduleItem.id === activeModuleId) ?? null,
    [activeModuleId]
  )

  useEffect(() => {
    if (!activeModuleId) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModuleId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeModuleId])

  return (
    <section
      id="modulos"
      className="relative mt-6 rounded-3xl border border-sky-400/30 bg-slate-900/70 p-4 shadow-glow sm:p-6 md:p-8"
      ref={(node) => routeEngine.registerNode('modules-root', node)}
    >
      <MotionWrapper reducedMotion={reducedMotion} className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">Arquitetura</p>
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Módulos que eu construo</h2>
      </MotionWrapper>

      <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {systemModules.map((moduleItem, index) => (
          <div key={moduleItem.id} ref={(node) => routeEngine.registerNode(`module-${moduleItem.id}`, node)}>
            <MotionWrapper reducedMotion={reducedMotion} delay={index * 0.06}>
              <button
                type="button"
                onClick={() => setActiveModuleId(moduleItem.id)}
                className="group h-full rounded-2xl border border-sky-300/30 bg-slate-800/70 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-300/75"
              >
                <span className="inline-flex text-xl text-cyan-300 transition group-hover:animate-icon-pulse" aria-hidden="true">
                  {moduleItem.icon}
                </span>
                <h3 className="mt-2 font-display text-lg text-white">{moduleItem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200/78">{moduleItem.statement}</p>
              </button>
            </MotionWrapper>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeModule ? (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/75 p-4 backdrop-blur-sm md:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={activeModule.title}
            onClick={() => setActiveModuleId(null)}
          >
            <motion.div
              initial={reducedMotion ? undefined : { y: 20, opacity: 0 }}
              animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
              exit={reducedMotion ? undefined : { y: 12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-sky-300/35 bg-slate-900 p-6 shadow-glow"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-sky-200/85">Como eu aplico</p>
              <h3 className="mt-2 font-display text-2xl text-white">{activeModule.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-200/80">{activeModule.details}</p>
              <button
                type="button"
                className="mt-6 rounded-full border border-sky-300/40 px-4 py-2 text-sm font-semibold text-sky-100 hover:border-cyan-300"
                onClick={() => setActiveModuleId(null)}
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
