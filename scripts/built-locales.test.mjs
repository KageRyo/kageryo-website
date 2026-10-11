import { build } from 'vite'
import { describe, expect, it } from 'vitest'

const isLocale = (id, locale) => id.endsWith(`/src/locales/${locale}.js`)

// 三種語言分開打包，初次載入只下載訪客使用的語言
describe('production build', () => {
  it('keeps every language out of the entry chunk and loads each independently', async () => {
    const [result] = [].concat(
      await build({ logLevel: 'silent', build: { write: false } })
    )
    const chunks = result.output.filter(({ type }) => type === 'chunk')
    const entry = chunks.find(({ isEntry }) => isEntry)
    const chunkWith = locale =>
      chunks.find(({ moduleIds }) => moduleIds.some(id => isLocale(id, locale)))

    for (const locale of ['zh-TW', 'en', 'ja']) {
      expect(chunkWith(locale)).toMatchObject({ isDynamicEntry: true })
      expect(chunkWith(locale)).not.toBe(entry)
    }
  }, 120000)
})
