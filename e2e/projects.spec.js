import { expect } from '@playwright/test'
import { baseUrl, repositories, test } from './fixtures.js'

test('GitHub archive tabs support keyboard selection and load each account', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  const requests = []
  page.on('request', request => {
    if (request.url().startsWith('https://api.github.com/'))
      requests.push(new URL(request.url()).pathname)
  })
  await page.goto(`${baseUrl}/projects`)
  const tabs = page.getByRole('tab')
  await page.getByRole('link', { name: 'KageRyo-repo', exact: true }).waitFor()
  await tabs.first().focus()
  await page.keyboard.press('ArrowRight')
  const selected = page.locator('[role="tab"][aria-selected="true"]')
  await expect(selected).toHaveText('CodeRyo')
  await expect(selected).toBeFocused()
  await expect(page.locator('[role="tabpanel"]')).toHaveAttribute(
    'id',
    await selected.getAttribute('aria-controls')
  )
  await page
    .getByRole('link', { name: 'CodeRyoStudio-repo', exact: true })
    .waitFor()
  await page.keyboard.press('End')
  await expect(selected).toHaveText('CodeRyoMC')
  await page
    .getByRole('link', { name: 'CodeRyoMC-repo', exact: true })
    .waitFor()
  await page.keyboard.press('Home')
  await expect(selected).toHaveText('KageRyo')
  expect(requests.toSorted((left, right) => left.localeCompare(right))).toEqual(
    [
      '/users/CodeRyoMC/repos',
      '/users/CodeRyoStudio/repos',
      '/users/KageRyo/repos'
    ]
  )
  await context.close()
})

test('KServe card opens its project detail page and unknown slugs show 404', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await page.goto(`${baseUrl}/projects`)
  await page
    .locator('#project-kserve')
    .getByRole('link', { name: '查看專案介紹' })
    .click()
  await page.waitForURL(`${baseUrl}/projects/kserve`)
  await page
    .getByRole('heading', { level: 1, name: 'KServe (CNCF) 開源貢獻' })
    .waitFor()
  await expect(page).toHaveTitle(/KServe/)
  await page.getByRole('link', { name: '回到作品集' }).click()
  await page.waitForURL(`${baseUrl}/projects`)

  await page.goto(`${baseUrl}/projects/not-a-project`)
  await page.getByRole('link', { name: '回到首頁' }).waitFor()
  await expect(page).toHaveURL(`${baseUrl}/projects/not-a-project`)
  await expect(page).toHaveTitle(/找不到頁面/)
  await context.close()
})

test('project detail URLs validate every slug and keep 作品集 active', async ({
  openPage
}) => {
  const desktop = await openPage()
  const { page } = desktop
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const navigate = path =>
    page.evaluate(
      target =>
        document
          .querySelector('#app')
          .__vue_app__.config.globalProperties.$router.push(target),
      path
    )

  for (const slug of ['constructor', 'toString', '__proto__']) {
    await page.goto(`${baseUrl}/projects/${slug}`)
    await page.getByRole('link', { name: '回到首頁' }).waitFor()
  }

  // 站內只換參數時同樣要檢查專案是否存在
  await page.goto(`${baseUrl}/projects/kserve`)
  await expect(page.locator('header nav .item.is-active')).toHaveText('作品集')
  await navigate('/projects/not-a-project')
  await page.getByRole('link', { name: '回到首頁' }).waitFor()
  await expect(page).toHaveTitle(/找不到頁面/)
  await navigate('/projects/kserve')
  await page
    .getByRole('heading', { level: 1, name: 'KServe (CNCF) 開源貢獻' })
    .waitFor()
  await expect(page).toHaveTitle(/KServe/)
  expect(errors).toEqual([])
  await desktop.context.close()

  const mobile = await openPage({
    viewport: { width: 390, height: 844 }
  })
  await mobile.page.goto(`${baseUrl}/projects/kserve`)
  await mobile.page.getByRole('button', { name: '導航欄' }).click()
  await expect(
    mobile.page.locator('#mobile-navigation .item.is-active')
  ).toHaveText('作品集')
  await mobile.context.close()
})

test('KServe architecture flow reads across on desktop and down on mobile', async ({
  openPage
}) => {
  for (const [width, across] of [
    [1280, true],
    [390, false]
  ]) {
    const { context, page } = await openPage({
      viewport: { width, height: 844 }
    })
    await page.goto(`${baseUrl}/projects/kserve`)
    await page.locator('h1').first().waitFor()
    const flows = await page
      .locator('.flow-steps')
      .evaluateAll(lists =>
        lists.map(list =>
          [...list.children].map(step => step.getBoundingClientRect().toJSON())
        )
      )
    expect(flows.length).toBe(3)
    for (const steps of flows) {
      for (let index = 1; index < steps.length; index += 1) {
        const [previous, current] = [steps[index - 1], steps[index]]
        if (across) {
          expect(Math.round(current.top)).toBe(Math.round(previous.top))
          expect(current.left, 'steps overlap').toBeGreaterThan(previous.right)
        } else {
          expect(current.top, 'steps overlap').toBeGreaterThan(previous.bottom)
        }
      }
    }
    await context.close()
  }
})

test('GitHub archive shows a retry state when the API is rate limited', async ({
  openPage
}) => {
  const { context, page } = await openPage()
  await context.route('https://api.github.com/users/*/repos*', route =>
    route.fulfill({ status: 403, json: { message: 'rate limited' } })
  )
  await page.goto(`${baseUrl}/projects`)
  await page.getByRole('alert').waitFor()
  await context.unroute('https://api.github.com/users/*/repos*')
  await context.route('https://api.github.com/users/*/repos*', route =>
    route.fulfill({ json: repositories('KageRyo') })
  )
  await page.getByRole('button', { name: '嘗試重新載入' }).click()
  await page.getByRole('link', { name: 'KageRyo-repo', exact: true }).waitFor()
  await context.close()
})

