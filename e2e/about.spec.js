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
