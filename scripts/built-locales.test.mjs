import { build } from 'vite'
import { describe, expect, it } from 'vitest'

const isLocale = (id, locale) => id.endsWith(`/src/locales/${locale}.js`)

// 第一次開網頁只下載預設的正體中文，英文與日文各自拆成切換時才下載的檔案
describe('production build', () => {
  it('only bundles the default language into the first download', async () => {
    const [result] = [].concat(
      await build({ logLevel: 'silent', build: { write: false } })
    )
    const chunks = result.output.filter(({ type }) => type === 'chunk')
    const entry = chunks.find(({ isEntry }) => isEntry)
    const chunkWith = locale =>
      chunks.find(({ moduleIds }) => moduleIds.some(id => isLocale(id, locale)))

    expect(entry.moduleIds.some(id => isLocale(id, 'zh-TW'))).toBe(true)
    for (const locale of ['en', 'ja']) {
      expect(chunkWith(locale)).toMatchObject({ isDynamicEntry: true })
      expect(chunkWith(locale)).not.toBe(entry)
    }
  }, 120000)
})
