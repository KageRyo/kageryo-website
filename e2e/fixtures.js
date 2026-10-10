import { test as base } from '@playwright/test'

// 與 playwright.config.js 的 webServer 相同
export const baseUrl = 'http://127.0.0.1:4175'

// 開發伺服器是 /src/locales/en.js，正式建置是 /assets/en-<hash>.js
export const localeFile = /\/(en|ja)(?:\.js|-[\w-]+\.js)$/

// GitHub API 以固定資料回應，避免測試受速率限制影響
export const repositories = account => [
  {
    id: 1,
    name: `${account}-repo`,
    description: `Repository of ${account}`,
    html_url: `https://github.com/${account}/${account}-repo`,
    updated_at: '2026-01-01T00:00:00Z',
    fork: false,
    archived: false,
    private: false
  }
]

// openPage 開一個新的瀏覽器環境，可以指定視窗大小、深淺色與預先存好的 localStorage；
// 一個測試可以開好幾個（例如比較桌機與手機），測試結束後自動關閉
export const test = base.extend({
  openPage: async ({ browser }, use) => {
    const contexts = []
    await use(
      async ({
        viewport = { width: 1280, height: 800 },
        storage = {},
        colorScheme = 'light'
      } = {}) => {
        const context = await browser.newContext({ viewport, colorScheme })
        contexts.push(context)
        await context.addInitScript(values => {
          for (const [key, value] of Object.entries(values)) {
            if (localStorage.getItem(key) === null)
              localStorage.setItem(key, value)
          }
        }, storage)
        await context.route('https://api.github.com/users/*/repos*', route => {
          const account = new URL(route.request().url()).pathname.split('/')[2]
          return route.fulfill({ json: repositories(account) })
        })
        const page = await context.newPage()
        return { context, page }
      }
    )
    await Promise.all(contexts.map(context => context.close()))
  }
})
