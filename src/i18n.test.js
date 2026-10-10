import { afterEach, describe, expect, it, vi } from 'vitest'
import en from './locales/en'
import ja from './locales/ja'

// 每個測試重新載入 i18n，模擬第一次開啟網頁，並帶入上次選擇的語言
const openSite = async savedLocale => {
  vi.resetModules()
  vi.stubGlobal('localStorage', { getItem: () => savedLocale ?? null })
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
