import assert from 'node:assert/strict'
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
  assert.equal(await selected.innerText(), 'CodeRyo')
  assert.equal(
    await selected.evaluate(element => element === document.activeElement),
    true
  )
  assert.equal(
    await page.locator('[role="tabpanel"]').getAttribute('id'),
    await selected.getAttribute('aria-controls')
  )
  await page
    .getByRole('link', { name: 'CodeRyoStudio-repo', exact: true })
    .waitFor()
  await page.keyboard.press('End')
  assert.equal(await selected.innerText(), 'CodeRyoMC')
  await page
    .getByRole('link', { name: 'CodeRyoMC-repo', exact: true })
    .waitFor()
  await page.keyboard.press('Home')
  assert.equal(await selected.innerText(), 'KageRyo')
  assert.deepEqual(
    requests.toSorted((left, right) => left.localeCompare(right)),
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
  await page.getByRole('link', { name: '查看專案介紹' }).click()
  await page.waitForURL(`${baseUrl}/projects/kserve`)
  await page
    .getByRole('heading', { level: 1, name: 'KServe (CNCF) 開源貢獻' })
    .waitFor()
  assert.match(await page.title(), /KServe/)
  await page.getByRole('link', { name: '回到作品集' }).click()
  await page.waitForURL(`${baseUrl}/projects`)

  await page.goto(`${baseUrl}/projects/not-a-project`)
  await page.getByRole('link', { name: '回到首頁' }).waitFor()
  assert.equal(page.url(), `${baseUrl}/projects/not-a-project`)
  assert.match(await page.title(), /找不到頁面/)
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
  assert.equal(
    await page.locator('header nav .item.is-active').innerText(),
    '作品集'
  )
  await navigate('/projects/not-a-project')
  await page.getByRole('link', { name: '回到首頁' }).waitFor()
  assert.match(await page.title(), /找不到頁面/)
  await navigate('/projects/kserve')
  await page
    .getByRole('heading', { level: 1, name: 'KServe (CNCF) 開源貢獻' })
    .waitFor()
  assert.match(await page.title(), /KServe/)
  assert.deepEqual(errors, [])
  await desktop.context.close()

  const mobile = await openPage({
    viewport: { width: 390, height: 844 }
  })
  await mobile.page.goto(`${baseUrl}/projects/kserve`)
  await mobile.page.getByRole('button', { name: '導航欄' }).click()
  assert.equal(
    (
      await mobile.page
        .locator('#mobile-navigation .item.is-active')
        .innerText()
    ).trim(),
    '作品集'
  )
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
    assert.equal(flows.length, 3)
    for (const steps of flows) {
      for (let index = 1; index < steps.length; index += 1) {
        const [previous, current] = [steps[index - 1], steps[index]]
        if (across) {
          assert.equal(Math.round(current.top), Math.round(previous.top))
          assert.ok(current.left > previous.right, 'steps overlap')
        } else {
          assert.ok(current.top > previous.bottom, 'steps overlap')
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
