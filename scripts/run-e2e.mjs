import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

const host = '127.0.0.1'
const port = 4175
const baseUrl = `http://${host}:${port}`
const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    '--host',
    host,
    '--port',
    String(port),
    '--strictPort'
  ],
  {
    stdio: 'inherit'
  }
)

const waitForServer = async () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // Vite is still starting.
    }
    await delay(500)
  }
  throw new Error(`Vite did not become available at ${baseUrl}`)
}

// GitHub API 以固定資料回應，避免測試受速率限制影響
const repositories = account => [
  {
    id: 1,
    name: `${account}-repo`,
    description: `Repository of ${account}`,
    html_url: `https://github.com/${account}/${account}-repo`,
    updated_at: '2026-01-01T00:00:00Z',
    fork: false,
    archived: false,
    private: false
  }
]

// 開發伺服器是 /src/locales/en.js，正式建置是 /assets/en-<hash>.js
const localeFile = /\/(en|ja)(?:\.js|-[\w-]+\.js)$/

const newPage = async (
  browser,
  {
    viewport = { width: 1280, height: 800 },
    storage = {},
    colorScheme = 'light'
  } = {}
) => {
  const context = await browser.newContext({ viewport, colorScheme })
  await context.addInitScript(values => {
    for (const [key, value] of Object.entries(values)) {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, value)
    }
  }, storage)
  await context.route('https://api.github.com/users/*/repos*', route => {
    const account = new URL(route.request().url()).pathname.split('/')[2]
    return route.fulfill({ json: repositories(account) })
  })
  const page = await context.newPage()
  return { context, page }
}

