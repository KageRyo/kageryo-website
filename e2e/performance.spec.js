import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

test('pages render icons without downloading full CDN icon fonts', async ({
  openPage
}) => {
  const { page } = await openPage()
  const fullFonts = []
  page.on('request', request => {
    if (/cdnjs\.cloudflare\.com\/.*\/fonts\/icons\//.test(request.url()))
      fullFonts.push(request.url())
  })
  for (const path of [
    '/',
    '/about',
    '/projects',
    '/contact',
    '/projects/kserve'
  ]) {
    await page.goto(`${baseUrl}${path}`)
    await page.locator('main h1').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
  }
  expect(fullFonts).toEqual([])
})

test('inactive highlight photos wait until needed and still load on navigation', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const photos = []
  page.on('request', request => {
    if (
      request.resourceType() === 'image' &&
      /\/(ministry-of-education|coscup-lightingtalk)[^/]*\.webp/.test(
        request.url()
      )
    )
      photos.push(request.url())
  })
  await page.goto(baseUrl)
  const region = page.getByRole('region', { name: '精選紀錄' })
  const first = region.getByRole('img')
  await expect(first).toBeVisible()
  await expect
    .poll(() => first.evaluate(img => img.complete && img.naturalWidth > 0))
    .toBe(true)
  expect(photos).toEqual([])
  await region.getByRole('button', { name: '下一張' }).click()
  await expect
    .poll(() =>
      region
        .getByRole('img')
        .evaluate(img => img.complete && img.naturalWidth > 0)
    )
    .toBe(true)
})

test('offscreen carousels and background tabs avoid activity photo downloads', async ({
  openPage
}) => {
  for (const mode of ['offscreen', 'background']) {
    const { page, context } = await openPage({
      viewport: { width: 390, height: 844 }
    })
    const photos = []
    page.on('request', request => {
      if (
        request.resourceType() === 'image' &&
        /\/(ministry-of-education|coscup-lightingtalk)[^/]*\.webp/.test(
          request.url()
        )
      )
        photos.push(request.url())
    })
    await page.clock.install()
    await page.goto(baseUrl)
    const region = page.getByRole('region', { name: '精選紀錄' })
    await region.scrollIntoViewIfNeeded()
    await expect(region).toBeInViewport()
    await page.clock.pauseAt(new Date(Date.now() + 1000))
    if (mode === 'offscreen') {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await expect(region).not.toBeInViewport()
    } else {
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          value: true
        })
        document.dispatchEvent(new Event('visibilitychange'))
      })
    }
    await page.clock.runFor(11000)
    expect(photos, mode).toEqual([])
    if (mode === 'offscreen') {
      await region.scrollIntoViewIfNeeded()
      await expect(region).toBeInViewport()
      await expect
        .poll(() =>
          region
            .getByRole('img')
            .evaluate(img => img.complete && img.naturalWidth > 0)
        )
        .toBe(true)
    }
    await context.close()
  }
})

// Noto Sans TC 換上前，文字先用備用字型排版；兩者字寬差太多時，整頁會在字型換上的那一刻重新換行往下推
test('swapping in the web font does not shift the projects page', async ({
  openPage
}) => {
  const { context, page } = await openPage({
    viewport: { width: 412, height: 823 },
    browserLocale: 'en-US'
  })
  let releaseFonts
  const fontsHeld = new Promise(resolve => (releaseFonts = resolve))
  await context.route('https://fonts.gstatic.com/**', async route => {
    await fontsHeld
    await route.continue()
  })

  await page.goto(`${baseUrl}/projects`)
  await page.locator('#project-kserve').waitFor()
  await page.evaluate(() => {
    window.fontSwapShift = 0
    new PerformanceObserver(list => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.fontSwapShift += entry.value
    }).observe({ type: 'layout-shift' })
  })

  releaseFonts()
  await page.evaluate(() => document.fonts.ready)
  const notoLoaded = await page.evaluate(() =>
    [...document.fonts].some(
      face => /noto sans tc/i.test(face.family) && face.status === 'loaded'
    )
  )
  test.skip(!notoLoaded, 'Google Fonts is unreachable')
  // 等兩個畫格，讓換字型後的版面位移都記錄下來
  await page.evaluate(
    () =>
      new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  )
  expect(await page.evaluate(() => window.fontSwapShift)).toBeLessThan(0.02)
})

// 頁面元件是延遲載入的；元件到之前，頁尾不能先出現在畫面底部、再被內容推下去
test('the footer does not jump when the first page loads', async ({
  openPage
}) => {
  const { context, page } = await openPage({
    viewport: { width: 412, height: 823 }
  })
  await context.route('https://fonts.gstatic.com/**', route => route.abort())
  await page.addInitScript(() => {
    window.firstLoadShift = 0
    new PerformanceObserver(list => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.firstLoadShift += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
  })
  let releaseView
  const viewHeld = new Promise(resolve => (releaseView = resolve))
  await context.route(/\/src\/views\/Projects\.vue/, async route => {
    await viewHeld
    await route.continue()
  })

  await page.goto(`${baseUrl}/projects`, { waitUntil: 'commit' })
  await page.locator('header').first().waitFor()
  releaseView()
  await page.locator('#project-kserve').waitFor()
  await page.evaluate(
    () =>
      new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  )
  expect(await page.evaluate(() => window.firstLoadShift)).toBeLessThan(0.01)
})

// 圖片宣告了 width/height，載入前就該照比例佔好位置，載入時下面的內容才不會被推動
test('images keep their space before they load', async ({ openPage }) => {
  const { context, page } = await openPage({
    viewport: { width: 412, height: 823 }
  })
  // 只攔圖片本身；開發伺服器以 JS 模組匯入圖片網址，那些請求照常放行
  await context.route('**/*', route =>
    route.request().resourceType() === 'image' ? undefined : route.continue()
  )
  for (const path of ['/about', '/projects', '/projects/tag-twin']) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' })
    await page.locator('main img[width]').first().waitFor({ state: 'attached' })
    const collapsed = await page
      .locator('main img[width]')
      .evaluateAll(images =>
        images
          .filter(image => {
            const { width, height } = image.getBoundingClientRect()
            return width === 0 || height === 0
          })
          .map(image => image.getAttribute('src'))
      )
    expect(collapsed, path).toEqual([])
  }
})