test('TAG-Twin card opens its project page with the expo photo', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.goto(`${baseUrl}/projects`)
  await page
    .locator('#project-tagTwin')
    .getByRole('link', { name: '查看專案介紹' })
    .click()
  await page.waitForURL(`${baseUrl}/projects/tag-twin`)
  await page
    .getByRole('heading', {
      level: 1,
      name: '智慧防災數位孿生系統（TAG-Twin）'
    })
    .waitFor()
  await expect(page).toHaveTitle(/TAG-Twin/)
  const photo = page.locator('section[aria-labelledby="project-media"] img')
  await photo.scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      photo.evaluate(image => image.complete && image.naturalWidth > 0)
    )
    .toBe(true)
})

test('TAG-Twin data flow reads down at every width so long steps do not break mid-word', async ({
  openPage
}) => {
  const across = []
  for (const width of [1280, 1024, 390]) {
    const { page } = await openPage({ viewport: { width, height: 900 } })
    await page.goto(`${baseUrl}/projects/tag-twin`)
    await page.locator('h1').first().waitFor()
    const steps = await page
      .locator('.flow-steps > li')
      .evaluateAll(items =>
        items.map(item => item.getBoundingClientRect().toJSON())
      )
    for (let index = 1; index < steps.length; index += 1) {
      if (steps[index].top <= steps[index - 1].bottom)
        across.push(`${width}px: step ${index + 1} sits beside step ${index}`)
    }
  }
  expect(across).toEqual([])
})

test('Federated AQI card opens a detail page that survives reload', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.goto(`${baseUrl}/projects`)
  await page
    .locator('#project-federatedAqi a[href="/projects/federated-aqi"]')
    .click()
  await page.waitForURL(`${baseUrl}/projects/federated-aqi`)
  await expect(page.locator('main h1')).toBeVisible()
  const title = await page.title()
  await page.reload()
  await expect(page).toHaveTitle(title)
  await expect(page.locator('.flow-steps > li')).toHaveCount(4)
  await expect(
    page.locator('section[aria-labelledby="project-media"] time')
  ).toHaveCount(2)
})

test('Federated AQI flow and media fit all languages, themes and widths', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const colorScheme of ['light', 'dark']) {
      for (const width of [390, 768, 1280]) {
        const { page, context } = await openPage({
          storage: { locale },
          colorScheme,
          viewport: { width, height: 900 }
        })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto(`${baseUrl}/projects/federated-aqi`)
        await expect(page.locator('.flow-steps > li')).toHaveCount(4)
        await page.evaluate(() => document.fonts.ready)
        const photo = page.locator(
          'section[aria-labelledby="project-media"] img'
        )
        await photo.scrollIntoViewIfNeeded()
        await expect
          .poll(() =>
            photo.evaluate(img => img.complete && img.naturalWidth > 0)
          )
          .toBe(true)
        const layout = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          steps: [...document.querySelectorAll('.flow-steps > li')].map(
            item => ({
              ...item.getBoundingClientRect().toJSON(),
              fits: item.scrollWidth <= item.clientWidth + 1
            })
          )
        }))
        expect(layout.width).toBeLessThanOrEqual(width)
        for (const [index, step] of layout.steps.entries()) {
          expect(step.fits).toBe(true)
          if (index)
            expect(step.top).toBeGreaterThan(layout.steps[index - 1].bottom)
        }
        expect(errors).toEqual([])
        await context.close()
      }
    }
  }
})

test('Environmental enforcement card opens a detail page that survives reload', async ({
  openPage
}) => {
  const { page } = await openPage()
  await page.goto(`${baseUrl}/projects`)
  await page
    .locator(
      '#project-environmentalEnforcement a[href="/projects/environmental-enforcement"]'
    )
    .click()
  await page.waitForURL(`${baseUrl}/projects/environmental-enforcement`)
  await expect(page.locator('main h1')).toBeVisible()
  const title = await page.title()
  await page.reload()
  await expect(page).toHaveTitle(title)
  await expect(page.locator('.flow-steps > li')).toHaveCount(5)
  await expect(
    page.locator('section[aria-labelledby="project-media"] time')
  ).toHaveCount(1)
})

test('Environmental enforcement flow and media fit all languages, themes and widths', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const colorScheme of ['light', 'dark']) {
      for (const width of [390, 768, 1280]) {
        const { page, context } = await openPage({
          storage: { locale },
          colorScheme,
          viewport: { width, height: 900 }
        })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto(`${baseUrl}/projects/environmental-enforcement`)
        await expect(page.locator('.flow-steps > li')).toHaveCount(5)
        await page.evaluate(() => document.fonts.ready)
        const photo = page.locator(
          'section[aria-labelledby="project-media"] img'
        )
        await photo.scrollIntoViewIfNeeded()
        await expect
          .poll(() =>
            photo.evaluate(img => img.complete && img.naturalWidth > 0)
          )
          .toBe(true)
        const layout = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          steps: [...document.querySelectorAll('.flow-steps > li')].map(
            item => ({
              ...item.getBoundingClientRect().toJSON(),
              fits: item.scrollWidth <= item.clientWidth + 1
            })
          )
        }))
        expect(layout.width).toBeLessThanOrEqual(width)
        for (const [index, step] of layout.steps.entries()) {
          expect(step.fits).toBe(true)
          if (index)
            expect(step.top).toBeGreaterThan(layout.steps[index - 1].bottom)
        }
        expect(errors).toEqual([])
        await context.close()
      }
    }
  }
})
