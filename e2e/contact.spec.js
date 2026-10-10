import assert from 'node:assert/strict'
import { baseUrl, test } from './fixtures.js'

test('contact form previews the email and keeps a copy fallback', async ({
  openPage
}) => {
  const { context, page } = await openPage()
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
})
