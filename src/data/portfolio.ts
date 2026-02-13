export type PortfolioLinkKey = 'instagram' | 'github' | 'linkedin' | 'rizzerStudio' | 'lab'

export type RouteNode = {
  id: string
  label: string
  x: number
  y: number
  accent?: string
}

export type RouteEdge = {
  id: string
  from: string
  to: string
  curvature: number
  intensity?: number
  color?: string
}

export type ProjectOps = {
  id: string
  title: string
  tagline: string
  status: 'Em desenvolvimento' | 'Levantamento de requisitos' | 'Estável'
  updatedAt: string
  badges: Array<{ label: string; hint: string }>
  progress: number
  kpis: {
    modulos: number
    plataforma: string
  }
  system: {
    architecture: string
    modules: string[]
    roadmap: string[]
  }
  href: string
}

export type SystemModule = {
  id: string
  title: string
  statement: string
  details: string
  icon: string
}

export const portfolioLinks: Record<PortfolioLinkKey, string> = {
  instagram: 'https://www.instagram.com/m.f_matheusfelipe',
  github: 'https://github.com/dev-matheusfelipe',
  linkedin: 'https://www.linkedin.com/in/dev-matheusfelipe',
  rizzerStudio: 'https://rizzer-studio-site.vercel.app/',
  lab: 'https://rizzer-studio-site.vercel.app/lab'
}

export const heroNodes: RouteNode[] = [
  { id: 'projetos', label: 'Projetos', x: 12, y: 20, accent: '#61CEF7' },
  { id: 'skills', label: 'Módulos', x: 82, y: 22, accent: '#4EBFF5' },
  { id: 'lab', label: 'Lab', x: 18, y: 80, accent: '#742BEE' },
  { id: 'contato', label: 'Contato', x: 84, y: 78, accent: '#B1CAF3' }
]

export const heroRoutes: RouteEdge[] = [
  { id: 'h-1', from: 'projetos', to: 'skills', curvature: 0.25, intensity: 0.9 },
  { id: 'h-2', from: 'projetos', to: 'lab', curvature: -0.2, intensity: 0.8 },
  { id: 'h-3', from: 'skills', to: 'contato', curvature: 0.22, intensity: 1 },
  { id: 'h-4', from: 'lab', to: 'contato', curvature: -0.18, intensity: 0.95 },
  { id: 'h-5', from: 'skills', to: 'lab', curvature: -0.35, intensity: 0.8 }
]

export const universeNodes: RouteNode[] = [
  { id: 'web', label: 'Web', x: 8, y: 16 },
  { id: 'mobile', label: 'Mobile', x: 26, y: 58 },
  { id: 'desktop', label: 'Desktop', x: 56, y: 20 },
  { id: 'ia', label: 'IA', x: 84, y: 16 },
  { id: 'games', label: 'Games/Simulação', x: 72, y: 76 },
  { id: 'infra', label: 'Infra/APIs', x: 16, y: 84 }
]

export const universeRoutes: RouteEdge[] = [
  { id: 'u-web-mobile', from: 'web', to: 'mobile', curvature: 0.24, intensity: 1 },
  { id: 'u-web-desktop', from: 'web', to: 'desktop', curvature: -0.2, intensity: 0.85 },
  { id: 'u-mobile-infra', from: 'mobile', to: 'infra', curvature: 0.12, intensity: 0.9 },
  { id: 'u-desktop-ia', from: 'desktop', to: 'ia', curvature: -0.1, intensity: 0.95 },
  { id: 'u-ia-games', from: 'ia', to: 'games', curvature: 0.2, intensity: 0.88 },
  { id: 'u-games-infra', from: 'games', to: 'infra', curvature: -0.28, intensity: 0.93 }
]

