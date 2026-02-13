import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { RouteEdge, RouteNode } from '../../data/portfolio'

type RoutesSvgBackgroundProps = {
  nodes: RouteNode[]
  routes: RouteEdge[]
  activeRouteIds?: string[]
  reducedMotion: boolean
  className?: string
  showNodes?: boolean
  drawOnView?: boolean
}

type Point = { x: number; y: number }

const resolveNode = (nodes: RouteNode[], id: string): Point | null => {
  const node = nodes.find((entry) => entry.id === id)
  if (!node) return null
  return { x: node.x, y: node.y }
}

const buildCurvedPath = (from: Point, to: Point, curvature: number): string => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const norm = Math.hypot(dx, dy) || 1
  const px = (-dy / norm) * curvature * 18
  const py = (dx / norm) * curvature * 18
  const cx = mx + px
  const cy = my + py
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}

export default function RoutesSvgBackground({
  nodes,
  routes,
  activeRouteIds = [],
  reducedMotion,
  className,
  showNodes = false,
  drawOnView = true
}: RoutesSvgBackgroundProps) {
  const map = useMemo(() => {
    return routes
      .map((route) => {
        const from = resolveNode(nodes, route.from)
        const to = resolveNode(nodes, route.to)
        if (!from || !to) return null
        return { ...route, d: buildCurvedPath(from, to, route.curvature) }
      })
      .filter(Boolean) as Array<RouteEdge & { d: string }>
  }, [nodes, routes])

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={clsx('h-full w-full overflow-visible', className)}>
      <defs>
        <filter id="route-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="route-neon" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.9" result="neonBlur" />
          <feMerge>
            <feMergeNode in="neonBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {map.map((route) => {
        const isActive = activeRouteIds.includes(route.id)
        const intensity = route.intensity ?? 1

        return (
          <g key={route.id}>
            <motion.path
              d={route.d}
              fill="none"
              stroke={route.color ?? '#4EBFF5'}
              strokeWidth={0.14 + intensity * 0.11}
              opacity={isActive ? 0.44 : 0.2}
              style={{ filter: isActive ? 'url(#route-glow)' : undefined }}
              initial={drawOnView && !reducedMotion ? { pathLength: 0, strokeDashoffset: 10 } : undefined}
              whileInView={drawOnView && !reducedMotion ? { pathLength: 1, strokeDashoffset: 0 } : undefined}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            {isActive && !reducedMotion ? (
              <motion.path
                d={route.d}
                fill="none"
                stroke={route.color ?? '#61CEF7'}
                strokeWidth={0.26 + intensity * 0.12}
                strokeLinecap="round"
                opacity={0.96}
                style={{ filter: 'url(#route-neon)', strokeDasharray: '1.2 2.8' }}
                animate={{ strokeDashoffset: [0, -18] }}
                transition={{
                  duration: 1.25 + (1 - Math.min(intensity, 1)) * 0.45,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            ) : null}

            {isActive ? (
              <motion.path
                d={route.d}
                fill="none"
                stroke="#DDF8FF"
                strokeWidth={0.08}
                strokeLinecap="round"
                opacity={0.8}
                style={{ strokeDasharray: '0.8 3.2' }}
                animate={!reducedMotion ? { strokeDashoffset: [0, -16] } : undefined}
                transition={!reducedMotion ? { duration: 1.05, repeat: Infinity, ease: 'linear' } : undefined}
              />
            ) : null}

          </g>
        )
      })}

      {showNodes
        ? nodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="1.15" fill={node.accent ?? '#1C88E1'} stroke="#CFDEFC" strokeWidth="0.16" />
              <circle cx={node.x} cy={node.y} r="1.8" fill="none" stroke={node.accent ?? '#61CEF7'} opacity="0.25" />
            </g>
          ))
        : null}
    </svg>
  )
}
