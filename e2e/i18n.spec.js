import { expect } from '@playwright/test'
import { baseUrl, chooseLanguage, localeFile, test } from './fixtures.js'

test('language selection translates the UI and persists after reload', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/about`)
  await chooseLanguage(page, 'en')
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.reload()
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  await page.getByRole('button', { name: /Language/ }).click()
  await expect(
    page.getByRole('menuitemradio', { name: 'English' })
  ).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('menuitemradio', { name: '日本語' }).click()
  await page
    .locator('header nav')
    .getByRole('link', { name: 'ホーム' })
    .waitFor()
  await context.close()
})

test('English and Japanese messages download only when chosen', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  const downloaded = []
  page.on('request', request => {
    const match = new URL(request.url()).pathname.match(localeFile)
    if (match) downloaded.push(match[1])
  })
  await page.goto(baseUrl)
  await page.locator('h1').first().waitFor()
  expect(downloaded).toEqual([])
  await chooseLanguage(page, 'en')
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  expect(downloaded).toEqual(['en'])
  await context.close()
})

test('choosing the current language records an explicit preference', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBeNull()
  await chooseLanguage(page, 'zh-TW')
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe(
    'zh-TW'
  )
  await context.close()
})

test('a language that fails to download leaves the page and the menu as they were', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await context.route(
    url => url.pathname.match(localeFile)?.[1] === 'en',
    route => route.abort()
  )
  await page.goto(`${baseUrl}/about`)
  await page.locator('h1').first().waitFor()
  await chooseLanguage(page, 'en')
  const failure = page.getByRole('alert')
  await expect(failure).toBeVisible()
  const failureBounds = await failure.boundingBox()
  expect(failureBounds.width).toBeGreaterThan(100)
  expect(failureBounds.height).toBeGreaterThanOrEqual(20)
  await expect(page.getByRole('button', { name: /語言/ })).toBeFocused()
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBeNull()
  await page.getByRole('button', { name: /語言/ }).click()
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toHaveAttribute('aria-checked', 'true')
  await expect(
    page.getByRole('menuitemradio', { name: 'English' })
  ).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('header nav .item.is-active')).toHaveText('關於我')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
  await context.close()
})

test('language menu supports keyboard navigation, Escape, Tab, and outside click', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  const trigger = page.getByRole('button', { name: /語言/ })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(
    page.getByRole('menuitemradio', { name: 'English' })
  ).toBeFocused()
  await page.keyboard.press('End')
  await expect(
    page.getByRole('menuitemradio', { name: '日本語' })
  ).toBeFocused()
  await page.keyboard.press('Home')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('ArrowUp')
  await expect(
    page.getByRole('menuitemradio', { name: '日本語' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await page.keyboard.press('Space')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await page.keyboard.press('ArrowDown')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(
    page.getByRole('menuitemradio', { name: 'English' })
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: /Language/ })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: /Language/ })).toHaveAttribute(
    'aria-expanded',
    'false'
  )
  await expect(page.locator('main a').first()).toBeFocused()
  await page.getByRole('button', { name: /Language/ }).click()
  await page.locator('main').click({ position: { x: 20, y: 20 } })
  await expect(page.getByRole('button', { name: /Language/ })).toHaveAttribute(
    'aria-expanded',
    'false'
  )
  await context.close()
})

test('language trigger and open menu fit mobile screens in every language', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const colorScheme of ['light', 'dark']) {
      const { page, context } = await openPage({
        viewport: { width: 320, height: 800 },
        storage: { locale },
        colorScheme
      })
      await page.goto(baseUrl)
      await expect(page.locator('h1').first()).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
      ).toBeLessThanOrEqual(320)
      await page.locator('.language-trigger').click()
      const menu = await page.getByRole('menu').boundingBox()
      expect(menu.x).toBeGreaterThanOrEqual(0)
      expect(menu.x + menu.width).toBeLessThanOrEqual(320)
      await expect(
        page.getByRole('menuitemradio', { checked: true })
      ).toBeFocused()
      await context.close()
    }
  }
})

test('initial route completion preserves a language menu interaction', async ({
  openPage
}) => {
  const { page, context } = await openPage()
  let releaseRoute
  const heldRoute = new Promise(resolve => {
    releaseRoute = resolve
  })
  await context.route('**/src/views/Home.vue', async route => {
    await heldRoute
    await route.continue()
  })
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  const trigger = page.locator('.language-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('menuitemradio', { name: '正體中文' })
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  releaseRoute()
  await expect(page.locator('h1').first()).toBeVisible()
  await expect(trigger).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(
    page.getByRole('menuitemradio', { name: '日本語' })
  ).toBeFocused()
})
