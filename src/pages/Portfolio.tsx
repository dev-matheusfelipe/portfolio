import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { portfolioLinks } from '../data/portfolio'

type ThemeMode = 'dark' | 'light'
type Language = 'pt' | 'en'
type VisitMetric = {
  totalCount: number | null
  todayCount: number | null
  dashboardUrl: string | null
}
type VisitStats = {
  portfolio: VisitMetric
  rizzerStudio: VisitMetric
  combined: VisitMetric
  isLoading: boolean
  hasError: boolean
  isPartial: boolean
}
type SocialStats = {
  githubFollowers: number | null
  linkedinFollowers: number | null
  githubToday: number | null
  linkedinToday: number | null
  isLoading: boolean
}

const RIZZER_STUDIO_DOMAINS = ['rizzer-studio-site.vercel.app', 'rizzer-studio.vercel.app'] as const

const navItems = [
  { id: 'inicio' },
  { id: 'about' },
  { id: 'services' },
  { id: 'projects' },
  { id: 'contact' }
]

const serviceCardsByLanguage: Record<Language, Array<{ title: string; text: string; image: string }>> = {
  pt: [
    {
      title: 'Análise Preditiva',
      text: 'Preveja tendências e tome decisões orientadas por dados com modelos avançados de ML.',
      image: '/images/Predictive Analytics.png'
    },
    {
      title: 'Consultoria em IA',
      text: 'Orientação especializada para implementar soluções de IA de acordo com a necessidade do seu negócio.',
      image: '/images/AI Consulting.png'
    },
    {
      title: 'Engenharia de Dados',
      text: 'Construa pipelines robustos e infraestrutura confiável para operações com machine learning.',
      image: '/images/Data Engineering.png'
    },
    {
      title: 'AI Chatbots',
      text: 'Chatbots e copilotos com foco em utilidade real, experiência e desempenho.',
      image: '/images/AIChatbots.png'
    },
    {
      title: 'Machine Learning',
      text: 'Implementação de pipelines de ML do protótipo ao uso em produção.',
      image: '/images/Machine Learning.png'
    }
  ],
  en: [
    {
      title: 'Predictive Analytics',
      text: 'Forecast trends and make data-driven decisions with advanced ML models.',
      image: '/images/Predictive Analytics.png'
    },
    {
      title: 'AI Consulting',
      text: 'Specialized guidance to implement AI solutions based on your business needs.',
      image: '/images/AI Consulting.png'
    },
    {
      title: 'Data Engineering',
      text: 'Build robust pipelines and reliable infrastructure for machine learning operations.',
      image: '/images/Data Engineering.png'
    },
    {
      title: 'AI Chatbots',
      text: 'Chatbots and copilots focused on real utility, user experience and performance.',
      image: '/images/AIChatbots.png'
    },
    {
      title: 'Machine Learning',
      text: 'ML pipeline implementation from prototype to production.',
      image: '/images/Machine Learning.png'
    }
  ]
}

const themes: Record<ThemeMode, Record<string, string>> = {
  dark: {
    '--bg': '#1A1A1A',
    '--surface': '#16181D',
    '--surface-soft': '#1B1F27',
    '--line': '#2A303C',
    '--button': '#4FC3F7',
    '--button-text': '#0E141A',
    '--border-gmail': '#484E53',
    '--text-medium': '#E1E1E1',
    '--text-title': '#FFFFFF',
    '--text-muted': '#BDC5D3',
    '--subtitle-gradient': 'linear-gradient(90deg, #4FC3F7 0%, #F5F5F5 100%)',
    '--badge-color': '#484E53',
    '--badge-card': '#F5F8FF'
  },
  light: {
    '--bg': '#E0E8F6',
    '--surface': '#EFF4FC',
    '--surface-soft': '#EAF2FF',
    '--line': '#C2CEDF',
    '--button': '#4FC3F7',
    '--button-text': '#0E141A',
    '--border-gmail': '#484E53',
    '--text-medium': '#E1E1E1',
    '--text-title': '#484E53',
    '--text-muted': '#667086',
    '--subtitle-gradient': 'linear-gradient(90deg, #4FC3F7 0%, #484E53 100%)',
    '--badge-color': '#484E53',
    '--badge-card': '#BCE7FA'
  }
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="font-['Poppins'] text-[34px] font-bold leading-[1.06] tracking-[-0.03em] text-[var(--text-title)] sm:text-[44px]">
        {title}
      </h2>
      <p className="mt-1 bg-[var(--subtitle-gradient)] bg-clip-text text-sm text-transparent">{subtitle}</p>
    </div>
  )
}

