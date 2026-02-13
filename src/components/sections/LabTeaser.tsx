import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MotionWrapper from '../ui/MotionWrapper'
import { getIdea, getIdeaTypeColor, ideas } from '../../lab/IdeaGraph'
import { portfolioLinks } from '../../data/portfolio'
import { routeEngine } from '../../engine/RouteEngine'

type LabTeaserProps = {
  reducedMotion: boolean
}

type TreeNode = {
  id: string
  x: number
  y: number
  parent?: string
  label?: string
  isCategory?: boolean
}

const treeNodes: TreeNode[] = [
  { id: 'core', x: 50, y: 22, label: 'Core' },
  { id: 'ia', x: 27, y: 42, parent: 'core', label: 'IA', isCategory: true },
  { id: 'game', x: 50, y: 46, parent: 'core', label: 'Games', isCategory: true },
  { id: 'infra', x: 73, y: 42, parent: 'core', label: 'Infra', isCategory: true },
  { id: 'logi-ai', x: 19, y: 68, parent: 'ia' },
  { id: 'route-twin', x: 33, y: 72, parent: 'ia' },
  { id: 'fleet-sim', x: 42, y: 74, parent: 'game' },
  { id: 'cargo-econ', x: 58, y: 74, parent: 'game' },
  { id: 'ops-cloud', x: 67, y: 72, parent: 'infra' },
  { id: 'events-bus', x: 81, y: 68, parent: 'infra' }
]

const findNode = (id: string) => treeNodes.find((node) => node.id === id)

const buildPathToRoot = (id: string): string[] => {
  const path: string[] = []
  let cursor = findNode(id)
  while (cursor?.parent) {
    path.push(`${cursor.parent}->${cursor.id}`)
    cursor = findNode(cursor.parent)
  }
  return path
}

export default function LabTeaser({ reducedMotion }: LabTeaserProps) {
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null)

  const activeIdea = activeIdeaId ? getIdea(activeIdeaId) : null
  const activePath = useMemo(() => (activeIdeaId ? buildPathToRoot(activeIdeaId) : []), [activeIdeaId])

  return (
    <section id="lab" className="relative mt-6 overflow-hidden rounded-3xl border border-sky-400/30 bg-slate-900/70 p-4 shadow-glow sm:p-6 md:p-8" ref={(node) => routeEngine.registerNode('lab-root', node)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(97,206,247,0.2),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(116,43,238,0.18),transparent_38%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <MotionWrapper reducedMotion={reducedMotion} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/85">Lab Teaser</p>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Árvore de ideias interativa</h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
            Visualize e interaja com meu mapa vivo de ideias, rotas conectando produtos, testes e experimentos.
          </p>
          <p className="text-sm font-semibold text-cyan-300">{ideas.length} ideias em incubação</p>
          <motion.a
            href={portfolioLinks.lab}
            target="_blank"
            rel="noreferrer"
            whileHover={reducedMotion ? undefined : { scale: 1.02, y: -1 }}
            className="inline-flex w-full justify-center rounded-full bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto sm:justify-start sm:py-2.5"
          >
            Abrir Lab →
          </motion.a>
        </MotionWrapper>

        <MotionWrapper reducedMotion={reducedMotion} delay={0.1} className="relative h-[300px] overflow-hidden rounded-2xl border border-sky-300/30 bg-slate-950/50 p-4 sm:h-[360px]">
          <div className="absolute inset-0 bg-ops-grid [background-size:20px_20px] opacity-25" />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-label="Árvore de ideias">
            <path d="M 50 94 Q 49.5 80 50 58" fill="none" stroke="#4EBFF5" strokeWidth="1.8" opacity="0.56" />

            {treeNodes
              .filter((node) => node.parent)
              .map((node) => {
                const parent = findNode(node.parent!)
                if (!parent) return null
                const key = `${node.parent}->${node.id}`
                const isActive = activePath.includes(key)
                const ctrlX = (parent.x + node.x) / 2
                const ctrlY = (parent.y + node.y) / 2 - (node.x < parent.x ? 2 : -2)

                return (
                  <path
                    key={key}
                    d={`M ${parent.x} ${parent.y} Q ${ctrlX} ${ctrlY} ${node.x} ${node.y}`}
                    fill="none"
                    stroke="#61CEF7"
                    strokeWidth={parent.id === 'core' ? (isActive ? 1.35 : 1.05) : isActive ? 1.12 : 0.7}
                    opacity={isActive ? 0.95 : parent.id === 'core' ? 0.6 : 0.45}
                    className={!reducedMotion && isActive ? 'route-dash' : undefined}
                  />
                )
              })}

            {treeNodes.map((node) => {
              const idea = getIdea(node.id)
              const color = idea ? getIdeaTypeColor(idea.type) : node.isCategory ? '#61CEF7' : '#4EBFF5'
              const isActive = activeIdeaId === node.id

              return (
                <g key={node.id} onMouseEnter={() => setActiveIdeaId(node.id)} onMouseLeave={() => setActiveIdeaId(null)}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.id === 'core' ? 2.4 : node.isCategory ? 2.1 : isActive ? 2.4 : 1.9}
                    fill={color}
                    opacity={node.id === 'core' ? 0.95 : 0.82}
                    className="cursor-pointer"
                    onClick={() => setActiveIdeaId(node.id)}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.id === 'core' ? 4.8 : node.isCategory ? 4 : 3.5}
                    fill="none"
                    stroke={color}
                    opacity={isActive || node.id === 'core' ? 0.45 : 0.22}
                  />
                  {node.label ? (
                    <text x={node.x + 2.5} y={node.y - 2} fill="#B1CAF3" fontSize="2.8" opacity="0.9" letterSpacing="0.15">
                      {node.label}
                    </text>
                  ) : null}
                </g>
              )
            })}
          </svg>

          <div className="absolute bottom-3 left-3 rounded-lg border border-sky-300/30 bg-slate-900/80 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-sky-100/75" ref={(node) => routeEngine.registerNode('lab-core', node)}>
            tronco central
          </div>
          <div className="absolute bottom-3 right-3 rounded-lg border border-sky-300/30 bg-slate-900/80 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-sky-100/75" ref={(node) => routeEngine.registerNode('lab-ops-radar', node)}>
            ideias conectadas
          </div>
        </MotionWrapper>
      </div>

      <AnimatePresence>
        {activeIdea ? (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm md:items-center"
            onClick={() => setActiveIdeaId(null)}
          >
            <motion.div
              initial={reducedMotion ? undefined : { y: 22, opacity: 0 }}
              animate={reducedMotion ? undefined : { y: 0, opacity: 1 }}
              exit={reducedMotion ? undefined : { y: 18, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-sky-300/35 bg-slate-900 p-6 shadow-glow"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-sky-200/85">Idea Entity</p>
              <h3 className="mt-2 font-display text-2xl text-white">{activeIdea.title}</h3>
              <p className="mt-2 text-sm text-slate-200/80">Tipo: {activeIdea.type.toUpperCase()} • Energia: {Math.round(activeIdea.energy * 100)}%</p>
              <p className="mt-4 text-sm text-slate-200/80">Conexões:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200/80">
                {activeIdea.connections.length ? activeIdea.connections.map((id) => <li key={id}>{getIdea(id)?.title ?? id}</li>) : <li>Sem conexões diretas</li>}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
