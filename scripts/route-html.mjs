// 以建置後的 index.html 為範本，替各路由產生帶有正確標題與描述的靜態頁，
// 讓 GitHub Pages 直接以 200 回應 /about 等路徑，爬蟲也能讀到對應的 meta
export const SITE_URL = 'https://kageryo.coderyo.com'

// 作品集以資料夾 index 提供，讓專案介紹頁可以放在 /projects/ 底下；
// 同時存在 projects.html 與 projects/ 時 GitHub Pages 的行為未明確定義
export const staticRoutes = [
  { path: '/about', key: 'about' },
  { path: '/projects/', key: 'projects' },
  { path: '/contact', key: 'contact' },
  { path: '/projects/kserve', key: 'kserveProject' },
  { path: '/projects/tag-twin', key: 'tagTwinProject' }
]

// 路徑對應到 dist 裡的檔案：結尾斜線為資料夾 index，其餘為同名 .html
export const routeFile = path =>
  path.endsWith('/') ? `${path.slice(1)}index.html` : `${path.slice(1)}.html`

const escapeHtml = value =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

// vue-i18n 以 {'|'} 表示字面上的特殊符號
export const toPlainText = message => message.replaceAll(/\{'(.)'\}/g, '$1')

const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`Missing tag in index.html: ${pattern}`)
  }
  return html.replace(pattern, replacement)
}

export const renderRouteHtml = (html, { title, description, url }) => {
  const safeTitle = escapeHtml(toPlainText(title))
  const safeDescription = escapeHtml(toPlainText(description))
  const safeUrl = escapeHtml(url)

  return [
    [/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`],
    [
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${safeDescription}">`
    ],
    [
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${safeTitle}">`
    ],
    [
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${safeDescription}">`
    ],
    [
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${safeUrl}">`
    ],
    [
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${safeUrl}">`
    ]
  ].reduce(
    (output, [pattern, replacement]) =>
      replaceTag(output, pattern, replacement),
    html
  )
}
