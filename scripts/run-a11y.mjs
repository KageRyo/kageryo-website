import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const host = '127.0.0.1'
const port = 4174
const baseUrl = `http://${host}:${port}`
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', host, '--port', String(port), '--strictPort'], {
  stdio: 'inherit'
})

const waitForServer = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await delay(500)
  }
  throw new Error(`Vite did not become available at ${baseUrl}`)
}

try {
  await waitForServer()
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  const violations = []

  for (const path of ['/', '/about', '/projects', '/contact', '/projects/kserve', '/projects/tag-twin']) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' })
    await page.locator('h1').waitFor()
    const results = await new AxeBuilder({ page }).analyze()
    violations.push(...results.violations.map(violation => ({ path, violation })))
  }

  await browser.close()

  if (violations.length) {
    for (const { path, violation } of violations) {
      console.error(`${path}: ${violation.id} — ${violation.help}`)
      for (const node of violation.nodes) {
        console.error(`  ${node.target.join(', ')}`)
        console.error(`  ${node.failureSummary}`)
      }
    }
    process.exitCode = 1
  }
} finally {
  server.kill()
}
