import assert from 'node:assert/strict'
import { expect } from '@playwright/test'
import { baseUrl, test } from './fixtures.js'

test('desktop navigation reaches every page and marks the active tab', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  const nav = page.locator('header nav')
  for (const [label, path] of [
    ['關於我', '/about'],
    ['作品集', '/projects'],
    ['聯絡我', '/contact'],
    ['首頁', '/']
  ]) {
    await nav.getByRole('link', { name: label }).click()
    await page.waitForURL(`${baseUrl}${path}`)
    await page.locator('h1').first().waitFor()
    await expect(nav.locator('.item.is-active')).toHaveText(label)
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      'main-content'
    )
  }
  await context.close()
})

test('the top bar stays at the top while the page scrolls', async ({
  openPage
}) => {
  const scrolledAway = []
  for (const width of [1280, 390]) {
    const { context, page } = await openPage({
      viewport: { width, height: 800 }
    })
    await page.goto(`${baseUrl}/about`)
    await page.locator('h1').first().waitFor()
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    )
    const top = await page
      .locator('header')
      .evaluate(header => Math.round(header.getBoundingClientRect().top))
    if (top !== 0) scrolledAway.push(`${width}px: top ${top}`)
    await context.close()
  }
  assert.deepEqual(scrolledAway, [])
})

test('a link to a project card leaves the card below the top bar', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  await page
    .locator('section[aria-labelledby="home-cards-title"]')
    .getByRole('link', { name: '在作品集查看' })
    .first()
    .click()
  await page.waitForURL(`${baseUrl}/projects#project-federatedAqi`)
  await page.locator('#project-federatedAqi').waitFor()
  await page.waitForFunction(
    () =>
      document.querySelector('#project-federatedAqi').getBoundingClientRect()
        .top <
      window.innerHeight / 2
  )
  const [barBottom, cardTop] = await page.evaluate(() => [
    document.querySelector('header').getBoundingClientRect().bottom,
    document.querySelector('#project-federatedAqi').getBoundingClientRect().top
  ])
  assert.ok(
    cardTop >= barBottom,
    `card top ${cardTop}px is under the top bar (${barBottom}px)`
  )
  await context.close()
})

test('keyboard focus moving up the page stays clear of the top bar', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/about`)
  await page.locator('h1').first().waitFor()
  // 從頁尾往上按 Shift+Tab 直到回到頂部列，捲進畫面的元素不能被頂部列蓋住
  await page.locator('footer a').last().focus()
  const hidden = []
  for (let step = 0; step < 60; step += 1) {
    await page.keyboard.press('Shift+Tab')
    const found = await page.evaluate(() => {
      const element = document.activeElement
      const bar = document.querySelector('header')
      if (!element || element === document.body || bar.contains(element))
        return { done: true }
      const { top } = element.getBoundingClientRect()
      const barBottom = bar.getBoundingClientRect().bottom
      return top < barBottom - 1
        ? `${element.tagName} "${element.textContent.trim().slice(0, 30)}" top ${Math.round(top)} < ${Math.round(barBottom)}`
        : null
    })
    if (found?.done) break
    if (found) hidden.push(found)
  }
  assert.deepEqual(hidden, [])
  await context.close()
})

test('the active navigation tab is underlined in the KageRyo green', async ({
  openPage
}) => {
  for (const colorScheme of ['light', 'dark']) {
    const { context, page } = await openPage({ colorScheme })
    await page.goto(`${baseUrl}/about`)
    const active = page.locator('header nav .item.is-active')
    await active.waitFor()
    assert.equal(
      await active.evaluate(item => getComputedStyle(item).borderBottomColor),
      'rgb(176, 255, 48)'
    )
    await context.close()
  }
})

test('unknown routes render the not-found page', async ({ openPage }) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/does-not-exist`)
  await page.getByRole('link', { name: '回到首頁' }).waitFor()
  assert.match(await page.title(), /找不到頁面/)
  await context.close()
})

test('theme toggle overrides the OS preference and persists', async ({
  openPage
}) => {
  const { context, page } = await openPage({ colorScheme: 'dark' })
  await page.goto(baseUrl)
  const html = page.locator('html')
  assert.match(await html.getAttribute('class'), /is-dark/)
  await page.getByRole('button', { name: '切換到淺色模式' }).click()
  assert.match(await html.getAttribute('class'), /is-light/)
  await page.reload()
  await page.locator('h1').first().waitFor()
  assert.match(await html.getAttribute('class'), /is-light/)
  assert.equal(
    await page.evaluate(() => localStorage.getItem('themePreference')),
    'light'
  )
  await context.close()
})

