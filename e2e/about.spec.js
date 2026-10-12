import { expect } from '@playwright/test'
import { baseUrl, chooseLanguage, test } from './fixtures.js'

test('About certificates update in place across locales without mobile overflow', async ({
  openPage
}) => {
  const { context, page } = await openPage({
    viewport: { width: 390, height: 844 }
  })
  await page.goto(`${baseUrl}/about`)
  await page.locator('main h1').waitFor()
  await page.evaluate(() => {
    window.__certificatePageMarker = true
  })
  const rows = page.locator(
    'section[aria-labelledby="about-certificates"] tbody tr'
  )

  const nameCell = rows.nth(0).locator('td').nth(2)
  const levelCell = rows.nth(6).locator('td').nth(3)
  let previousName = await nameCell.innerText()
  let previousLevel = await levelCell.innerText()
  for (const locale of ['en', 'ja', 'zh-TW']) {
    await chooseLanguage(page, locale)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(nameCell).not.toHaveText(previousName)
    await expect(levelCell).not.toHaveText(previousLevel)
    previousName = await nameCell.innerText()
    previousLevel = await levelCell.innerText()
    expect(await page.evaluate(() => window.__certificatePageMarker)).toBe(true)
    await page.evaluate(() => document.fonts.ready)
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    }))
    expect(scrollWidth, `${locale} overflows at 390px`).toBeLessThanOrEqual(
      innerWidth
    )
  }
  await context.close()
})