export const universeCards = [
  {
    id: 'web',
    title: 'Web',
    icon: '◫',
    summary: 'Plataformas com navegação rápida e foco em conversão.',
    routeIds: ['u-web-mobile', 'u-web-desktop']
  },
  {
    id: 'mobile',
    title: 'Mobile',
    icon: '◧',
    summary: 'Experiências contínuas e fluídas em dispositivos reais.',
    routeIds: ['u-web-mobile', 'u-mobile-infra']
  },
  {
    id: 'desktop',
    title: 'Desktop',
    icon: '◩',
    summary: 'Utilitários com performance real para carga e produtividade.',
    routeIds: ['u-web-desktop', 'u-desktop-ia']
  },
  {
    id: 'ia',
    title: 'IA',
    icon: '✦',
    summary: 'Automação inteligente com múltiplos provedores integrados.',
    routeIds: ['u-desktop-ia', 'u-ia-games']
  },
  {
    id: 'games',
    title: 'Games/Simulação',
    icon: '◈',
    summary: 'Sistemas de decisão, economia e progressão em cenários vivos.',
    routeIds: ['u-ia-games', 'u-games-infra']
  },
  {
    id: 'infra',
    title: 'Infra/APIs',
    icon: '⟡',
    summary: 'Camadas de dados e serviços para escala e confiabilidade.',
    routeIds: ['u-mobile-infra', 'u-games-infra']
  }
] as const

export const featuredProjects: ProjectOps[] = [
  {
    id: 'cargo-empire',
    title: 'Cargo Empire',
    tagline: 'Operação de frota com economia simulada e decisões em tempo real.',
    status: 'Em desenvolvimento',
    updatedAt: '2026-02-10',
    badges: [
      { label: 'React', hint: 'Interface operacional responsiva' },
      { label: 'Vite', hint: 'Build rápido para ciclos curtos' },
      { label: 'Simulation', hint: 'Regras de economia e progressão' },
      { label: 'IndexedDB', hint: 'Persistência local de sessão' }
    ],
    progress: 62,
    kpis: { modulos: 11, plataforma: 'Web + Desktop' },
    system: {
      architecture: 'Frontend orientado a eventos + simulação econômica de frota.',
      modules: ['Gestão de frota', 'Motor econômico', 'Mapa de rotas', 'Painel operacional'],
      roadmap: ['Telemetria em tempo real', 'Modo campanha', 'Integração com IA de despacho']
    },
    href: '#'
  },
  {
    id: 'bus-manager',
    title: 'Bus Manager',
    tagline: 'Gestão de linhas urbanas orientada por eficiência operacional.',
    status: 'Levantamento de requisitos',
    updatedAt: '2026-01-15',
    badges: [
      { label: 'TypeScript', hint: 'Domínio modelado com segurança de tipos' },
      { label: 'APIs', hint: 'Integração com serviços de operação urbana' },
      { label: 'Planning', hint: 'Mapeamento de fluxos críticos' }
    ],
    progress: 28,
    kpis: { modulos: 7, plataforma: 'Web SaaS' },
    system: {
      architecture: 'Camada de planejamento + API de linhas + dashboard de operação.',
      modules: ['Cadastro de linhas', 'Escalonamento', 'Acompanhamento de incidentes'],
      roadmap: ['Simulador de demanda', 'Sugestões de rota com IA']
    },
    href: '#'
  },
  {
    id: 'chat-ia',
    title: 'Chat IA',
    tagline: 'Plataforma multi-provider com memória local e experiência contínua.',
    status: 'Em desenvolvimento',
    updatedAt: '2026-02-08',
    badges: [
      { label: 'React Native', hint: 'Experiência mobile nativa' },
      { label: 'OpenAI', hint: 'Modelos de linguagem para respostas dinâmicas' },
      { label: 'Ollama', hint: 'Execução local para privacidade e custo' },
      { label: 'SSE', hint: 'Streaming de resposta em tempo real' }
    ],
    progress: 54,
    kpis: { modulos: 9, plataforma: 'Mobile' },
    system: {
      architecture: 'Provider adapters + camada de memória + stream de respostas.',
      modules: ['Múltiplos providers', 'Memória local', 'Streaming SSE'],
      roadmap: ['Memória contextual longa', 'Modo offline-first']
    },
    href: '#'
  },
  {
    id: 'rizzer-music-download',
    title: 'Rizzer Music Download',
    tagline: 'Downloader desktop com foco em velocidade, organização e estabilidade.',
    status: 'Estável',
    updatedAt: '2026-02-04',
    badges: [
      { label: '.NET', hint: 'Camada de aplicação desktop' },
      { label: 'WPF', hint: 'Interface com fluxo operacional claro' },
      { label: 'C#', hint: 'Lógica robusta de processamento' }
    ],
    progress: 100,
    kpis: { modulos: 13, plataforma: 'Desktop' },
    system: {
      architecture: 'Pipeline de download + fila de processamento + UI desktop.',
      modules: ['Fila inteligente', 'Conversão', 'Histórico'],
      roadmap: ['Sincronização cloud opcional', 'Perfis avançados de qualidade']
    },
    href: '#'
  }
]

