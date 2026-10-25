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
