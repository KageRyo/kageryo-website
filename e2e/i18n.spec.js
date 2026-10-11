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
  await expect(page.getByRole('alert')).toBeVisible()
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
