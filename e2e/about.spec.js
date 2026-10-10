import assert from 'node:assert/strict'
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
      assert.equal(Math.round(first.top), Math.round(second.top))
      assert.ok(second.left >= first.right, 'education entries overlap')
    } else {
      assert.ok(second.top >= first.bottom, 'education entries overlap')
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
      assert.ok(detail.left >= role.right, 'details sit under the role')
      assert.ok(detail.top < role.bottom, 'details start below the role')
    } else {
      assert.ok(detail.top >= role.bottom, 'details overlap the role')
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
  assert.equal(Math.round(experience.left), Math.round(education.left))
  assert.equal(Math.round(experience.width), Math.round(education.width))
  await context.close()
})
