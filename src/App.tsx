import Portfolio from './pages/Portfolio'

type AppProps = {
  path?: string
}

export default function App({ path }: AppProps) {
  const resolvedPath = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/')

  if (resolvedPath === '/portfolio' || resolvedPath === '/portfolio/' || resolvedPath === '/') {
    return <Portfolio />
  }

  return <Portfolio />
}