test('focus rings show on keyboard-focused buttons but not around the main region', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  const mainOutline = () =>
    page.evaluate(() => {
      const main = document.querySelector('#main-content')
      return document.activeElement === main
        ? getComputedStyle(main).outlineStyle
        : 'main is not focused'
    })
  await page.goto(baseUrl)
  await page.locator('h1').first().waitFor()
  assert.equal(await mainOutline(), 'none')
  await page.locator('header nav').getByRole('link', { name: '關於我' }).click()
  await page.waitForURL(`${baseUrl}/about`)
  assert.equal(await mainOutline(), 'none')

  // 鍵盤操作的 TocasUI 按鈕要看得到焦點框（第一個是下載履歷按鈕）
  await page.keyboard.press('Tab')
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.activeElement).outlineStyle
    ),
    'solid'
  )
  await context.close()
})

test('mobile drawer traps focus, closes with Escape, and navigates', async ({
  openPage
}) => {
  const { context, page } = await openPage({
    viewport: { width: 390, height: 844 }
  })
  await page.goto(baseUrl)
  assert.equal(await page.locator('header nav').isVisible(), false)
  const menuButton = page.getByRole('button', { name: '導航欄' })
  await menuButton.click()
  assert.equal(await menuButton.getAttribute('aria-expanded'), 'true')
  const drawer = page.locator('#mobile-navigation')
  await page.waitForFunction(() =>
    document.activeElement?.closest('#mobile-navigation')
  )
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press('Tab')
    assert.ok(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest('#mobile-navigation'))
      ),
      'focus left the drawer'
    )
  }
  await page.keyboard.press('Escape')
  await page.waitForFunction(() =>
    document.querySelector('#mobile-navigation')?.hasAttribute('inert')
  )
  assert.equal(await menuButton.getAttribute('aria-expanded'), 'false')
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute('aria-controls')
    ),
    'mobile-navigation'
  )
  await menuButton.click()
  await drawer.getByRole('link', { name: '作品集' }).click()
  await page.waitForURL(`${baseUrl}/projects`)
  await page.waitForFunction(() =>
    document.querySelector('#mobile-navigation')?.hasAttribute('inert')
  )
  await context.close()
})

test('tablets show only the menu button and keep the top bar on one row', async ({
  openPage
}) => {
  const wrong = []
  for (const [width, menuOnly] of [
    [767, true],
    [768, true],
    [900, true],
    [1023, true],
    [1024, false]
  ]) {
    const { context, page } = await openPage({
      viewport: { width, height: 800 }
    })
    await page.goto(`${baseUrl}/about`)
    await page.locator('h1').first().waitFor()
    const shown = {
      tabs: await page.locator('header nav').isVisible(),
      menu: await page.getByRole('button', { name: '導航欄' }).isVisible(),
      height: await page
        .locator('header')
        .evaluate(header => header.getBoundingClientRect().height)
    }
    // 只能出現一種導覽，頂部列也不能被擠成兩行
    if (shown.tabs === menuOnly || shown.menu !== menuOnly || shown.height > 64)
      wrong.push(`${width}px ${JSON.stringify(shown)}`)
    await context.close()
  }
  assert.deepEqual(wrong, [])
})

test('pages fit a 390px mobile screen in every language', async ({
  openPage
}) => {
  const overflowing = []
  for (const locale of ['zh-TW', 'en', 'ja']) {
    const { context, page } = await openPage({
      viewport: { width: 390, height: 844 },
      storage: { locale }
    })
    for (const path of [
      '/',
      '/about',
      '/projects',
      '/contact',
      '/projects/kserve',
      '/projects/tag-twin'
    ]) {
      await page.goto(`${baseUrl}${path}`)
      await page.locator('h1').first().waitFor()
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth
      )
      if (width > 390) overflowing.push(`${locale} ${path}: ${width}px`)
    }
    await context.close()
  }
  assert.deepEqual(overflowing, [])
})

test('trailing-slash URLs settle on the canonical route', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  // GitHub Pages 會把 /projects 導向 /projects/
  await page.goto(`${baseUrl}/projects/`)
  await page.waitForURL(`${baseUrl}/projects`)
  await expect(page.locator('header nav .item.is-active')).toHaveText('作品集')
  await context.close()
})

test('page banners line up with the content below', async ({ openPage }) => {
  const misaligned = []
  for (const width of [1280, 1024, 390]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    for (const path of ['/projects', '/contact']) {
      await page.goto(`${baseUrl}${path}`)
      await page.locator('main h2').first().waitFor()
      const [title, heading] = await page.evaluate(() =>
        [
          document.querySelector('main h1'),
          document.querySelector('main h2')
        ].map(element => Math.round(element.getBoundingClientRect().left))
      )
      if (title !== heading)
        misaligned.push(`${width}px ${path}: ${title} vs ${heading}`)
    }
    await context.close()
  }
  assert.deepEqual(misaligned, [])
})
