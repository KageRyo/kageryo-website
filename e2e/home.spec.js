import assert from 'node:assert/strict'
import { baseUrl, test } from './fixtures.js'

test('home card row leads to project pages and cards', async ({ openPage }) => {
  const { context, page } = await openPage()
  await page.goto(baseUrl)
  const row = page.locator('section[aria-labelledby="home-cards-title"]')
  await row.getByRole('link', { name: '查看專案介紹' }).first().click()
  await page.waitForURL(`${baseUrl}/projects/kserve`)
  await page.getByRole('heading', { level: 1 }).waitFor()

  await page.goto(baseUrl)
  await row.getByRole('link', { name: '在作品集查看' }).first().click()
  await page.waitForURL(`${baseUrl}/projects#project-federatedAqi`)
  await page.locator('#project-federatedAqi').waitFor()
  // 卡片可能比視窗高，確認頁面捲到卡片開頭即可
  await page.waitForFunction(() => {
    const { top } = document
      .querySelector('#project-federatedAqi')
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
      lastBox.right <= trackBox.right + 1 && lastBox.left >= trackBox.left - 1,
      `${width}px: last card is cut off`
    )
    await context.close()
  }
})

test('home sections share one left edge', async ({ openPage }) => {
  const misaligned = []
  for (const width of [1280, 1024, 390]) {
    const { context, page } = await openPage({
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
})

test('home introduction balances the illustration and the greeting', async ({
  openPage
}) => {
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const width of [1280, 1024, 390]) {
      const { context, page } = await openPage({
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
})

test('photos scale to their containers on desktop and mobile', async ({
  openPage
}) => {
  const oversized = []
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 }
  ]) {
    const { context, page } = await openPage({ viewport })
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
      oversized.push(...found.map(src => `${viewport.width}px ${path} ${src}`))
    }
    await context.close()
  }
  assert.deepEqual(oversized, [])
})

test('featured photo captions leave their photos visible', async ({
  openPage
}) => {
  const covering = []
  for (const locale of ['zh-TW', 'en', 'ja']) {
    for (const width of [1280, 390]) {
      const { context, page } = await openPage({
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
})

test('photos load when scrolled into view', async ({ openPage }) => {
  const { context, page } = await openPage()
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
})
