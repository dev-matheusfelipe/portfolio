import { useCallback } from 'react'

type Edge = { a: string; b: string }

class RouteEngine {
  private nodes = new Map<string, HTMLElement>()
  private edges: Edge[] = []
  private svg: SVGSVGElement | null = null
  private rafId: number | null = null
  private reducedMotion = false
  private isMounted = false
  private onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.stopLoop()
      return
    }
    this.onFrame()
    if (!this.reducedMotion && this.svg) this.startLoop()
  }

  registerNode(id: string, ref: HTMLElement | null) {
    if (!ref) {
      this.nodes.delete(id)
      return
    }
    this.nodes.set(id, ref)
  }

  connect(a: string, b: string) {
    const key = `${a}->${b}`
    if (this.edges.some((edge) => `${edge.a}->${edge.b}` === key)) return
    this.edges.push({ a, b })
  }

  clearConnections() {
    this.edges = []
  }

  setReducedMotion(value: boolean) {
    this.reducedMotion = value
  }

  render(canvas: SVGElement) {
    this.svg = canvas as SVGSVGElement
    if (!this.isMounted) {
      this.isMounted = true
      window.addEventListener('resize', this.onFrame)
      window.addEventListener('scroll', this.onFrame, { passive: true })
      document.addEventListener('visibilitychange', this.onVisibilityChange)
    }
    this.onFrame()
    if (!this.reducedMotion && document.visibilityState === 'visible') this.startLoop()
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.svg = null
    if (this.isMounted) {
      this.isMounted = false
      window.removeEventListener('resize', this.onFrame)
      window.removeEventListener('scroll', this.onFrame)
      document.removeEventListener('visibilitychange', this.onVisibilityChange)
    }
  }

  private startLoop() {
    if (this.rafId) return
    const tick = () => {
      this.onFrame()
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private stopLoop() {
    if (!this.rafId) return
    cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  private onFrame = () => {
    if (!this.svg) return
    if (this.reducedMotion) this.stopLoop()
    this.draw()
  }

  private draw() {
    if (!this.svg) return
    const svgRect = this.svg.getBoundingClientRect()

    const defs = `
      <defs>
        <filter id="route-engine-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.3" result="blur"></feGaussianBlur>
          <feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
        </filter>
      </defs>
    `

    const paths = this.edges
      .map((edge) => {
        const fromEl = this.nodes.get(edge.a)
        const toEl = this.nodes.get(edge.b)
        if (!fromEl || !toEl) return ''

        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()

        const fromVisible = fromRect.bottom >= 0 && fromRect.top <= window.innerHeight
        const toVisible = toRect.bottom >= 0 && toRect.top <= window.innerHeight
        if (!fromVisible && !toVisible) return ''

        const x1 = fromRect.left + fromRect.width / 2 - svgRect.left
        const y1 = fromRect.top + fromRect.height / 2 - svgRect.top
        const x2 = toRect.left + toRect.width / 2 - svgRect.left
        const y2 = toRect.top + toRect.height / 2 - svgRect.top

        const distance = Math.hypot(x2 - x1, y2 - y1)
        if (distance > 940) return ''

        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const dx = x2 - x1
        const dy = y2 - y1
        const norm = Math.hypot(dx, dy) || 1
        const cx = mx - (dy / norm) * 20
        const cy = my + (dx / norm) * 20
        const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`

        return `
          <g>
            <path d="${d}" fill="none" stroke="#4EBFF5" stroke-width="0.85" opacity="0.28" filter="url(#route-engine-glow)" stroke-dasharray="5 5" class="route-engine-line" />
            ${
              this.reducedMotion
                ? ''
                : `<circle r="1.7" fill="#61CEF7" opacity="0.52"><animateMotion dur="6.8s" repeatCount="indefinite" path="${d}" /></circle>`
            }
            <circle cx="${x1}" cy="${y1}" r="1.8" fill="#61CEF7" opacity="0.25" class="route-engine-pulse" />
            <circle cx="${x2}" cy="${y2}" r="1.8" fill="#61CEF7" opacity="0.25" class="route-engine-pulse" />
          </g>
        `
      })
      .join('')

    this.svg.innerHTML = `${defs}${paths}`
  }
}

export const routeEngine = new RouteEngine()

export function useRouteNode(id: string) {
  return useCallback((node: HTMLElement | null) => {
    routeEngine.registerNode(id, node)
  }, [id])
}