export const projectNetworkNodes: RouteNode[] = [
  { id: 'react-native', label: 'React-Native', x: 6, y: 10 },
  { id: 'indexeddb', label: 'IndexedDB', x: 48, y: 8 },
  { id: 'wpf', label: 'WPF', x: 92, y: 10 },
  { id: 'cargo-empire', label: 'Cargo Empire', x: 16, y: 32 },
  { id: 'bus-manager', label: 'Bus Manager', x: 76, y: 32 },
  { id: 'chat-ia', label: 'Chat IA', x: 20, y: 82 },
  { id: 'rizzer-music-download', label: 'Rizzer Music', x: 80, y: 82 }
]

export const projectNetworkRoutes: RouteEdge[] = [
  { id: 't-react-native-cargo', from: 'react-native', to: 'cargo-empire', curvature: 0.2, intensity: 0.95 },
  { id: 't-indexeddb-chat', from: 'indexeddb', to: 'chat-ia', curvature: -0.2, intensity: 0.95 },
  { id: 't-wpf-music', from: 'wpf', to: 'rizzer-music-download', curvature: -0.18, intensity: 0.95 },
  { id: 'p-core-1', from: 'cargo-empire', to: 'bus-manager', curvature: 0.18, intensity: 0.8 },
  { id: 'p-core-2', from: 'cargo-empire', to: 'chat-ia', curvature: -0.16, intensity: 0.85 },
  { id: 'p-core-3', from: 'bus-manager', to: 'rizzer-music-download', curvature: 0.2, intensity: 0.9 },
  { id: 'p-core-4', from: 'chat-ia', to: 'rizzer-music-download', curvature: -0.22, intensity: 0.9 }
]

export const systemModules: SystemModule[] = [
  {
    id: 'ui-systems',
    title: 'UI Systems',
    statement: 'Design system acessível para interfaces coerentes e reutilizáveis.',
    details: 'Padronizo tokens, estados e componentes para acelerar entrega sem sacrificar consistência.',
    icon: '◈'
  },
  {
    id: 'data-persistence',
    title: 'Data & Persistence',
    statement: 'Persistência local avançada para experiência offline first.',
    details: 'Estruturo armazenamento local com sincronização progressiva para continuidade de uso.',
    icon: '⬢'
  },
  {
    id: 'realtime-streaming',
    title: 'Realtime/Streaming',
    statement: 'Atualizações em tempo real com SSE para respostas imediatas.',
    details: 'Fluxos em streaming para dashboards e chats com latência percebida menor.',
    icon: '◌'
  },
  {
    id: 'auth-accounts',
    title: 'Auth & Accounts',
    statement: 'Gestão segura de usuários e sessões com JWT.',
    details: 'Arquiteto autenticação, autorização e controle de sessão com rastreabilidade.',
    icon: '⟐'
  },
  {
    id: 'provider-adapters',
    title: 'Provider Adapters',
    statement: 'Camada única para integrar múltiplos provedores de IA.',
    details: 'Padronizo contratos para trocar providers sem reescrever o produto inteiro.',
    icon: '✦'
  },
  {
    id: 'game-simulation',
    title: 'Game Logic/Simulation',
    statement: 'Arquiteturas de simulação para economia e decisões em tempo real.',
    details: 'Modelo regras complexas com previsibilidade para produtos de logística e jogos.',
    icon: '⬡'
  }
]

export const globalRouteConnections: Array<[string, string]> = [
  ['ops-header', 'hero-main'],
  ['hero-main', 'hero-network'],
  ['hero-network', 'universe-root'],
  ['universe-root', 'modules-root'],
  ['modules-root', 'module-provider-adapters'],
  ['module-provider-adapters', 'lab-core'],
  ['module-ui-systems', 'lab-ops-radar'],
  ['lab-core', 'contact-root']
]
