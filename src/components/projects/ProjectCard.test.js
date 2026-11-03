import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import { featuredProjects } from '../../config/featuredProjects'
import { renderComponent } from '../../test-utils/renderComponent'
import ProjectCard from './ProjectCard.vue'

const waterMirror = featuredProjects.find(({ id }) => id === 'waterMirror')

const renderCard = locale =>
  renderComponent(
    { render: () => h(ProjectCard, { project: waterMirror }) },
    { locale }
  )

describe('project website link', () => {
  it.each([
    ['zh-TW', 'https://kageryo.coderyo.com/watermirror/zh-tw/'],
    ['en', 'https://kageryo.coderyo.com/watermirror/'],
    ['ja', 'https://kageryo.coderyo.com/watermirror/ja/']
  ])('opens the %s version of the WaterMirror site', async (locale, url) => {
    const html = await renderCard(locale)

    expect(html).toContain(`href="${url}"`)
  })
})
