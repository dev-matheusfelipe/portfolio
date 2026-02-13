export type IdeaType = 'ia' | 'game' | 'infra' | 'produto'

export type Idea = {
  id: string
  title: string
  type: IdeaType
  energy: number
  connections: string[]
}

export const ideas: Idea[] = [
  { id: 'core', title: 'Rizzer Core', type: 'produto', energy: 1, connections: ['logi-ai', 'fleet-sim', 'ops-cloud'] },
  { id: 'logi-ai', title: 'Logi AI Dispatch', type: 'ia', energy: 0.82, connections: ['route-twin', 'eta-predict'] },
  { id: 'fleet-sim', title: 'Fleet Simulation', type: 'game', energy: 0.78, connections: ['cargo-econ', 'driver-behavior'] },
  { id: 'ops-cloud', title: 'Ops Cloud', type: 'infra', energy: 0.7, connections: ['auth-fabric', 'events-bus'] },
  { id: 'route-twin', title: 'Route Twin', type: 'produto', energy: 0.66, connections: [] },
  { id: 'eta-predict', title: 'ETA Predictor', type: 'ia', energy: 0.74, connections: [] },
  { id: 'cargo-econ', title: 'Cargo Economy', type: 'game', energy: 0.8, connections: [] },
  { id: 'driver-behavior', title: 'Driver Behavior AI', type: 'ia', energy: 0.63, connections: [] },
  { id: 'auth-fabric', title: 'Auth Fabric', type: 'infra', energy: 0.56, connections: [] },
  { id: 'events-bus', title: 'Events Bus', type: 'infra', energy: 0.69, connections: [] },
  { id: 'ops-radar', title: 'Ops Radar UI', type: 'produto', energy: 0.62, connections: [] },
  { id: 'supply-game', title: 'Supply Chain Game', type: 'game', energy: 0.67, connections: [] }
]

export type IdeaNodeLayout = {
  id: string
  x: number
  y: number
}

export const ideaLayout: IdeaNodeLayout[] = [
  { id: 'core', x: 50, y: 28 },
  { id: 'logi-ai', x: 30, y: 42 },
  { id: 'fleet-sim', x: 50, y: 46 },
  { id: 'ops-cloud', x: 70, y: 42 },
  { id: 'route-twin', x: 18, y: 62 },
  { id: 'eta-predict', x: 34, y: 68 },
  { id: 'cargo-econ', x: 46, y: 72 },
  { id: 'driver-behavior', x: 58, y: 70 },
  { id: 'auth-fabric', x: 70, y: 66 },
  { id: 'events-bus', x: 82, y: 62 },
  { id: 'ops-radar', x: 24, y: 84 },
  { id: 'supply-game', x: 78, y: 84 }
]

export const getIdea = (id: string) => ideas.find((idea) => idea.id === id)

export const getIdeaTypeColor = (type: IdeaType) => {
  if (type === 'ia') return '#61CEF7'
  if (type === 'game') return '#742BEE'
  if (type === 'infra') return '#4EBFF5'
  return '#B1CAF3'
}
