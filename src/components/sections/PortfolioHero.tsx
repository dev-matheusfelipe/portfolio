import { useMemo } from 'react'
import { motion } from 'framer-motion'
import MotionWrapper from '../ui/MotionWrapper'
import RoutesSvgBackground from '../ui/RoutesSvgBackground'
import { heroNodes, heroRoutes, portfolioLinks } from '../../data/portfolio'
import { routeEngine } from '../../engine/RouteEngine'

type PortfolioHeroProps = {
  reducedMotion: boolean
}

export default function PortfolioHero({ reducedMotion }: PortfolioHeroProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, idx) => ({
        id: idx,
        left: ((idx * 43) % 100) + 0.25,
        top: ((idx * 27) % 100) + 0.25,
        delay: (idx % 6) * 0.4,
        duration: 4 + (idx % 5)
      })),
    []
  )

  return (
    <section id="inicio" className="relative overflow-hidden rounded-3xl border border-sky-400/30 bg-slate-900/75 p-4 shadow-glow sm:p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(78,191,245,0.24),transparent_38%),radial-gradient(circle_at_92%_9%,rgba(116,43,238,0.2),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-ops-grid [background-size:18px_18px] opacity-20" />

      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-sky-200/50"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: reducedMotion ? undefined : `floatDot ${particle.duration}s ease-in-out ${particle.delay}s infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div ref={(node) => routeEngine.registerNode('hero-main', node)}>
          <MotionWrapper reducedMotion={reducedMotion} y={22} className="space-y-3 sm:space-y-4">
          <p className="inline-flex rounded-full border border-sky-300/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100/90">
            RIZZER OPS DASHBOARD
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/85">
            Founder @ Rizzer Studio • Full-stack Engineer • IA & Logistics Systems
          </p>

          <h1 className="max-w-xl font-display text-[1.9rem] font-bold leading-[1.08] text-white sm:text-4xl lg:text-5xl">
            Eu sou Matheus Felipe. Construo produtos digitais com IA, rotas e obsessão por performance.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
            Conecto tecnologia, rotas e IA para produtos que se comportam como sistemas reais.
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-slate-300/80">
            Desenvolvedor full-stack focado em transformar ideias em software funcional, com experiência em Web, Mobile, Desktop e simulação logística.
          </p>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:gap-3">
            <motion.a
              href="#projetos"
              whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
              className="w-full rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto sm:py-2.5"
            >
              Explorar Projetos
            </motion.a>
            <motion.a
              href={portfolioLinks.rizzerStudio}
              target="_blank"
              rel="noreferrer"
              whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
              className="w-full rounded-full border border-sky-300/40 bg-slate-800/50 px-5 py-3 text-center text-sm font-semibold text-sky-100 transition hover:border-cyan-300/70 hover:bg-slate-700/60 sm:w-auto sm:py-2.5"
            >
              Abrir Rizzer Studio
            </motion.a>
          </div>

          <ul className="grid gap-1 pt-1 text-xs text-slate-200/78 sm:grid-cols-3 sm:text-sm">
            <li>• Multi-IA integrations</li>
            <li>• Produtos cross-platform</li>
            <li>• Simulações reais em tempo real</li>
          </ul>
          </MotionWrapper>
        </div>

        <div ref={(node) => routeEngine.registerNode('hero-network', node)} className="hidden sm:block">
          <MotionWrapper reducedMotion={reducedMotion} delay={0.08} className="relative h-[300px] rounded-2xl border border-sky-300/25 bg-slate-950/45 p-4 shadow-card lg:h-[330px]">
          <div className="pointer-events-none absolute inset-3 overflow-hidden rounded-2xl border border-sky-300/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_58%,rgba(97,206,247,0.12),transparent_48%)]" />
            {!reducedMotion ? (
              <motion.div
                className="absolute -left-1/3 top-0 h-full w-2/3 bg-[linear-gradient(115deg,transparent_18%,rgba(97,206,247,0.14)_50%,transparent_82%)] opacity-45 blur-md"
                animate={{ x: ['-12%', '136%'] }}
                transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
              />
            ) : null}
          </div>

          <div className="absolute inset-0 p-4">
            <RoutesSvgBackground nodes={heroNodes} routes={heroRoutes} reducedMotion={reducedMotion} showNodes drawOnView />
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.14em] text-sky-100/75 sm:text-xs">
            {heroNodes.map((node) => (
              <div key={node.id} className="rounded-full border border-sky-300/25 bg-slate-900/65 px-3 py-1.5 text-center">
                {node.label}
              </div>
            ))}
          </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  )
}
