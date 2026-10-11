import { describe, expect, it } from 'vitest'
import en from '../../locales/en'
import ja from '../../locales/ja'
import zhTW from '../../locales/zh-TW'
import { renderComponent, textContent } from '../../test-utils/renderComponent'
import PersonalInfo from './PersonalInfo.vue'

describe('PersonalInfo', () => {
  it('shows gender and age in a secondary line after the resume link', async () => {
    const html = await renderComponent(PersonalInfo)
    const resumeLink = html.indexOf(
      'href="/resume/Chien-Hsun_Chang_Resume.pdf"'
    )
    const secondaryLine = html.indexOf('class="ts-text is-description is-small')
    expect(secondaryLine).toBeGreaterThan(resumeLink)
  })

  it('offers the resume PDF and the GitHub profile next to the introduction', async () => {
    const html = await renderComponent(PersonalInfo)

    expect(html).toMatch(
      /<a[^>]*href="\/resume\/Chien-Hsun_Chang_Resume\.pdf"[^>]*download/
    )
    expect(html).toMatch(
      /<a[^>]*href="https:\/\/github\.com\/KageRyo"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/
    )
  })

  it.each([
    ['zh-TW', zhTW],
    ['en', en],
    ['ja', ja]
  ])(
    'introduces every paragraph of the autobiography in %s',
    async (locale, messages) => {
      const text = textContent(await renderComponent(PersonalInfo, { locale }))

      expect(messages.about.personal.summary.length).toBeGreaterThan(1)
      for (const paragraph of messages.about.personal.summary) {
        expect(text).toContain(paragraph)
      }
    }
  )
})
