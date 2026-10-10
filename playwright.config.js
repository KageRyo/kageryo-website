import { defineConfig } from '@playwright/test'

const host = '127.0.0.1'
const port = 4175

export default defineConfig({
  testDir: 'e2e',
  // 部分測試會在同一個測試裡比較多種寬度與語系，給比預設更長的時間
  timeout: 60_000,
  fullyParallel: true,
  // CI 一次只跑一個，和原本的腳本一樣穩定；本機用 4 個平行加快速度，
  // 開太多（例如 10 個以上）時，抽屜與照片說明的測試偶爾會因為機器太忙而失敗
  workers: process.env.CI ? 1 : 4,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `node node_modules/vite/bin/vite.js --host ${host} --port ${port} --strictPort`,
    url: `http://${host}:${port}`,
    reuseExistingServer: !process.env.CI
  }
})
