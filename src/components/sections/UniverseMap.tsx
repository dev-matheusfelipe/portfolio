import { useState } from 'react'
import { motion } from 'framer-motion'
import MotionWrapper from '../ui/MotionWrapper'
import { universeCards } from '../../data/portfolio'
import { routeEngine } from '../../engine/RouteEngine'

type UniverseMapProps = {
  reducedMotion: boolean
}

export default function UniverseMap({ reducedMotion }: UniverseMapProps) {
  const [activeCard, setActiveCard] = useState<string>('web')

  return (
    <section
      id="identidade"
      className="relative mt-6 overflow-hidden rounded-3xl border border-sky-400/30 bg-slate-900/70 p-4 shadow-glow sm:p-6 md:p-8"
      ref={(node) => routeEngine.registerNode('universe-root', node)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(97,206,247,0.14),transparent_33%),radial-gradient(circle_at_15%_90%,rgba(116,43,238,0.2),transparent_35%)]" />

      <div className="relative z-10 space-y-6">
        <MotionWrapper reducedMotion={reducedMotion} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">Minha Identidade</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Rizzer Logistics Universe</h2>
          <p className="max-w-2xl text-sm text-slate-200/75 sm:text-base">
            Rotas que conectam produtos reais, decisões de negócio e tecnologia aplicada.
          </p>
        </MotionWrapper>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-sky-300/25 bg-slate-950/35 p-3 sm:min-h-[500px] sm:p-6">
          <div className="relative z-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {universeCards.map((card, index) => {
              const isActive = activeCard === card.id

              return (
                <div ref={(node) => routeEngine.registerNode(`universe-${card.id}`, node)} key={card.id}>
                  <MotionWrapper reducedMotion={reducedMotion} delay={index * 0.05}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveCard(card.id)}
                      onFocus={() => setActiveCard(card.id)}
                      onClick={() => setActiveCard(card.id)}
                      className="group relative h-full overflow-hidden rounded-2xl border border-sky-300/30 bg-slate-900/78 p-4 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-cyan-300/65"
                      aria-pressed={isActive}
                    >
                      {isActive ? (
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
                          <rect x="1.4" y="1.4" width="97.2" height="97.2" rx="11" ry="11" fill="none" stroke="rgba(72, 209, 255, 0.28)" strokeWidth="1" />
                          <motion.rect
                            x="1.4"
                            y="1.4"
                            width="97.2"
                            height="97.2"
                            rx="11"
                            ry="11"
                            fill="none"
                            stroke="#8CF5FF"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            style={{ filter: 'drop-shadow(0 0 6px rgba(127, 244, 255, 0.9))', strokeDasharray: '18 16' }}
                            animate={!reducedMotion ? { strokeDashoffset: [0, -136] } : undefined}
                            transition={!reducedMotion ? { duration: 2.4, repeat: Infinity, ease: 'linear' } : undefined}
                          />
                        </svg>
                      ) : null}

                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200/85">Rota ativa</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-cyan-300" aria-hidden="true">
                          {card.icon}
                        </span>
                        <h3 className="font-display text-lg text-white">{card.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-200/75">{card.summary}</p>
                    </button>
                  </MotionWrapper>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
