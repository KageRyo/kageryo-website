import { describe, expect, it } from 'vitest'
import { renderComponent } from '../../test-utils/renderComponent'
import FeaturedProjects from './FeaturedProjects.vue'

describe('featured project images', () => {
  // 第一張卡片的圖片在手機第一屏，是頁面的 LCP；延遲載入會讓它最晚出現
  it('load the first card image right away and lazy-load the rest', async () => {
    const html = await renderComponent(FeaturedProjects)
    const loading = [
      ...html.matchAll(/<div[^>]*project-card-media[^>]*>\s*<img([^>]*)>/g)
    ].map(([, attrs]) => attrs.match(/loading="(\w+)"/)?.[1])

    expect(loading.length).toBeGreaterThan(1)
    expect(loading[0]).toBe('eager')
    expect(loading.slice(1).every(value => value === 'lazy')).toBe(true)
  })
})
