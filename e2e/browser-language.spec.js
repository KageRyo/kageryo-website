import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

for (const [browserLocale, expectedLocale] of [
  ['zh-CN', 'zh-TW'],
  ['zh-HK', 'zh-TW'],
  ['ja-JP', 'ja'],
  ['fr-FR', 'en']
]) {
  test(`first visit uses ${expectedLocale} for browser preference ${browserLocale}`, async ({
    openPage
  }) => {
    const { page } = await openPage({ browserLocale })
    const languages = []
    page.on('request', request => {
      const match = new URL(request.url()).pathname.match(
        /\/(zh-TW|en|ja)(?:\.js|-[\w-]+\.js)$/
      )
      if (match) languages.push(match[1])
    })
    await page.goto(baseUrl)
    await expect(page.locator('html')).toHaveAttribute('lang', expectedLocale)
    await expect(page.locator('h1').first()).toBeVisible()
    expect(languages).toEqual([expectedLocale])
    expect(await page.evaluate(() => localStorage.getItem('locale'))).toBeNull()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', expectedLocale)
  })
}

test('a saved manual choice takes priority over the browser preference', async ({
  openPage
}) => {
  const { page } = await openPage({
    browserLocale: 'ja-JP',
    storage: { locale: 'en' }
  })
  await page.goto(baseUrl)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('h1').first()).toBeVisible()
})