function NavLink({ href, label, active, onClick }: { href: string; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-sm transition ${
        active ? 'text-[var(--button)]' : 'text-[var(--text-title)]/85 hover:text-[var(--text-title)]'
      }`}
    >
      {label}
    </a>
  )
}

function PanelButton({ children, href }: { children: ReactNode; href?: string }) {
  const className =
    'inline-flex items-center justify-center rounded-full border border-[var(--button)] px-8 py-2.5 text-sm text-[var(--text-title)] transition hover:bg-[var(--button)]/20'
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return <button className={className}>{children}</button>
}

export default function Portfolio() {
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [language, setLanguage] = useState<Language>('pt')
  const [activeSection, setActiveSection] = useState('inicio')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const emptyMetric: VisitMetric = { totalCount: null, todayCount: null, dashboardUrl: null }
  const [visitStats, setVisitStats] = useState<VisitStats>({
    portfolio: emptyMetric,
    rizzerStudio: emptyMetric,
    combined: emptyMetric,
    isLoading: true,
    hasError: false,
    isPartial: false
  })
  const portfolioMotionValue = useMotionValue(0)
  const studioMotionValue = useMotionValue(0)
  const combinedMotionValue = useMotionValue(0)
  const githubMotionValue = useMotionValue(0)
  const linkedinMotionValue = useMotionValue(0)
  const [socialStats, setSocialStats] = useState<SocialStats>({
    githubFollowers: null,
    linkedinFollowers: null,
    githubToday: null,
    linkedinToday: null,
    isLoading: true
  })
  const [displayVisitCounts, setDisplayVisitCounts] = useState({
    portfolio: 0,
    studio: 0,
    combined: 0,
    github: 0,
    linkedin: 0
  })
  const [refreshTick, setRefreshTick] = useState(0)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const saved = window.localStorage.getItem('portfolio-theme')
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('portfolio-language')
    if (saved === 'pt' || saved === 'en') setLanguage(saved)
  }, [])

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    window.localStorage.setItem('portfolio-theme', nextTheme)
  }

  const themeVars = useMemo(() => themes[theme], [theme])
  const isLight = theme === 'light'
  const serviceCards = useMemo(() => serviceCardsByLanguage[language], [language])
  const numberFormatter = useMemo(() => new Intl.NumberFormat(language === 'pt' ? 'pt-BR' : 'en-US'), [language])
  const navLabels = useMemo(
    () =>
      language === 'pt'
        ? {
            inicio: 'Início',
            about: 'Sobre mim',
            services: 'O que eu faço',
            projects: 'Skills',
            contact: 'Rizzer Studio'
          }
        : {
            inicio: 'Home',
            about: 'About',
            services: 'Services',
            projects: 'Skills',
            contact: 'Rizzer Studio'
          },
    [language]
  )
  const uiText = useMemo(
    () =>
      language === 'pt'
        ? {
            heroRole: 'Arquiteto de Produtos Digitais',
            heroCta: 'Fale comigo',
            heroDescription:
              'Sou desenvolvedor full stack e arquiteto de produtos digitais. Construo ecossistemas que conectam web, mobile, desktop e IA em sistemas vivos onde ideias viram módulos, módulos viram plataformas e tecnologia vira impacto real.',
            aboutTitle: 'Sobre mim',
            aboutSubtitle: 'Conheça meu trabalho',
            aboutButton: 'Meu GitHub',
            aboutParagraphs: [
              'Olá! Meu nome é Matheus Felipe, sou formado em Desenvolvimento Full Stack e Gestão de TI.',
              'Desenvolvo sistemas que conectam web, mobile, desktop e IA em experiências reais não apenas interfaces. Meu trabalho une tecnologia, design e lógica de negócio para transformar ideias em produtos vivos, escaláveis e funcionais.',
              'Em cada projeto, aplico arquitetura moderna, foco em performance e atenção à experiência do usuário, sempre buscando soluções práticas para problemas reais.',
              'Se você tem uma ideia e quer transformá-la em produto, vamos conversar.'
            ],
            servicesTitle: 'O que eu faço',
            servicesSubtitle: 'Meus serviços',
            mlSolutionsTitle: 'Soluções em Machine Learning',
            mlSolutionsText: 'Criação de soluções inteligentes para automação, análise e tomada de decisão com IA.',
            skillsImageAlt: 'Mapa de skills e tecnologias',
            skillsSubtitle: 'Ecossistema de tecnologias que utilizo',
            skillsNote:
              'Os projetos completos estão publicados no site da Rizzer Studio, com detalhes técnicos, escopo e evolução de cada solução.',
            skillsButton: 'Ver projetos na Rizzer Studio',
            rizzerDesc:
              'Meu laboratório de produtos digitais, automações com IA e experimentos visuais. É onde transformo ideias em sistemas funcionais com foco em qualidade, clareza e execução.',
            rizzerProducts: 'Produtos',
            rizzerProductsText: 'Web apps, mobile e desktop voltados para problemas reais.',
            rizzerAi: 'IA aplicada',
            rizzerAiText: 'Integrações com OpenAI, Gemini e Ollama para automação útil.',
            rizzerExperiment: 'Experimentação',
            rizzerExperimentText: 'Prototipação rápida para validar conceito, UX e arquitetura.',
            rizzerOpen: 'Abrir Rizzer Studio',
            rizzerLab: 'Ver Lab',
            rizzerStatsTitle: 'Estatísticas de visitas',
            rizzerStatsSubtitle: 'Acompanhamento automático de acessos do site.',
            rizzerStatsPanelTag: 'Painel ao vivo',
            rizzerStatsPortfolio: 'Portfolio',
            rizzerStatsPortfolioHint: 'Visitas deste portfolio.',
            rizzerStatsStudio: 'Rizzer Studio',
            rizzerStatsStudioHint: 'Visitas do Rizzer Studio.',
            rizzerStatsGithub: 'GitHub',
            rizzerStatsGithubHint: 'Visitas do GitHub.',
            rizzerStatsLinkedin: 'LinkedIn',
            rizzerStatsLinkedinHint: 'Visitas do LinkedIn.',
            rizzerStatsCombined: 'Total combinado',
            rizzerStatsCombinedHint: 'Portfolio + Rizzer Studio + Github + LinkedIn.',
            rizzerStatsTodayLabel: 'Hoje',
            rizzerStatsStatus: 'Status da coleta',
            rizzerStatsStatusHint: 'Integrado com coleta automática de tráfego.',
            rizzerStatsLive: 'Ativo',
            rizzerStatsPartial: 'Parcial',
            rizzerStatsLoading: 'Carregando...',
            rizzerStatsUnavailable: 'Indisponível',
            rizzerStatsError: 'Sem conexão',
            rizzerStatsPortfolioDashboard: 'Dashboard Portfolio',
            rizzerStatsStudioDashboard: 'Dashboard Rizzer',
            footerTitleLine1: 'Vamos',
            footerTitleLine2: 'trabalhar juntos',
            footerRights: `© ${currentYear} Dev-MatheusFelipe. Todos os direitos reservados.`
          }
        : {
            heroRole: 'Digital Product Architect',
            heroCta: 'Talk to me',
            heroDescription:
              'I am a full stack developer and digital product architect. I build ecosystems that connect web, mobile, desktop and AI into living systems where ideas become modules, modules become platforms and technology becomes real impact.',
            aboutTitle: 'About me',
            aboutSubtitle: 'Get to know my work',
            aboutButton: 'My GitHub',
            aboutParagraphs: [
              "Hi! My name is Matheus Felipe, and I have a degree in Full Stack Development and IT Management.",
              'I build systems that connect web, mobile, desktop and AI into real experiences, not just interfaces. My work combines technology, design and business logic to turn ideas into living, scalable and functional products.',
              'In every project, I apply modern architecture, performance focus and careful attention to user experience, always seeking practical solutions for real problems.',
              'If you have an idea and want to turn it into a product, let’s talk.'
            ],
            servicesTitle: 'What I do',
            servicesSubtitle: 'My services',
            mlSolutionsTitle: 'Machine Learning Solutions',
            mlSolutionsText: 'Building smart solutions for automation, analysis and AI-driven decision making.',
            skillsImageAlt: 'Skills and technologies map',
            skillsSubtitle: 'Technology ecosystem I use',
            skillsNote:
              'Full projects are published on the Rizzer Studio website, with technical details, scope and evolution of each solution.',
            skillsButton: 'View projects at Rizzer Studio',
            rizzerDesc:
              'My lab for digital products, AI automations and visual experiments. It is where I turn ideas into functional systems focused on quality, clarity and execution.',
            rizzerProducts: 'Products',
            rizzerProductsText: 'Web, mobile and desktop apps focused on real problems.',
            rizzerAi: 'Applied AI',
            rizzerAiText: 'Integrations with OpenAI, Gemini and Ollama for practical automation.',
            rizzerExperiment: 'Experimentation',
            rizzerExperimentText: 'Rapid prototyping to validate concept, UX and architecture.',
            rizzerOpen: 'Open Rizzer Studio',
            rizzerLab: 'View Lab',
            rizzerStatsTitle: 'Visit statistics',
            rizzerStatsSubtitle: 'Automatic tracking for website visits.',
            rizzerStatsPanelTag: 'Live panel',
            rizzerStatsPortfolio: 'Portfolio',
            rizzerStatsPortfolioHint: 'Visits from this portfolio.',
            rizzerStatsStudio: 'Rizzer Studio',
            rizzerStatsStudioHint: 'Visits from Rizzer Studio.',
            rizzerStatsGithub: 'GitHub',
            rizzerStatsGithubHint: 'GitHub visits.',
            rizzerStatsLinkedin: 'LinkedIn',
            rizzerStatsLinkedinHint: 'LinkedIn visits.',
            rizzerStatsCombined: 'Combined total',
            rizzerStatsCombinedHint: 'Portfolio + Rizzer Studio + Github + LinkedIn.',
            rizzerStatsTodayLabel: 'Today',
            rizzerStatsStatus: 'Collection status',
            rizzerStatsStatusHint: 'Connected to automatic traffic tracking.',
            rizzerStatsLive: 'Live',
            rizzerStatsPartial: 'Partial',
            rizzerStatsLoading: 'Loading...',
            rizzerStatsUnavailable: 'Unavailable',
            rizzerStatsError: 'No connection',
            rizzerStatsPortfolioDashboard: 'Portfolio dashboard',
            rizzerStatsStudioDashboard: 'Rizzer dashboard',
            footerTitleLine1: "Let's",
            footerTitleLine2: 'work together',
            footerRights: `© ${currentYear} Dev-MatheusFelipe. All rights reserved.`
          },
    [language, currentYear]
  )

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    window.localStorage.setItem('portfolio-language', nextLanguage)
  }

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnDesktop)
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-45% 0px -40% 0px',
        threshold: [0.15, 0.35, 0.55]
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRefreshTick((v) => v + 1)
    }, 30000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const normalizeDomain = (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return ''
      try {
        return new URL(trimmed).hostname
      } catch {
        return trimmed.replace(/^https?:\/\//, '').split('/')[0]
      }
    }

    const sumCounts = (values: Array<number | null>) => {
      const valid = values.filter((value): value is number => typeof value === 'number')
      if (!valid.length) return null
      return valid.reduce((acc, value) => acc + value, 0)
    }

    const toMetric = (payload: { totalCount?: number; todayCount?: number; dashboardUrl?: string }): VisitMetric => ({
      totalCount: typeof payload.totalCount === 'number' ? payload.totalCount : null,
      todayCount: typeof payload.todayCount === 'number' ? payload.todayCount : null,
      dashboardUrl: typeof payload.dashboardUrl === 'string' ? payload.dashboardUrl : null
    })

    const loadVisitStats = async () => {
      const env = import.meta.env as Record<string, string | undefined>
      const endpoint = env.VITE_VISITOR_COUNTER_API_URL?.trim() || 'https://visitor.6developer.com/visit'
      let failedRequests = 0

      const requestMetric = async (domain: string): Promise<VisitMetric> => {
        const response = await fetch(`${endpoint}?domain=${encodeURIComponent(domain)}`)
        if (!response.ok) {
          throw new Error(`Visit stats request failed: ${response.status}`)
        }
        const data = (await response.json()) as { totalCount?: number; todayCount?: number; dashboardUrl?: string }
        return toMetric(data)
      }

      const safeRequest = async (runner: () => Promise<VisitMetric>) => {
        try {
          return await runner()
        } catch {
          failedRequests += 1
          return null
        }
      }

      const envDomain = env.VITE_VISITOR_COUNTER_DOMAIN?.trim()
      const envCompareDomain = env.VITE_VISITOR_COUNTER_COMPARE_DOMAIN?.trim()
      const portfolioDomainRaw = envDomain && envDomain.length > 0 ? envDomain : window.location.hostname
      const portfolioDomain = normalizeDomain(portfolioDomainRaw) || window.location.hostname
      const studioDomains = [
        envCompareDomain ?? '',
        ...RIZZER_STUDIO_DOMAINS
      ]
        .map((domain) => normalizeDomain(domain))
        .filter((domain, index, arr) => domain.length > 0 && arr.indexOf(domain) === index)
      const dayKey = new Date().toISOString().slice(0, 10)
      const guardKey = `portfolio-visit-posted:${portfolioDomain}:${window.location.pathname}:${dayKey}`
      const alreadyCounted = window.sessionStorage.getItem(guardKey) === '1'

      const portfolioMetric = await safeRequest(async () => {
        const response = alreadyCounted
          ? await fetch(`${endpoint}?domain=${encodeURIComponent(portfolioDomain)}`)
          : await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                domain: portfolioDomain,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                page_path: window.location.pathname,
                page_title: document.title,
                referrer: document.referrer || ''
              })
            })

        if (!response.ok) {
          throw new Error(`Visit stats request failed: ${response.status}`)
        }

        if (!alreadyCounted) {
          window.sessionStorage.setItem(guardKey, '1')
        }

        const data = (await response.json()) as { totalCount?: number; todayCount?: number; dashboardUrl?: string }
        return toMetric(data)
      })

      const studioMetricsRaw = await Promise.all(studioDomains.map((domain) => safeRequest(() => requestMetric(domain))))
      const studioMetrics = studioMetricsRaw.filter((item): item is VisitMetric => item !== null)

      const rizzerStudioMetric: VisitMetric = {
        totalCount: sumCounts(studioMetrics.map((item) => item.totalCount)),
        todayCount: sumCounts(studioMetrics.map((item) => item.todayCount)),
        dashboardUrl: studioMetrics.find((item) => item.dashboardUrl)?.dashboardUrl ?? null
      }

      const combinedMetric: VisitMetric = {
        totalCount: sumCounts([portfolioMetric?.totalCount ?? null, rizzerStudioMetric.totalCount]),
        todayCount: sumCounts([portfolioMetric?.todayCount ?? null, rizzerStudioMetric.todayCount]),
        dashboardUrl: null
      }

      if (cancelled) return

      const hasAnyData = portfolioMetric !== null || studioMetrics.length > 0
      setVisitStats({
        portfolio: portfolioMetric ?? { ...emptyMetric },
        rizzerStudio: rizzerStudioMetric,
        combined: combinedMetric,
        isLoading: false,
        hasError: !hasAnyData,
        isPartial: failedRequests > 0 && hasAnyData
      })
    }

    loadVisitStats()
    return () => {
      cancelled = true
    }
  }, [refreshTick])

  useEffect(() => {
    let cancelled = false

    const loadSocialStats = async () => {
      let githubFollowers: number | null = null
      let linkedinFollowers: number | null = null
      let githubToday: number | null = null
      let linkedinToday: number | null = null

      try {
        const response = await fetch('/api/social-stats')
        if (response.ok) {
          const data = (await response.json()) as { githubFollowers?: number; linkedinFollowers?: number }
          githubFollowers = typeof data.githubFollowers === 'number' ? data.githubFollowers : null
          linkedinFollowers = typeof data.linkedinFollowers === 'number' ? data.linkedinFollowers : null
        }
      } catch {
        // fallback below
      }

      const env = import.meta.env as Record<string, string | undefined>
      const endpoint = env.VITE_VISITOR_COUNTER_API_URL?.trim() || 'https://visitor.6developer.com/visit'
      const githubCounterDomain =
        env.VITE_VISITOR_COUNTER_GITHUB_DOMAIN?.trim() || 'github.com/dev-matheusfelipe'
      const linkedinCounterDomain =
        env.VITE_VISITOR_COUNTER_LINKEDIN_DOMAIN?.trim() || 'linkedin.com/in/dev-matheusfelipe'

      const requestToday = async (domain: string) => {
        try {
          const response = await fetch(`${endpoint}?domain=${encodeURIComponent(domain)}`)
          if (!response.ok) return null
          const data = (await response.json()) as { todayCount?: number }
          return typeof data.todayCount === 'number' && Number.isFinite(data.todayCount)
            ? data.todayCount
            : null
        } catch {
          return null
        }
      }

      githubToday = await requestToday(githubCounterDomain)
      linkedinToday = await requestToday(linkedinCounterDomain)

      if (githubFollowers === null) {
        try {
          const response = await fetch('https://api.github.com/users/dev-matheusfelipe', {
            headers: {
              Accept: 'application/vnd.github+json'
            }
          })
          if (response.ok) {
            const data = (await response.json()) as { followers?: number }
            githubFollowers = typeof data.followers === 'number' ? data.followers : null
          }
        } catch {
          githubFollowers = null
        }
      }

      if (linkedinFollowers === null) {
        const linkedinRaw = env.VITE_LINKEDIN_FOLLOWERS?.trim()
        if (linkedinRaw) {
          const parsed = Number(linkedinRaw)
          linkedinFollowers = Number.isFinite(parsed) ? parsed : null
        }
      }

      if (cancelled) return

      setSocialStats({
        githubFollowers: githubFollowers ?? 0,
        linkedinFollowers: linkedinFollowers ?? 0,
        githubToday: githubToday ?? 0,
        linkedinToday: linkedinToday ?? 0,
        isLoading: false
      })
    }

    loadSocialStats()
    return () => {
      cancelled = true
    }
  }, [refreshTick])

  useEffect(() => {
    const unsubscribePortfolio = portfolioMotionValue.on('change', (latest) => {
      const nextValue = Math.round(latest)
      setDisplayVisitCounts((current) => (current.portfolio === nextValue ? current : { ...current, portfolio: nextValue }))
    })

    const unsubscribeStudio = studioMotionValue.on('change', (latest) => {
      const nextValue = Math.round(latest)
      setDisplayVisitCounts((current) => (current.studio === nextValue ? current : { ...current, studio: nextValue }))
    })

    const unsubscribeCombined = combinedMotionValue.on('change', (latest) => {
      const nextValue = Math.round(latest)
      setDisplayVisitCounts((current) => (current.combined === nextValue ? current : { ...current, combined: nextValue }))
    })

    const unsubscribeGithub = githubMotionValue.on('change', (latest) => {
      const nextValue = Math.round(latest)
      setDisplayVisitCounts((current) => (current.github === nextValue ? current : { ...current, github: nextValue }))
    })

    const unsubscribeLinkedin = linkedinMotionValue.on('change', (latest) => {
      const nextValue = Math.round(latest)
      setDisplayVisitCounts((current) => (current.linkedin === nextValue ? current : { ...current, linkedin: nextValue }))
    })

    return () => {
      unsubscribePortfolio()
      unsubscribeStudio()
      unsubscribeCombined()
      unsubscribeGithub()
      unsubscribeLinkedin()
    }
  }, [portfolioMotionValue, studioMotionValue, combinedMotionValue, githubMotionValue, linkedinMotionValue])

  const combinedAllTotal =
    (visitStats.combined.totalCount ?? 0) +
    (socialStats.githubFollowers ?? 0) +
    (socialStats.linkedinFollowers ?? 0)
  const combinedAllToday =
    (visitStats.combined.todayCount ?? 0) +
    (socialStats.githubToday ?? 0) +
    (socialStats.linkedinToday ?? 0)

  useEffect(() => {
    if (visitStats.isLoading) return

    const portfolioTarget = visitStats.portfolio.totalCount ?? 0
    const studioTarget = visitStats.rizzerStudio.totalCount ?? 0
    const combinedTarget = combinedAllTotal

    const portfolioControls = animate(portfolioMotionValue, portfolioTarget, {
      type: 'spring',
      stiffness: 115,
      damping: 22,
      mass: 0.75
    })
    const studioControls = animate(studioMotionValue, studioTarget, {
      type: 'spring',
      stiffness: 122,
      damping: 23,
      mass: 0.74,
      delay: 0.04
    })
    const combinedControls = animate(combinedMotionValue, combinedTarget, {
      type: 'spring',
      stiffness: 130,
      damping: 24,
      mass: 0.72,
      delay: 0.08
    })

    return () => {
      portfolioControls.stop()
      studioControls.stop()
      combinedControls.stop()
    }
  }, [
    visitStats.isLoading,
    visitStats.portfolio.totalCount,
    visitStats.rizzerStudio.totalCount,
    combinedAllTotal,
    portfolioMotionValue,
    studioMotionValue,
    combinedMotionValue
  ])

  useEffect(() => {
    if (socialStats.isLoading) return

    const githubControls = animate(githubMotionValue, socialStats.githubFollowers ?? 0, {
      type: 'spring',
      stiffness: 122,
      damping: 23,
      mass: 0.74
    })
    const linkedinControls = animate(linkedinMotionValue, socialStats.linkedinFollowers ?? 0, {
      type: 'spring',
      stiffness: 122,
      damping: 23,
      mass: 0.74,
      delay: 0.04
    })

    return () => {
      githubControls.stop()
      linkedinControls.stop()
    }
  }, [socialStats.isLoading, socialStats.githubFollowers, socialStats.linkedinFollowers, githubMotionValue, linkedinMotionValue])

  const formatVisitCount = (value: number | null, animatedValue: number) => {
    if (visitStats.isLoading) return uiText.rizzerStatsLoading
    if (value === null) return uiText.rizzerStatsUnavailable
    return numberFormatter.format(animatedValue)
  }

  const formatRawCount = (value: number | null) => {
    if (value === null) return uiText.rizzerStatsUnavailable
    return numberFormatter.format(value)
  }

  const formatSocialCount = (value: number | null, animatedValue: number) => {
    if (socialStats.isLoading) return uiText.rizzerStatsLoading
    return numberFormatter.format(animatedValue)
  }

  const visitStatusLabel = visitStats.isLoading
    ? uiText.rizzerStatsLoading
    : visitStats.hasError
      ? uiText.rizzerStatsError
      : visitStats.isPartial
        ? uiText.rizzerStatsPartial
        : uiText.rizzerStatsLive

  const visitStatusTone = visitStats.isLoading
    ? isLight
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
      : 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.75)]'
    : visitStats.hasError
      ? isLight
        ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.35)]'
        : 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.75)]'
      : visitStats.isPartial
        ? isLight
          ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.35)]'
          : 'bg-orange-300 shadow-[0_0_12px_rgba(253,186,116,0.85)]'
        : isLight
          ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.35)]'
          : 'bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]'

  const statsPanelClass = 'relative mt-6 p-0'
  const statsGridOverlayClass = 'hidden'
  const statsBeamClass = 'hidden'
  const statsLineClass = 'hidden'

  const statsTitleClass = isLight
    ? "font-['Poppins'] text-lg font-semibold tracking-[-0.01em] text-[#24435a] sm:text-xl"
    : "font-['Poppins'] text-lg font-semibold tracking-[-0.01em] text-slate-100 sm:text-xl"

  const statsTagClass = isLight
    ? 'inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#1d5d86]'
    : 'inline-flex items-center rounded-full border border-cyan-200/35 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan-100'

  const statsSubtitleClass = isLight ? 'mt-1 text-sm text-[#3f627c]/88' : 'mt-1 text-sm text-slate-300/78'

  const statsCardClass =
    'group relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4 transition-transform sm:p-5'

  const statsCardLineClass = isLight
    ? 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/55 to-transparent opacity-80'
    : 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent opacity-60'

  const statsLabelClass = isLight
    ? 'text-[11px] uppercase tracking-[0.16em] text-[#2f607f]/85'
    : 'text-[11px] uppercase tracking-[0.16em] text-cyan-100/72'

  const statsNumberClass = isLight
    ? "mt-3 block font-['Poppins'] text-[38px] font-semibold leading-none tracking-[-0.045em] text-[#1f4660] tabular-nums"
    : "mt-3 block font-['Poppins'] text-[38px] font-semibold leading-none tracking-[-0.045em] text-cyan-100 tabular-nums"

  const statsHintClass = isLight ? 'mt-2 text-xs text-[#40637b]/86' : 'mt-2 text-xs text-slate-300/66'
  const statsTodayClass = isLight ? 'mt-1 text-xs text-[#40637b]/86' : 'mt-1 text-xs text-slate-300/66'
  const statsStatusWrapClass =
    'inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1.5'
  const statsStatusTextClass = isLight ? "font-['Poppins'] text-sm font-semibold text-[#1f4660]" : "font-['Poppins'] text-sm font-semibold text-slate-100"
  const statsLinkClass = 'inline-flex items-center text-sm font-medium text-[var(--button)] transition hover:opacity-80'

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-title)]" style={themeVars}>
      <header className="fixed inset-x-0 top-0 z-50 bg-[var(--bg)]/88 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <a href="#inicio" className="font-['Oleo_Script'] text-[32px] leading-none text-[var(--text-title)]">
            Matheus Felipe
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.id} href={`#${item.id}`} label={navLabels[item.id]} active={activeSection === item.id} />
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeLanguage('pt')}
                aria-label="Português"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  language === 'pt' ? 'border-[var(--button)] bg-[var(--button)]/20' : 'border-[var(--line)]'
                }`}
              >
                <img src="/images/br.svg" alt="PT-BR" className="h-5 w-5 object-contain" />
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                aria-label="English"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  language === 'en' ? 'border-[var(--button)] bg-[var(--button)]/20' : 'border-[var(--line)]'
                }`}
              >
                <img src="/images/us.svg" alt="EN-US" className="h-5 w-5 object-contain" />
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 items-center justify-center"
              aria-label="Alternar tema"
            >
              <img
                src={isLight ? '/images/dark-icon.png' : '/images/lighticon.png'}
              alt="Tema"
                className="h-5 w-5 object-contain"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center md:hidden"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            <img
              src={isLight ? '/images/menu-mobile-light.png' : '/images/menu-mobile-dark.png'}
              alt="Menu"
              className="h-6 w-6 object-contain"
            />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--line)]/80 bg-[var(--bg)]/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  href={`#${item.id}`}
                  label={navLabels[item.id]}
                  active={activeSection === item.id}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeLanguage('pt')}
                aria-label="Português"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  language === 'pt' ? 'border-[var(--button)] bg-[var(--button)]/20' : 'border-[var(--line)]'
                }`}
              >
                <img src="/images/br.svg" alt="PT-BR" className="h-5 w-5 object-contain" />
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                aria-label="English"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  language === 'en' ? 'border-[var(--button)] bg-[var(--button)]/20' : 'border-[var(--line)]'
                }`}
              >
                <img src="/images/us.svg" alt="EN-US" className="h-5 w-5 object-contain" />
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)]"
                aria-label="Alternar tema"
              >
                <img
                  src={isLight ? '/images/dark-icon.png' : '/images/lighticon.png'}
                  alt="Tema"
                  className="h-5 w-5 object-contain"
                />
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-28 sm:px-8">
        <section
          id="inicio"
          className="relative mt-10 scroll-mt-28 overflow-hidden px-4 py-20 sm:px-10"
        >
          <div className="pointer-events-none absolute left-1/2 top-8 w-[1025px] max-w-[calc(100%-1rem)] -translate-x-1/2">
            <div className="aspect-[1025/764] overflow-hidden rounded-[500px]">
              <img
                src={isLight ? '/images/Rectangle2.png' : '/images/Rectangle3.png'}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover opacity-95"
              />
            </div>
          </div>
          <div className="relative z-10 mx-auto max-w-[780px] text-center">
            <img
              src="/images/avatar1.png"
              alt="Avatar Dev-MatheusFelipe"
              className="mx-auto h-auto w-auto max-h-[200px] max-w-[200px] object-contain"
            />

            <h1 className="mt-6 font-['Poppins'] text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--text-title)] sm:text-[54px] lg:text-[63px]">
              Dev-matheusFelipe
            </h1>
            <p className="mt-3 bg-[var(--subtitle-gradient)] bg-clip-text font-['Poppins'] text-[30px] font-semibold text-transparent">
              {uiText.heroRole}
            </p>
            <p className="mx-auto mt-3 max-w-[720px] text-base leading-relaxed text-[var(--text-title)]/80 sm:text-lg">
              {uiText.heroDescription}
            </p>
            <div className="mt-7">
              <PanelButton href={portfolioLinks.linkedin}>{uiText.heroCta}</PanelButton>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto mt-24 max-w-[820px] scroll-mt-28">
          <SectionTitle title={uiText.aboutTitle} subtitle={uiText.aboutSubtitle} />
          <div className="mt-8 space-y-5 text-center text-sm leading-relaxed text-[var(--text-title)]/80 sm:text-base">
            {uiText.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 text-center" id="resume">
            <PanelButton href={portfolioLinks.github}>{uiText.aboutButton}</PanelButton>
          </div>
        </section>

        <section id="services" className="mt-24 scroll-mt-28">
          <SectionTitle title={uiText.servicesTitle} subtitle={uiText.servicesSubtitle} />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {serviceCards.slice(0, 3).map((item) => (
              <article key={item.title} className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                <img src={item.image} alt={item.title} className="mx-auto mb-4 h-40 w-auto object-contain" />
                <h3 className="font-['Poppins'] text-base font-semibold text-[var(--text-title)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{item.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <img src={serviceCards[3].image} alt={serviceCards[3].title} className="mx-auto mb-4 h-32 w-auto object-contain" />
              <h3 className="font-['Poppins'] text-base font-semibold text-[var(--text-title)]">{serviceCards[3].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{serviceCards[3].text}</p>
            </article>

            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-2">
              <div className="rounded-lg p-3">
                <img
                  src="/images/Machine Learning Solutions.png"
                  alt={uiText.mlSolutionsTitle}
                  className="mx-auto mb-4 h-32 w-auto object-contain"
                />
                <h3 className="font-['Poppins'] text-base font-semibold text-[var(--text-title)]">
                  {uiText.mlSolutionsTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">
                  {uiText.mlSolutionsText}
                </p>
              </div>
            </article>

            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <img src={serviceCards[4].image} alt={serviceCards[4].title} className="mx-auto mb-4 h-32 w-auto object-contain" />
              <h3 className="font-['Poppins'] text-base font-semibold text-[var(--text-title)]">{serviceCards[4].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{serviceCards[4].text}</p>
            </article>
          </div>
        </section>

        <section id="projects" className="mt-24 scroll-mt-28">
          <SectionTitle title="Skills" subtitle={uiText.skillsSubtitle} />

          <img
            src="/images/Skills.png"
            alt={uiText.skillsImageAlt}
            className="mx-auto mt-8 block object-contain"
            style={{ width: 'min(1500px, 100%)' }}
          />

          <p className="mx-auto mt-6 max-w-[760px] text-center text-sm leading-relaxed text-[var(--text-title)]/75 sm:text-base">{uiText.skillsNote}</p>

          <div className="mt-6 text-center">
            <PanelButton href={portfolioLinks.rizzerStudio}>{uiText.skillsButton}</PanelButton>
          </div>
        </section>

        <section id="contact" className="mx-auto mt-24 max-w-[900px] scroll-mt-28">
          <h2 className="text-center font-['Poppins'] text-[38px] font-bold tracking-[-0.03em] text-[var(--text-title)] sm:text-[56px]">
            Rizzer Studio
          </h2>
          <p className="mx-auto mt-3 max-w-[760px] text-center text-base leading-relaxed text-[var(--text-title)]/80 sm:text-lg">
            {uiText.rizzerDesc}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <h3 className="font-['Poppins'] text-lg font-semibold text-[var(--text-title)]">{uiText.rizzerProducts}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{uiText.rizzerProductsText}</p>
            </article>
            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <h3 className="font-['Poppins'] text-lg font-semibold text-[var(--text-title)]">{uiText.rizzerAi}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{uiText.rizzerAiText}</p>
            </article>
            <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-5">
              <h3 className="font-['Poppins'] text-lg font-semibold text-[var(--text-title)]">{uiText.rizzerExperiment}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-title)]/75">{uiText.rizzerExperimentText}</p>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PanelButton href={portfolioLinks.rizzerStudio}>{uiText.rizzerOpen}</PanelButton>
            <PanelButton href={portfolioLinks.lab}>{uiText.rizzerLab}</PanelButton>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className={statsPanelClass}
          >
            <div className={statsGridOverlayClass} />
            <motion.div
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className={statsBeamClass}
            />
            <div className={statsLineClass} />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className={statsTitleClass}>
                  {uiText.rizzerStatsTitle}
                </h3>
                <span className={statsTagClass}>
                  {uiText.rizzerStatsPanelTag}
                </span>
              </div>
              <p className={statsSubtitleClass}>{uiText.rizzerStatsSubtitle}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.05, duration: 0.32 }}
                  whileHover={{ y: -4, scale: 1.008 }}
                  className={statsCardClass}
                >
                  <div className={statsCardLineClass} />
                  <p className={statsLabelClass}>{uiText.rizzerStatsPortfolio}</p>
                  <motion.span
                    key={`portfolio-${visitStats.portfolio.totalCount ?? 'na'}-${visitStats.isLoading}-${visitStats.hasError}-${visitStats.isPartial}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    className={statsNumberClass}
                  >
                    {formatVisitCount(visitStats.portfolio.totalCount, displayVisitCounts.portfolio)}
                  </motion.span>
                  <p className={statsHintClass}>{uiText.rizzerStatsPortfolioHint}</p>
                  <p className={statsTodayClass}>
                    {uiText.rizzerStatsTodayLabel}: {formatRawCount(visitStats.portfolio.todayCount)}
                  </p>
                </motion.article>

                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.14, duration: 0.32 }}
                  whileHover={{ y: -4, scale: 1.008 }}
                  className={statsCardClass}
                >
                  <div className={statsCardLineClass} />
                  <p className={statsLabelClass}>{uiText.rizzerStatsStudio}</p>
                  <motion.span
                    key={`studio-${visitStats.rizzerStudio.totalCount ?? 'na'}-${visitStats.isLoading}-${visitStats.hasError}-${visitStats.isPartial}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className={statsNumberClass}
                  >
                    {formatVisitCount(visitStats.rizzerStudio.totalCount, displayVisitCounts.studio)}
                  </motion.span>
                  <p className={statsHintClass}>{uiText.rizzerStatsStudioHint}</p>
                  <p className={statsTodayClass}>
                    {uiText.rizzerStatsTodayLabel}: {formatRawCount(visitStats.rizzerStudio.todayCount)}
                  </p>
                </motion.article>

                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.22, duration: 0.32 }}
                  whileHover={{ y: -4, scale: 1.008 }}
                  className={statsCardClass}
                >
                  <div className={statsCardLineClass} />
                  <p className={statsLabelClass}>{uiText.rizzerStatsGithub}</p>
                  <motion.span
                    key={`github-${socialStats.githubFollowers ?? 'na'}-${socialStats.isLoading}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.09 }}
                    className={statsNumberClass}
                  >
                    {formatSocialCount(socialStats.githubFollowers, displayVisitCounts.github)}
                  </motion.span>
                  <p className={statsHintClass}>{uiText.rizzerStatsGithubHint}</p>
                  <p className={statsTodayClass}>
                    {uiText.rizzerStatsTodayLabel}:{' '}
                    {socialStats.isLoading
                      ? uiText.rizzerStatsLoading
                      : formatRawCount(socialStats.githubToday)}
                  </p>
                </motion.article>

                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.3, duration: 0.32 }}
                  whileHover={{ y: -4, scale: 1.008 }}
                  className={statsCardClass}
                >
                  <div className={statsCardLineClass} />
                  <p className={statsLabelClass}>{uiText.rizzerStatsLinkedin}</p>
                  <motion.span
                    key={`linkedin-${socialStats.linkedinFollowers ?? 'na'}-${socialStats.isLoading}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                    className={statsNumberClass}
                  >
                    {formatSocialCount(socialStats.linkedinFollowers, displayVisitCounts.linkedin)}
                  </motion.span>
                  <p className={statsHintClass}>{uiText.rizzerStatsLinkedinHint}</p>
                  <p className={statsTodayClass}>
                    {uiText.rizzerStatsTodayLabel}:{' '}
                    {socialStats.isLoading
                      ? uiText.rizzerStatsLoading
                      : formatRawCount(socialStats.linkedinToday)}
                  </p>
                </motion.article>
              </div>

              <div className="mt-4 grid gap-4">
                <motion.article
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.22, duration: 0.32 }}
                  whileHover={{ y: -4, scale: 1.004 }}
                  className={statsCardClass}
                >
                  <div className={statsCardLineClass} />
                  <p className={statsLabelClass}>{uiText.rizzerStatsCombined}</p>
                  <motion.span
                    key={`combined-${combinedAllTotal}-${visitStats.isLoading}-${socialStats.isLoading}`}
                    initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.09 }}
                    className={statsNumberClass}
                  >
                    {visitStats.isLoading || socialStats.isLoading
                      ? uiText.rizzerStatsLoading
                      : numberFormatter.format(displayVisitCounts.combined)}
                  </motion.span>
                  <p className={statsHintClass}>{uiText.rizzerStatsCombinedHint}</p>
                  <p className={statsTodayClass}>
                    {uiText.rizzerStatsTodayLabel}:{' '}
                    {visitStats.isLoading || socialStats.isLoading
                      ? uiText.rizzerStatsLoading
                      : numberFormatter.format(combinedAllToday)}
                  </p>
                </motion.article>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
                <div className={statsStatusWrapClass}>
                  <span className={`h-2 w-2 rounded-full ${visitStatusTone} ${visitStats.hasError ? '' : 'animate-pulse'}`} />
                  <span className={statsStatusTextClass}>{visitStatusLabel}</span>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                  {visitStats.portfolio.dashboardUrl && (
                    <a
                      href={visitStats.portfolio.dashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={statsLinkClass}
                    >
                      {uiText.rizzerStatsPortfolioDashboard}
                    </a>
                  )}
                  {visitStats.rizzerStudio.dashboardUrl && (
                    <a
                      href={visitStats.rizzerStudio.dashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={statsLinkClass}
                    >
                      {uiText.rizzerStatsStudioDashboard}
                    </a>
                  )}
                  <a
                    href="https://github.com/dev-matheusfelipe"
                    target="_blank"
                    rel="noreferrer"
                    className={statsLinkClass}
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dev-matheusfelipe/"
                    target="_blank"
                    rel="noreferrer"
                    className={statsLinkClass}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <footer className="relative mt-24 pt-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--line)]" />
          <img
            src="/images/avatar2.png"
            alt="Avatar adicional"
            className="absolute h-auto w-auto max-h-[92px] max-w-[92px] object-contain"
            style={{ top: '-3.8rem', left: '-2rem' }}
          />
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h3 className="font-['Poppins'] text-[42px] font-semibold leading-[0.95] tracking-[-0.03em] text-[var(--text-title)] sm:text-[58px]">
              {uiText.footerTitleLine1}
              <br />
              {uiText.footerTitleLine2}
            </h3>

            <a
              href="mailto:matheus.f.basilio@gmail.com"
              className="inline-flex max-w-full items-center gap-2 rounded-xl border border-[var(--border-gmail)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-title)]/85 hover:border-[var(--button)] sm:px-5"
            >
              <img src="/images/gmail-logo.png" alt="Gmail" className="h-4 w-4 object-contain" />
              <span className="break-all">matheus.f.basilio@gmail.com</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-title)]/65">
            <div className="flex items-center gap-2">
              <img
                src={isLight ? '/images/Logo_Rizzer_light.png' : '/images/Logo_Rizzer_dark.png'}
                alt="Rizzer"
                className="h-8 w-auto"
              />
            </div>
            <p>{uiText.footerRights}</p>
            <div className="flex items-center gap-3">
              <a
                href={portfolioLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--button)]"
                aria-label="LinkedIn"
              >
                <img src="/images/Linkedin.png" alt="LinkedIn" className="h-4 w-4 object-contain" />
              </a>
              <a
                href={portfolioLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--button)]"
                aria-label="Instagram"
              >
                <img src="/images/instagram.png" alt="Instagram" className="h-4 w-4 object-contain" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--button)]"
                aria-label="Twitter"
              >
                <img src="/images/twitter.png" alt="Twitter" className="h-4 w-4 object-contain" />
              </a>
              <a
                href={portfolioLinks.rizzerStudio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--button)]"
                aria-label="Site"
              >
                <img src="/images/site.png" alt="Site" className="h-4 w-4 object-contain" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
