import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

test('home card row leads to project pages and cards', async ({ openPage }) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  const row = page.locator('section[aria-labelledby="home-cards-title"]')
  await row.getByRole('link', { name: '查看專案介紹' }).first().click()
  await page.waitForURL(`${baseUrl}/projects/kserve`)
  await page.getByRole('heading', { level: 1 }).waitFor()

  await page.goto(baseUrl)
  await row.getByRole('link', { name: '在作品集查看' }).first().click()
  await page.waitForURL(`${baseUrl}/projects#project-federatedAqi`)
  await page.locator('#project-federatedAqi').waitFor()
  // 卡片可能比視窗高，確認頁面捲到卡片開頭即可
  await page.waitForFunction(() => {
    const { top } = document
      .querySelector('#project-federatedAqi')
      .getBoundingClientRect()
    return top >= 0 && top < window.innerHeight / 2
  })
  await context.close()
})

test('home card row scrolls sideways with its previous and next buttons', async ({
  openPage
}) => {
  for (const width of [1280, 390]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    await page.goto(baseUrl)
    const row = page.locator('section[aria-labelledby="home-cards-title"]')
    const previous = row.getByRole('button', { name: '上一張' })
    const next = row.getByRole('button', { name: '下一張' })
    const track = page.locator('#home-card-track')
    await track.scrollIntoViewIfNeeded()
    await expect(previous, `${width}px: previous`).toBeDisabled()
    await expect(next, `${width}px: next`).not.toBeDisabled()

    // 一路按「下一張」到底，最後一張卡片要完整出現
    for (let step = 0; step < 10 && !(await next.isDisabled()); step += 1) {
      await next.click()
      await page.waitForTimeout(400)
    }
    await expect(next, `${width}px: never reached the end`).toBeDisabled()
    await expect(previous, `${width}px: previous`).not.toBeDisabled()
    const [trackBox, lastBox] = await Promise.all([
      track.evaluate(element => element.getBoundingClientRect().toJSON()),
      track
        .locator('.card-slide')
        .last()
        .evaluate(element => element.getBoundingClientRect().toJSON())
    ])
    expect(
      lastBox.right <= trackBox.right + 1 && lastBox.left >= trackBox.left - 1,
      `${width}px: last card is cut off`
    ).toBeTruthy()
    await context.close()
  }
})

test('home sections share one left edge', async ({ openPage }) => {
  const misaligned = []
  for (const width of [1280, 1024, 390]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    await page.goto(baseUrl)
    await page.locator('h1').first().waitFor()
    const edges = await page.evaluate(() =>
      Object.fromEntries(
        [
          ['highlights', '.hero-visual'],
          ['cards', '#home-card-track']
        ].map(([name, selector]) => [
          name,
          Math.round(
            document.querySelector(selector).getBoundingClientRect().left
          )
        ])
      )
    )
    if (new Set(Object.values(edges)).size > 1)
      misaligned.push(`${width}px ${JSON.stringify(edges)}`)
    await context.close()
  }
  expect(misaligned).toEqual([])
})

test('home introduction places highlights beside the greeting on desktop and after it on smaller screens', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const width of [1280, 1024, 390]) {
      const { context, page } = await openPage({
        viewport: { width, height: 900 },
        storage: { locale }
      })
      await page.goto(baseUrl)
      await page.locator('h1').first().waitFor()
      const [visual, intro] = await Promise.all(
        ['.hero-visual', '.hero-intro'].map(selector =>
          page
            .locator(selector)
            .evaluate(element => element.getBoundingClientRect().toJSON())
        )
      )
      const where = `${locale} ${width}px`
      if (width >= 1200) {
        // 寬螢幕並排：插圖與聯絡方式垂直置中，上下留白各不超過 120px（原本下方一整塊 232px）
        expect(visual.right, `${where}: not side by side`).toBeLessThan(
          intro.left
        )
        const above = visual.top - intro.top
        const below = intro.bottom - visual.bottom
        expect(
          Math.abs(above - below),
          `${where}: not centered`
        ).toBeLessThanOrEqual(3)
        expect(
          below,
          `${where}: ${Math.round(below)}px empty under the illustration`
        ).toBeLessThanOrEqual(120)
      } else {
        expect(
          visual.top,
          `${where}: introduction is not first`
        ).toBeGreaterThanOrEqual(intro.bottom)
      }
      await context.close()
    }
  }
})

test('photos scale to their containers on desktop and mobile', async ({
  openPage
}) => {
  const oversized = []
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 }
  ]) {
    const { context, page } = await openPage({ viewport })
    for (const path of ['/', '/about']) {
      await page.goto(`${baseUrl}${path}`)
      await page.locator('h1').first().waitFor()
      const found = await page.$$eval('.ts-image img', images =>
        images
          .filter(
            image =>
              image.getBoundingClientRect().width >
              image.parentElement.getBoundingClientRect().width + 1
          )
          .map(image => image.getAttribute('src'))
      )
      oversized.push(...found.map(src => `${viewport.width}px ${path} ${src}`))
    }
    await context.close()
  }
  expect(oversized).toEqual([])
})

test('highlight captions fit inside the bottom of the images without moving the page', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const width of [1280, 390]) {
      const { context, page } = await openPage({
        viewport: { width, height: 844 },
        storage: { locale }
      })
      await page.goto(baseUrl)
      await page.locator('h1').first().waitFor()
      await page.evaluate(() => document.fonts.ready)
      const highlights = page.locator('.highlights-carousel')
      await highlights.hover()
      const height = await highlights.evaluate(
        element => element.getBoundingClientRect().height
      )
      for (let index = 0; index < 3; index += 1) {
        await highlights.locator('.highlight-dot').nth(index).click()
        const { media, caption, currentHeight } = await highlights.evaluate(
          element => {
            const slide = element.querySelector('.highlight-slide.is-active')
            return {
              media: slide
                .querySelector('.highlight-media')
                .getBoundingClientRect()
                .toJSON(),
              caption:
                slide
                  .querySelector('.highlight-caption')
                  ?.getBoundingClientRect()
                  .toJSON() ?? null,
              currentHeight: element.getBoundingClientRect().height
            }
          }
        )
        if (index === 0) expect(caption).toBeNull()
        else {
          expect(
            caption.top,
            `${locale} ${width}px: caption leaves image`
          ).toBeGreaterThanOrEqual(media.top)
          expect(caption.bottom).toBeCloseTo(media.bottom, 1)
          expect(
            caption.height,
            `${locale} ${width}px: caption hides too much of the photo`
          ).toBeLessThanOrEqual(media.height * 0.6)
        }
        expect(
          currentHeight,
          `${locale} ${width}px: changing slide moves page`
        ).toBe(height)
      }
      await context.close()
    }
  }
})

test('photos load when scrolled into view', async ({ openPage }) => {
  const { context, page } = await openPage()
  for (const path of ['/', '/about']) {
    await page.goto(`${baseUrl}${path}`)
    await page.locator('h1').first().waitFor()
    for (const image of await page.locator('.ts-image img:visible').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(
          () =>
            image.evaluate(
              element => element.complete && element.naturalWidth > 0
            ),
          {
            message: `${path}: ${await image.getAttribute('src')} did not load`
          }
        )
        .toBe(true)
    }
  }
  await context.close()
})
