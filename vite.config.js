import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import zhTW from './src/locales/zh-TW.js'
import { renderRouteHtml, routeFile, SITE_URL, staticRoutes } from './scripts/route-html.mjs'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

const copyBuildFile = (sourcePath, destinationPath) => {
  const source = resolve(projectRoot, sourcePath)
  const destination = resolve(projectRoot, destinationPath)

  mkdirSync(dirname(destination), { recursive: true })
  copyFileSync(source, destination)
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-pages-files',
      writeBundle() {
        copyBuildFile('CNAME', 'dist/CNAME')
        copyBuildFile('.nojekyll', 'dist/.nojekyll')
        copyBuildFile('assets/img/og.jpg', 'dist/assets/img/og.jpg')
        copyBuildFile('dist/index.html', 'dist/404.html')

        // 為每個主要路由產生 about.html 等靜態頁，避免 GitHub Pages 以 404 狀態回應
        const indexHtml = readFileSync(resolve(projectRoot, 'dist/index.html'), 'utf8')
        for (const { path, key } of staticRoutes) {
          const html = renderRouteHtml(indexHtml, {
            title: zhTW.meta[key].title,
            description: zhTW.meta[key].description,
            url: `${SITE_URL}${path}`
          })
          const file = resolve(projectRoot, 'dist', routeFile(path))
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(file, html)
        }
      }
    }
  ],
  base: '/', // 自訂網域使用根路徑
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // e2e/*.spec.js 由 Playwright 執行，Vitest 不要收進單元測試
  test: {
    exclude: ['**/node_modules/**', '**/.git/**', 'e2e/**']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
