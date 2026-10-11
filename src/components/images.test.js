import { describe, expect, it } from 'vitest'
import { renderComponent } from '../test-utils/renderComponent'
import PersonalInfo from './about/PersonalInfo.vue'
import HeroSection from './home/HeroSection.vue'
import InfoCards from './home/InfoCards.vue'

const imgTags = html =>
  [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => ({
    tag,
    attr: name => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
  }))

// 首屏圖片立即載入，首屏以下的圖片延後載入
describe.each([
  ['HeroSection', HeroSection, 'eager'],
  ['PersonalInfo', PersonalInfo, 'eager'],
  ['InfoCards', InfoCards, 'lazy']
])('%s images', (_name, component, loading) => {
  it('declare their intrinsic size to avoid layout shift', async () => {
    const images = imgTags(await renderComponent(component))

    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(Number(image.attr('width'))).toBeGreaterThan(0)
      expect(Number(image.attr('height'))).toBeGreaterThan(0)
    }
  })

  it(`load ${loading === 'lazy' ? 'lazily' : 'eagerly'} and decode asynchronously`, async () => {
    for (const image of imgTags(await renderComponent(component))) {
      expect(image.attr('loading') ?? 'eager').toBe(loading)
      expect(image.attr('decoding')).toBe('async')
    }
  })

  it('use WebP photos', async () => {
    for (const image of imgTags(await renderComponent(component))) {
      if (image.attr('src')) expect(image.attr('src')).toMatch(/\.webp$/)
    }
  })
})
