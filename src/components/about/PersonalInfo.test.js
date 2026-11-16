import { describe, expect, it } from 'vitest'
import en from '../../locales/en'
import ja from '../../locales/ja'
import zhTW from '../../locales/zh-TW'
import { renderComponent } from '../../test-utils/renderComponent'
import PersonalInfo from './PersonalInfo.vue'

const profileAlt = html =>
  html.match(/<img[^>]*src="[^"]*chienhsun[^"]*"[^>]*alt="([^"]*)"/)?.[1] ??
  html.match(/<img[^>]*alt="([^"]*)"[^>]*src="[^"]*chienhsun/)?.[1]

describe('profile photo', () => {
  // 螢幕閱讀器依頁面語言念 alt，英日版不能念中文
  it('describes the photo in the page language', async () => {
    for (const [locale, messages] of [
      ['zh-TW', zhTW],
      ['en', en],
      ['ja', ja]
    ]) {
      const html = await renderComponent(PersonalInfo, { locale })
      expect(profileAlt(html)).toBe(messages.about.personal.photoAlt)
    }
  })
})
