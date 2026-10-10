import { describe, expect, it } from 'vitest'
import { renderComponent } from '../../test-utils/renderComponent'
import LocationMap from './LocationMap.vue'

// 地圖在聯絡頁最下方，等捲到附近才載入 OpenStreetMap，不拖慢頁面
describe('LocationMap', () => {
  it('waits to load the map until it is scrolled near', async () => {
    const iframe = (await renderComponent(LocationMap)).match(
      /<iframe[^>]*>/
    )[0]

    expect(iframe).toMatch(/loading="lazy"/)
  })
})
