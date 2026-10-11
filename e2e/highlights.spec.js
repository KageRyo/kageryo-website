import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

const carousel = page => page.getByRole('region', { name: '精選紀錄' })
const activeSlide = page => carousel(page).getByRole('group')

test('highlights cycle with buttons while keeping focus and only the active source available', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.goto(baseUrl)
  const region = carousel(page)
  await expect(region).toBeVisible()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await expect(region.getByRole('img')).toHaveCount(1)
  await expect(region.getByRole('link')).toHaveCount(0)
  const next = region.getByRole('button', { name: '下一張' })
  await next.focus()
  await page.keyboard.press('Enter')
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  await expect(next).toBeFocused()
  await expect(region.getByRole('link')).toHaveAttribute(
    'href',
    'https://www.edu.tw/News_Content.aspx?n=9E7AC85F1954DDA8&s=BB1CB6531ABFD661'
  )
  await next.click()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '3 / 3')
  await expect(region.getByRole('link')).toHaveAttribute(
    'href',
    'https://coscup.org/2023/zh-TW/'
  )
  await next.click()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await region.getByRole('button', { name: '上一張' }).click()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '3 / 3')
  await region.getByRole('button', { name: '顯示第 2 張' }).click()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  await expect(
    region.getByRole('button', { name: '顯示第 2 張' })
  ).toHaveAttribute('aria-current', 'true')
})

test('highlights rotate every eight seconds and pause for pointer, focus and explicit pause', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.clock.install()
  await page.goto(baseUrl)
  const region = carousel(page)
  await expect(region).toBeVisible()
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  await region.hover()
  await page.mouse.move(0, 0)
  await page.clock.runFor(7999)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await page.clock.runFor(1)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  await region.hover()
  await page.clock.runFor(16000)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  await page.mouse.move(0, 0)
  const next = region.getByRole('button', { name: '下一張' })
  await next.focus()
  await page.clock.runFor(16000)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  await next.press('Enter')
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '3 / 3')
  await page.getByRole('heading', { level: 1 }).click()
  await page.mouse.move(0, 0)
  await page.clock.runFor(7999)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '3 / 3')
  await page.clock.runFor(1)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await region.getByRole('button', { name: '暫停輪播' }).click()
  await page.getByRole('heading', { level: 1 }).click()
  await page.mouse.move(0, 0)
  await page.clock.runFor(16000)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await expect(region.getByRole('button', { name: '播放輪播' })).toBeVisible()
})

test('reduced motion starts paused and manual navigation still works', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto(baseUrl)
  const region = carousel(page)
  await expect(region.getByRole('button', { name: '播放輪播' })).toBeVisible()
  await page.clock.runFor(24000)
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '1 / 3')
  await region.getByRole('button', { name: '下一張' }).click()
  await expect(activeSlide(page)).toHaveAttribute('aria-label', '2 / 3')
  expect(
    parseFloat(
      await region
        .locator('.highlight-slide')
        .first()
        .evaluate(element => getComputedStyle(element).transitionDuration)
    )
  ).toBeLessThanOrEqual(0.0001)
})

for (const locale of ['zh-TW', 'en', 'ja']) {
  for (const colorScheme of ['light', 'dark']) {
    test(`highlights fit all viewport widths in ${locale}, ${colorScheme}`, async ({
      openPage
    }) => {
      for (const width of [320, 390, 768, 1024, 1280, 1440]) {
        const { page, context } = await openPage({
          viewport: { width, height: 900 },
          storage: { locale },
          colorScheme
        })
        await page.goto(baseUrl)
        const region = page.locator('.highlights-carousel')
        await region.hover()
        await page.evaluate(() => document.fonts.ready)
        const before = await region.boundingBox()
        for (let index = 0; index < 3; index += 1) {
          await region.locator('.highlight-dot').nth(index).click()
          const image = region.getByRole('img')
          await expect
            .poll(() =>
              image.evaluate(
                element => element.complete && element.naturalWidth > 0
              )
            )
            .toBe(true)
          const layout = await page.evaluate(() => {
            const region = document.querySelector('.highlights-carousel')
            const slide = region.querySelector('.highlight-slide.is-active')
            const media = slide
              .querySelector('.highlight-media')
              .getBoundingClientRect()
            const image = slide.querySelector('img').getBoundingClientRect()
            const intro = document
              .querySelector('.hero-intro')
              .getBoundingClientRect()
            const visual = document
              .querySelector('.hero-visual')
              .getBoundingClientRect()
            return {
              media: media.toJSON(),
              image: image.toJSON(),
              intro: intro.toJSON(),
              visual: visual.toJSON(),
              height: region.getBoundingClientRect().height,
              captionTop: slide
                .querySelector('.highlight-caption')
                .getBoundingClientRect().top,
              viewportWidth: window.innerWidth,
              pageWidth: document.documentElement.scrollWidth,
              controlsInside: [...region.querySelectorAll('button')].every(
                button => {
                  const box = button.getBoundingClientRect()
                  return (
                    box.width >= 44 &&
                    box.height >= 44 &&
                    box.left >= 0 &&
                    box.right <= window.innerWidth
                  )
                }
              )
            }
          })
          expect(layout.media.width).toBeGreaterThan(250)
          expect(layout.media.width / layout.media.height).toBeCloseTo(
            16 / 9,
            2
          )
          expect(layout.image.height).toBeCloseTo(layout.media.height, 1)
          expect(layout.captionTop).toBeGreaterThanOrEqual(layout.media.bottom)
          expect(layout.height).toBeCloseTo(before.height, 1)
          expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth)
          expect(layout.controlsInside).toBe(true)
          if (width >= 1200)
            expect(layout.visual.right).toBeLessThan(layout.intro.left)
          else
            expect(layout.intro.bottom).toBeLessThanOrEqual(layout.visual.top)
        }
        await context.close()
      }
    })
  }
}

test('loads the brand image before preloading the activity photos', async ({
  openPage
}) => {
  const { page, context } = await openPage()
  let releaseBrand
  const heldBrand = new Promise(resolve => {
    releaseBrand = resolve
  })
  const imageRequests = []
  await context.route('**/assets/img/*.webp*', async route => {
    if (route.request().resourceType() === 'image') {
      const name = new URL(route.request().url()).pathname.split('/').pop()
      imageRequests.push(name)
      if (name === 'card.webp') await heldBrand
    }
    await route.continue()
  })
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await expect(carousel(page)).toBeVisible()
  await expect.poll(() => imageRequests.includes('card.webp')).toBe(true)
  expect(imageRequests).not.toContain('ministry-of-education.webp')
  expect(imageRequests).not.toContain('coscup-lightingtalk.webp')
  releaseBrand()
  await expect
    .poll(
      () =>
        imageRequests.includes('ministry-of-education.webp') &&
        imageRequests.includes('coscup-lightingtalk.webp')
    )
    .toBe(true)
})
