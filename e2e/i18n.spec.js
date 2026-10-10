import assert from 'node:assert/strict'
import { baseUrl, localeFile, test } from './fixtures.js'

test('language selection translates the UI and persists after reload', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/about`)
  await page.locator('#language-select').selectOption('en')
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  assert.equal(await page.evaluate(() => document.documentElement.lang), 'en')
  await page.reload()
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  assert.equal(await page.locator('#language-select').inputValue(), 'en')
  await page.locator('#language-select').selectOption('ja')
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
  assert.deepEqual(downloaded, [])
  await page.locator('#language-select').selectOption('en')
  await page
    .locator('header nav')
    .getByRole('link', { name: 'About' })
    .waitFor()
  assert.deepEqual(downloaded, ['en'])
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
  await page.locator('#language-select').selectOption('en')
  await page.waitForFunction(
    () => document.querySelector('#language-select').value === 'zh-TW'
  )
  assert.equal(
    await page.locator('header nav .item.is-active').innerText(),
    '關於我'
  )
  assert.equal(
    await page.evaluate(() => document.documentElement.lang),
    'zh-TW'
  )
  await context.close()
})
