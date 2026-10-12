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
  await row.locator('a[href="/projects#project-waterMirror"]').click()
  await page.waitForURL(`${baseUrl}/projects#project-waterMirror`)
  await page.locator('#project-waterMirror').waitFor()
  // 卡片可能比視窗高，確認頁面捲到卡片開頭即可
  await page.waitForFunction(() => {
    const { top } = document
      .querySelector('#project-waterMirror')
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
