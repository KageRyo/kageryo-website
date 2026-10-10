import { describe, expect, it } from 'vitest'
import zhTW from '../../locales/zh-TW'
import { useProjectStore } from '../../stores/projects'
import { renderComponent, textContent } from '../../test-utils/renderComponent'
import GitHubProjects from './GitHubProjects.vue'

const { errors } = zhTW.projects.github

// 錯誤訊息要說明真正的原因，不是一律歸咎於速率限制
describe('GitHub archive errors', () => {
  it.each(Object.keys(errors))('explain a %s failure', async kind => {
    const html = await renderComponent(GitHubProjects, {
      prepare: () => {
        useProjectStore().errorsByAccount.kageryo = Object.assign(
          new Error('GitHub request failed'),
          { kind }
        )
      }
    })
    const alert = textContent(html.match(/role="alert"[^>]*>(.*)/s)[1])

    expect(alert).toContain(errors[kind].title)
    expect(alert).toContain(errors[kind].desc)
    for (const other of Object.keys(errors).filter(name => name !== kind)) {
      expect(alert).not.toContain(errors[other].title)
    }
  })
})