const tests = {
  async 'desktop navigation reaches every page and marks the active tab'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
      assert.equal(await nav.locator('.item.is-active').innerText(), label)
      assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        'main-content'
      )
    }
    await context.close()
  },

  async 'the active navigation tab is underlined in the KageRyo green'(
    browser
  ) {
    for (const colorScheme of ['light', 'dark']) {
      const { context, page } = await newPage(browser, { colorScheme })
      await page.goto(`${baseUrl}/about`)
      const active = page.locator('header nav .item.is-active')
      await active.waitFor()
      assert.equal(
        await active.evaluate(item => getComputedStyle(item).borderBottomColor),
        'rgb(176, 255, 48)'
      )
      await context.close()
    }
  },

  async 'unknown routes render the not-found page'(browser) {
    const { context, page } = await newPage(browser)
    await page.goto(`${baseUrl}/does-not-exist`)
    await page.getByRole('link', { name: '回到首頁' }).waitFor()
    assert.match(await page.title(), /找不到頁面/)
    await context.close()
  },

  async 'language selection translates the UI and persists after reload'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
  },

  async 'English and Japanese messages download only when chosen'(browser) {
    const { context, page } = await newPage(browser)
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
  },

  async 'a language that fails to download leaves the page and the menu as they were'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
  },

  async 'theme toggle overrides the OS preference and persists'(browser) {
    const { context, page } = await newPage(browser, { colorScheme: 'dark' })
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
  },

  async 'focus rings show on keyboard-focused buttons but not around the main region'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
    await page
      .locator('header nav')
      .getByRole('link', { name: '關於我' })
      .click()
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
  },

  async 'mobile drawer traps focus, closes with Escape, and navigates'(
    browser
  ) {
    const { context, page } = await newPage(browser, {
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
  },

  async 'GitHub archive tabs support keyboard selection and load each account'(
    browser
  ) {
    const { context, page } = await newPage(browser)
    const requests = []
    page.on('request', request => {
      if (request.url().startsWith('https://api.github.com/'))
        requests.push(new URL(request.url()).pathname)
    })
    await page.goto(`${baseUrl}/projects`)
    const tabs = page.getByRole('tab')
    await page
      .getByRole('link', { name: 'KageRyo-repo', exact: true })
      .waitFor()
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
  },

  async 'pages fit a 390px mobile screen in every language'(browser) {
    const overflowing = []
    for (const locale of ['zh-TW', 'en', 'ja']) {
      const { context, page } = await newPage(browser, {
        viewport: { width: 390, height: 844 },
        storage: { locale }
      })
      for (const path of [
        '/',
        '/about',
        '/projects',
        '/contact',
        '/projects/kserve'
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
  },

  async 'KServe card opens its project detail page and unknown slugs show 404'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
  },

  async 'project detail URLs validate every slug and keep 作品集 active'(
    browser
  ) {
    const desktop = await newPage(browser)
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

    const mobile = await newPage(browser, {
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
  },

  async 'KServe architecture flow reads across on desktop and down on mobile'(
    browser
  ) {
    for (const [width, across] of [
      [1280, true],
      [390, false]
    ]) {
      const { context, page } = await newPage(browser, {
        viewport: { width, height: 844 }
      })
      await page.goto(`${baseUrl}/projects/kserve`)
      await page.locator('h1').first().waitFor()
      const flows = await page
        .locator('.flow-steps')
        .evaluateAll(lists =>
          lists.map(list =>
            [...list.children].map(step =>
              step.getBoundingClientRect().toJSON()
            )
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
  },

  async 'trailing-slash URLs settle on the canonical route'(browser) {
    const { context, page } = await newPage(browser)
    // GitHub Pages 會把 /projects 導向 /projects/
    await page.goto(`${baseUrl}/projects/`)
    await page.waitForURL(`${baseUrl}/projects`)
    assert.equal(
      await page.locator('header nav .item.is-active').innerText(),
      '作品集'
    )
    await context.close()
  },

  async 'About lays education side by side on desktop and stacks it on mobile'(
    browser
  ) {
    for (const [width, sideBySide] of [
      [1280, true],
      [390, false]
    ]) {
      const { context, page } = await newPage(browser, {
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
  },

  async 'About experience puts the role details beside the role on desktop'(
    browser
  ) {
    for (const [width, beside] of [
      [1280, true],
      [390, false]
    ]) {
      const { context, page } = await newPage(browser, {
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
  },

  async 'About experience rows use the full content width'(browser) {
    const { context, page } = await newPage(browser)
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
  },

  async 'home card row leads to project pages and cards'(browser) {
    const { context, page } = await newPage(browser)
    await page.goto(baseUrl)
    const row = page.locator('section[aria-labelledby="home-cards-title"]')
    await row.getByRole('link', { name: '查看專案介紹' }).click()
    await page.waitForURL(`${baseUrl}/projects/kserve`)
    await page.getByRole('heading', { level: 1 }).waitFor()

    await page.goto(baseUrl)
    await row.getByRole('link', { name: '在作品集查看' }).first().click()
    await page.waitForURL(`${baseUrl}/projects#project-tagTwin`)
    await page.locator('#project-tagTwin').waitFor()
    // 卡片可能比視窗高，確認頁面捲到卡片開頭即可
    await page.waitForFunction(() => {
      const { top } = document
        .querySelector('#project-tagTwin')
        .getBoundingClientRect()
      return top >= 0 && top < window.innerHeight / 2
    })
    await context.close()
  },

  async 'home card row scrolls sideways with its previous and next buttons'(
    browser
  ) {
    for (const width of [1280, 390]) {
      const { context, page } = await newPage(browser, {
        viewport: { width, height: 844 }
      })
      await page.goto(baseUrl)
      const row = page.locator('section[aria-labelledby="home-cards-title"]')
      const previous = row.getByRole('button', { name: '上一張' })
      const next = row.getByRole('button', { name: '下一張' })
      const track = page.locator('#home-card-track')
      await track.scrollIntoViewIfNeeded()
      assert.equal(await previous.isDisabled(), true, `${width}px: previous`)
      assert.equal(await next.isDisabled(), false, `${width}px: next`)

      // 一路按「下一張」到底，最後一張卡片要完整出現
      for (let step = 0; step < 10 && !(await next.isDisabled()); step += 1) {
        await next.click()
        await page.waitForTimeout(400)
      }
      assert.equal(
        await next.isDisabled(),
        true,
        `${width}px: never reached the end`
      )
      assert.equal(await previous.isDisabled(), false, `${width}px: previous`)
      const [trackBox, lastBox] = await Promise.all([
        track.evaluate(element => element.getBoundingClientRect().toJSON()),
        track
          .locator('.card-slide')
          .last()
          .evaluate(element => element.getBoundingClientRect().toJSON())
      ])
      assert.ok(
        lastBox.right <= trackBox.right + 1 &&
          lastBox.left >= trackBox.left - 1,
        `${width}px: last card is cut off`
      )
      await context.close()
    }
  },

  async 'home sections share one left edge'(browser) {
    const misaligned = []
    for (const width of [1280, 1024, 390]) {
      const { context, page } = await newPage(browser, {
        viewport: { width, height: 844 }
      })
      await page.goto(baseUrl)
      await page.locator('h1').first().waitFor()
      const edges = await page.evaluate(() =>
        Object.fromEntries(
          [
            ['photos', '.ts-image:has(.ts-mask)'],
            ['cards', '#home-card-track']
          ].map(([name, selector]) => [
            name,
            Math.round(
              document.querySelector(selector).getBoundingClientRect().left
            )
          ])
        )
      )
      if (new Set(Object.values(edges)).size > 1)
        misaligned.push(`${width}px ${JSON.stringify(edges)}`)
      await context.close()
    }
    assert.deepEqual(misaligned, [])
  },

  async 'home introduction balances the illustration and the greeting'(
    browser
  ) {
    for (const locale of ['zh-TW', 'en', 'ja']) {
      for (const width of [1280, 1024, 390]) {
        const { context, page } = await newPage(browser, {
          viewport: { width, height: 900 },
          storage: { locale }
        })
        await page.goto(baseUrl)
        await page.locator('h1').first().waitFor()
        const [visual, intro] = await Promise.all(
          ['.hero-visual', '.hero-intro'].map(selector =>
            page
              .locator(selector)
              .evaluate(element => element.getBoundingClientRect().toJSON())
          )
        )
        const where = `${locale} ${width}px`
        if (width >= 1200) {
          // 寬螢幕並排：插圖與聯絡方式垂直置中，上下留白各不超過 120px（原本下方一整塊 232px）
          assert.ok(visual.right < intro.left, `${where}: not side by side`)
          const above = visual.top - intro.top
          const below = intro.bottom - visual.bottom
          assert.ok(Math.abs(above - below) <= 3, `${where}: not centered`)
          assert.ok(
            below <= 120,
            `${where}: ${Math.round(below)}px empty under the illustration`
          )
        } else {
          assert.ok(intro.top >= visual.bottom, `${where}: not stacked`)
        }
        await context.close()
      }
    }
  },

  async 'contact form previews the email and keeps a copy fallback'(browser) {
    const { context, page } = await newPage(browser)
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: baseUrl
    })
    await page.goto(`${baseUrl}/contact`)
    await page.fill('#contact-name', 'Ada Lovelace')
    await page.fill('#contact-email', 'ada@example.com')
    await page.fill('#contact-message', 'Hello from the e2e test.')
    await page.getByRole('button', { name: '預覽郵件內容' }).click()

    const dialog = page.getByRole('dialog', { name: '郵件內容' })
    await dialog.waitFor()
    const body = await dialog.locator('.email-body').innerText()
    assert.equal(
      body,
      '姓名：Ada Lovelace\n電子郵件：ada@example.com\n\n訊息內容：\nHello from the e2e test.'
    )
    const openMail = dialog.getByRole('link', { name: '開啟郵件程式' })
    const href = new URL(await openMail.getAttribute('href'))
    assert.equal(href.protocol, 'mailto:')
    assert.equal(decodeURIComponent(href.pathname), 'kageryo@coderyo.com')
    assert.equal(href.searchParams.get('body'), body)

    // 不實際開啟郵件程式，只確認預覽仍保留並提示使用者自行寄出
    await openMail.evaluate(link =>
      link.addEventListener('click', event => event.preventDefault(), {
        once: true
      })
    )
    await openMail.click()
    assert.equal(await dialog.isVisible(), true)
    await dialog
      .getByRole('status')
      .filter({ hasText: '已嘗試開啟郵件程式' })
      .waitFor()

    await dialog.getByRole('button', { name: '複製全部內容' }).click()
    await dialog.getByRole('status').filter({ hasText: '已複製' }).waitFor()
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    assert.ok(clipboard.includes(body), 'copied text is missing the email body')

    await dialog.getByRole('button', { name: '關閉' }).click()
    await dialog.waitFor({ state: 'hidden' })
    assert.equal(await page.inputValue('#contact-name'), 'Ada Lovelace')
    assert.equal(
      await page.inputValue('#contact-message'),
      'Hello from the e2e test.'
    )
    await context.close()
  },

  async 'photos scale to their containers on desktop and mobile'(browser) {
    const oversized = []
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 390, height: 844 }
    ]) {
      const { context, page } = await newPage(browser, { viewport })
      for (const path of ['/', '/about']) {
        await page.goto(`${baseUrl}${path}`)
        await page.locator('h1').first().waitFor()
        const found = await page.$$eval('.ts-image img', images =>
          images
            .filter(
              image =>
                image.getBoundingClientRect().width >
                image.parentElement.getBoundingClientRect().width + 1
            )
            .map(image => image.getAttribute('src'))
        )
        oversized.push(
          ...found.map(src => `${viewport.width}px ${path} ${src}`)
        )
      }
      await context.close()
    }
    assert.deepEqual(oversized, [])
  },

  async 'featured photo captions leave their photos visible'(browser) {
    const covering = []
    for (const locale of ['zh-TW', 'en', 'ja']) {
      for (const width of [1280, 390]) {
        const { context, page } = await newPage(browser, {
          viewport: { width, height: 844 },
          storage: { locale }
        })
        await page.goto(baseUrl)
        await page.locator('h1').first().waitFor()
        // 說明文字不能超出照片上緣，也不能蓋住大半張照片
        const found = await page.$$eval('.ts-image:has(.ts-mask)', images =>
          images
            .filter(image => {
              const photo = image.querySelector('img').getBoundingClientRect()
              const caption = image
                .querySelector('.ts-mask .ts-content')
                .getBoundingClientRect()
              const overlap =
                Math.min(caption.bottom, photo.bottom) -
                Math.max(caption.top, photo.top)
              return (
                (caption.top < photo.top && caption.bottom > photo.top) ||
                overlap > photo.height * 0.6
              )
            })
            .map(image => image.querySelector('img').getAttribute('src'))
        )
        covering.push(...found.map(src => `${locale} ${width}px ${src}`))
        await context.close()
      }
    }
    assert.deepEqual(covering, [])
  },

  async 'photos load when scrolled into view'(browser) {
    const { context, page } = await newPage(browser)
    const broken = []
    for (const path of ['/', '/about']) {
      await page.goto(`${baseUrl}${path}`)
      await page.locator('h1').first().waitFor()
      for (const image of await page.locator('.ts-image img').all()) {
        await image.scrollIntoViewIfNeeded()
        const loaded = await image
          .evaluate(
            element =>
              new Promise(resolve => {
                const done = () =>
                  resolve(element.complete && element.naturalWidth > 0)
                if (element.complete) done()
                else {
                  element.addEventListener('load', done, { once: true })
                  element.addEventListener('error', done, { once: true })
                }
              })
          )
          .catch(() => false)
        if (!loaded) broken.push(`${path} ${await image.getAttribute('src')}`)
      }
    }
    assert.deepEqual(broken, [])
    await context.close()
  },

  async 'page banners line up with the content below'(browser) {
    const misaligned = []
    for (const width of [1280, 1024, 390]) {
      const { context, page } = await newPage(browser, {
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
  },

  async 'GitHub archive shows a retry state when the API is rate limited'(
    browser
  ) {
    const { context, page } = await newPage(browser)
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
    await page
      .getByRole('link', { name: 'KageRyo-repo', exact: true })
      .waitFor()
    await context.close()
  }
}

let failed = 0
try {
  await waitForServer()
  const browser = await chromium.launch()
  for (const [name, test] of Object.entries(tests)) {
    try {
      await test(browser)
      console.log(`✓ ${name}`)
    } catch (error) {
      failed += 1
      console.error(`✗ ${name}\n  ${error.stack ?? error}`)
    }
  }
  await browser.close()
} finally {
  server.kill()
}

if (failed) {
  console.error(`${failed} end-to-end test(s) failed`)
  process.exitCode = 1
}
