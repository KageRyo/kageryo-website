import { describe, expect, it } from 'vitest'
import zhTW from '../../locales/zh-TW'
import { renderComponent, textContent } from '../../test-utils/renderComponent'
import ResumeSection from './ResumeSection.vue'

const { items } = zhTW.about.resume.education

describe('education entries', () => {
  it('show honors only for schools that list them', async () => {
    const html = await renderComponent(ResumeSection)
    const rendered = [
      ...html.matchAll(/class="[^"]*education-honors[^"]*"[^>]*>(.*?)<\/div>/gs)
    ].map(match => textContent(match[1]))
    const listed = Object.values(items)
      .filter(item => item.honors)
      .map(item => item.honors)

    expect(listed.length).toBeGreaterThan(0)
    expect(rendered).toEqual(listed)
  })
})
