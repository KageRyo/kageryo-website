import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

test('About lays education side by side on desktop and stacks it on mobile', async ({
  openPage
}) => {
  for (const [width, sideBySide] of [
    [1280, true],
    [390, false]
  ]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    await page.goto(`${baseUrl}/about`)
    await page.locator('h1').first().waitFor()
    const [first, second] = await page
      .locator('.education-list > li')
      .evaluateAll(items =>
        items.map(item => item.getBoundingClientRect().toJSON())
      )
    if (sideBySide) {
      expect(Math.round(first.top)).toBe(Math.round(second.top))
      expect(second.left, 'education entries overlap').toBeGreaterThanOrEqual(
        first.right
      )
    } else {
      expect(second.top, 'education entries overlap').toBeGreaterThanOrEqual(
        first.bottom
      )
    }
    await context.close()
  }
})

test('About experience puts the role details beside the role on desktop', async ({
  openPage
}) => {
  for (const [width, beside] of [
    [1280, true],
    [390, false]
  ]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    await page.goto(`${baseUrl}/about`)
    await page.locator('h1').first().waitFor()
    const [role, detail] = await Promise.all(
      ['.experience-entry h3', '.experience-entry .entry-detail'].map(
        selector =>
          page
            .locator(selector)
            .first()
            .evaluate(element => element.getBoundingClientRect().toJSON())
      )
    )
    if (beside) {
      expect(detail.left, 'details sit under the role').toBeGreaterThanOrEqual(
        role.right
      )
      expect(detail.top, 'details start below the role').toBeLessThan(
        role.bottom
      )
    } else {
      expect(detail.top, 'details overlap the role').toBeGreaterThanOrEqual(
        role.bottom
      )
    }
    await context.close()
  }
})

test('About experience rows use the full content width', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/about`)
  await page.locator('h1').first().waitFor()
  const [education, experience] = await Promise.all(
    ['.education-list', '.experience-list'].map(selector =>
      page
        .locator(selector)
        .evaluate(element => element.getBoundingClientRect().toJSON())
    )
  )
  expect(Math.round(experience.left)).toBe(Math.round(education.left))
  expect(Math.round(experience.width)).toBe(Math.round(education.width))
  await context.close()
})

test('experience logos fit the existing rows without moving or covering their text', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const width of [1280, 768, 390, 320]) {
      for (const colorScheme of ['light', 'dark']) {
        const { context, page } = await openPage({
          viewport: { width, height: 900 },
          storage: { locale },
          colorScheme
        })
        await page.goto(`${baseUrl}/about`)
        await page.locator('main h1').waitFor()
        await page.evaluate(() => document.fonts.ready)
        const logos = page.locator('.experience-list img')
        await expect(logos).toHaveCount(5)
        for (const logo of await logos.all()) {
          await logo.scrollIntoViewIfNeeded()
          await expect
            .poll(() =>
              logo.evaluate(image => image.complete && image.naturalWidth > 0)
            )
            .toBe(true)
          await expect(logo).toHaveAttribute('alt', '')
        }
        const inspect = () =>
          page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            boxes: [
              ...document.querySelectorAll(
                '.experience-entry, .experience-entry h3, .experience-entry .entry-detail'
              )
            ].map(element => {
              const { x, y, width, height } = element.getBoundingClientRect()
              return { x, y, width, height }
            })
          }))
        const withLogos = await inspect()
        const hidden = await page.addStyleTag({
          content: '.experience-list img { display: none !important; }'
        })
        expect(
          await inspect(),
          `${locale} ${width}px ${colorScheme}: layout moved`
        ).toEqual(withLogos)
        await hidden.evaluate(element => element.remove())
        const overlaps = await page
          .locator('.experience-entry')
          .evaluateAll(entries => {
            const intersects = (a, b) =>
              a.left < b.right &&
              a.right > b.left &&
              a.top < b.bottom &&
              a.bottom > b.top
            return entries.flatMap((entry, index) => {
              const row = entry.getBoundingClientRect()
              const text = [
                ...entry.querySelectorAll(
                  '.experience-date, h3, .ts-text.is-secondary, .entry-links, .entry-detail'
                )
              ].map(element => element.getBoundingClientRect())
              const logos = [...entry.querySelectorAll('img')].map(element =>
                element.getBoundingClientRect()
              )
              return logos.some(
                (logo, position) =>
                  logo.left < row.left ||
                  logo.right > row.right ||
                  logo.top < row.top ||
                  logo.bottom > row.bottom ||
                  text.some(box => intersects(logo, box)) ||
                  logos
                    .slice(position + 1)
                    .some(other => intersects(logo, other))
              )
                ? [index]
                : []
            })
          })
        expect(
          overlaps,
          `${locale} ${width}px ${colorScheme}: logos cover content`
        ).toEqual([])
        await context.close()
      }
    }
  }
})
