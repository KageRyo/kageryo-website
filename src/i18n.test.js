import { afterEach, describe, expect, it, vi } from 'vitest'
import en from './locales/en'
import ja from './locales/ja'

// 每個測試重新載入 i18n，模擬第一次開啟網頁，並帶入上次選擇的語言
const openSite = async (savedLocale, languages = ['zh-TW']) => {
  vi.resetModules()
  vi.stubGlobal('localStorage', { getItem: () => savedLocale ?? null })
  vi.stubGlobal('navigator', { languages, language: languages[0] })
  return import('./i18n.js')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('language loading', () => {
  it('switches to a language after loading its messages', async () => {
    const { default: i18n, setLocale } = await openSite()

    await setLocale('ja')

    expect(i18n.global.locale.value).toBe('ja')
    expect(i18n.global.t('nav.about')).toBe(ja.nav.about)
  })

  it('keeps the last chosen language when switches overlap', async () => {
    const { default: i18n, setLocale } = await openSite()

    // 英文還在下載時又改回中文，英文載完後不能蓋掉中文
    const english = setLocale('en')
    await setLocale('zh-TW')
    await english

    expect(i18n.global.locale.value).toBe('zh-TW')
  })

  it("loads a returning visitor's language before the first render", async () => {
    const {
      default: i18n,
      initialLocale,
      loadLocaleMessages
    } = await openSite('en')

    await loadLocaleMessages(initialLocale)

    expect(i18n.global.locale.value).toBe('en')
    expect(i18n.global.t('nav.about')).toBe(en.nav.about)
  })
})

describe('first visit language preference', () => {
  it.each(['zh', 'zh-TW', 'zh-Hant', 'zh-CN', 'zh-Hans', 'zh-HK', 'ZH-sg'])(
    'uses Traditional Chinese for %s',
    async language => {
      const {
        initialLocale,
        loadLocaleMessages,
        default: i18n
      } = await openSite(null, [language])
      expect(initialLocale).toBe('zh-TW')
      await loadLocaleMessages(initialLocale)
      expect(i18n.global.availableLocales).toEqual(['zh-TW'])
    }
  )

  it.each(['ja', 'ja-JP', 'JA-jp'])('uses Japanese for %s', async language => {
    const {
      initialLocale,
      loadLocaleMessages,
      default: i18n
    } = await openSite(null, [language])
    expect(initialLocale).toBe('ja')
    await loadLocaleMessages(initialLocale)
    expect(i18n.global.availableLocales).toEqual(['ja'])
  })

  it.each(['en-US', 'fr-FR', 'de-DE', 'ko-KR', 'zhfoo', ''])(
    'uses English for other or unavailable preferences (%s)',
    async language => {
      const { initialLocale } = await openSite(null, [language])
      expect(initialLocale).toBe('en')
    }
  )

  it('honors the first browser preference rather than a lower-ranked language', async () => {
    const { initialLocale } = await openSite(null, ['fr-FR', 'ja-JP', 'zh-TW'])
    expect(initialLocale).toBe('en')
  })

  it('keeps an explicit saved choice ahead of the browser language', async () => {
    const { initialLocale } = await openSite('en', ['ja-JP'])
    expect(initialLocale).toBe('en')
  })

  it('ignores an unsupported saved choice and follows the browser preference', async () => {
    const { initialLocale } = await openSite('fr', ['ja-JP'])
    expect(initialLocale).toBe('ja')
  })
})
