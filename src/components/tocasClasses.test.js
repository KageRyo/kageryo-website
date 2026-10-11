import { describe, expect, it } from 'vitest'
import { useProjectStore } from '../stores/projects'
import { renderComponent } from '../test-utils/renderComponent'
import HighlightsCarousel from './home/HighlightsCarousel.vue'
import MobileDrawer from './layout/MobileDrawer.vue'
import GitHubProjects from './projects/GitHubProjects.vue'

// 這些 class 名稱必須是 TocasUI 實際提供的，拼錯時樣式會靜默失效
const classLists = html =>
  [...html.matchAll(/class="([^"]*)"/g)].map(([, value]) => value.split(/\s+/))

describe('TocasUI class names', () => {
  it('show the loading indicator while the GitHub archive loads', async () => {
    const html = await renderComponent(GitHubProjects, {
      prepare: () => {
        useProjectStore().loadingByAccount.kageryo = true
      }
    })

    expect(classLists(html)).toContainEqual(['ts-loading'])
  })

  it('style the mobile navigation drawer close button as outlined', async () => {
    const html = await renderComponent(MobileDrawer)
    const buttons = classLists(html).filter(list => list.includes('ts-button'))

    expect(buttons).toContainEqual(
      expect.arrayContaining(['is-rounded', 'is-outlined', 'is-small'])
    )
  })

  it('open the mobile navigation drawer from the end side', async () => {
    const drawer = classLists(await renderComponent(MobileDrawer)).find(list =>
      list.includes('ts-app-drawer')
    )

    expect(drawer).toContain('is-end')
  })

  it.each([
    ['ts-loader', GitHubProjects],
    ['is-padd', HighlightsCarousel],
    ['is-right', MobileDrawer]
  ])('no longer use the nonexistent %s class', async (name, component) => {
    const html = await renderComponent(component, {
      prepare: () => {
        useProjectStore().loadingByAccount.kageryo = true
      }
    })

    expect(classLists(html).flat()).not.toContain(name)
  })
})
