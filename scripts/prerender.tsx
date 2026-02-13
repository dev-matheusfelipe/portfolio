import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App'

type RouteConfig = {
  route: string
  output: string
}

const distDir = path.resolve(process.cwd(), 'dist')
const templatePath = path.join(distDir, 'index.html')

const routes: RouteConfig[] = [
  { route: '/', output: 'index.html' },
  { route: '/portfolio/', output: path.join('portfolio', 'index.html') }
]

const injectMarkup = (template: string, html: string) => {
  return template.replace(/<div id="root"><\/div>/, `<div id="root">${html}</div>`)
}

const main = async () => {
  const template = await readFile(templatePath, 'utf-8')

  for (const entry of routes) {
    const appHtml = renderToString(React.createElement(App, { path: entry.route }))
    const pageHtml = injectMarkup(template, appHtml)
    const outputPath = path.join(distDir, entry.output)

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, pageHtml, 'utf-8')
  }

  console.log(`Prerender complete: ${routes.map((r) => r.route).join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
