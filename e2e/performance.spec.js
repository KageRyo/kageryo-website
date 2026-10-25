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
  for (const path of ['/', '/about', '/projects', '/contact']) {
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
