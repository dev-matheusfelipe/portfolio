import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { portfolioLinks } from '../data/portfolio'

type ThemeMode = 'dark' | 'light'
type Language = 'pt' | 'en'

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
      <h2 className="font-['Poppins'] text-[44px] font-bold leading-[1.06] tracking-[-0.03em] text-[var(--text-title)]">
        {title}
      </h2>
      <p className="mt-1 bg-[var(--subtitle-gradient)] bg-clip-text text-sm text-transparent">{subtitle}</p>
    </div>
  )
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
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

          <button type="button" className="md:hidden inline-flex h-9 w-9 items-center justify-center" aria-label="Abrir menu">
            <img
              src={isLight ? '/images/menu-mobile-light.png' : '/images/menu-mobile-dark.png'}
              alt="Menu"
              className="h-6 w-6 object-contain"
            />
          </button>
        </div>
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

            <h1 className="mt-6 font-['Poppins'] text-[63px] font-bold leading-[1.02] tracking-[-0.06em] text-[var(--text-title)]">
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
          <h2 className="text-center font-['Poppins'] text-[56px] font-bold tracking-[-0.03em] text-[var(--text-title)]">
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
            <h3 className="font-['Poppins'] text-[58px] font-semibold leading-[0.95] tracking-[-0.03em] text-[var(--text-title)]">
              {uiText.footerTitleLine1}
              <br />
              {uiText.footerTitleLine2}
            </h3>

            <a
              href="mailto:matheus.f.basilio@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-gmail)] bg-[var(--surface)] px-5 py-3 text-[var(--text-title)]/85 hover:border-[var(--button)]"
            >
              <img src="/images/gmail-logo.png" alt="Gmail" className="h-4 w-4 object-contain" />
              matheus.f.basilio@gmail.com
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
