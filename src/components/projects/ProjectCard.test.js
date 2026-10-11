import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { featuredProjects } from '../../config/featuredProjects'
import { renderComponent, textContent } from '../../test-utils/renderComponent'
import ProjectCard from './ProjectCard.vue'

// 把字串當成字面文字放進正規表示式，所有特殊字元（含反斜線）都要跳脫
const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const renderCard = id =>
  renderComponent({
    render: () =>
      h(ProjectCard, {
        project: featuredProjects.find(project => project.id === id)
      })
  })

describe('ProjectCard', () => {
  it('links the KServe card to its project detail page', async () => {
    const html = await renderCard('kserve')
    expect(html).toMatch(
      /<a[^>]*href="\/projects\/kserve"[^>]*>[\s\S]*?查看專案介紹/
    )
  })

  it('can be linked to directly by its project id', async () => {
    expect(await renderCard('tagTwin')).toMatch(
      /<article[^>]*id="project-tagTwin"/
    )
  })

  it('shows no detail link for projects without one', async () => {
    expect(await renderCard('federatedAqi')).not.toContain('查看專案介紹')
  })

  it.each(featuredProjects.map(({ id }) => id))(
    'shows the %s picture with its size, alt text and lazy loading',
    async id => {
      const { image } = featuredProjects.find(project => project.id === id)
      const tag = (await renderCard(id)).match(/<img\b[^>]*>/)[0]

      expect(tag).toContain(`src="${image.src}"`)
      expect(tag).toContain(`width="${image.width}"`)
      expect(tag).toContain(`height="${image.height}"`)
      expect(tag).toMatch(/alt="[^"]+"/)
      expect(tag).toContain('loading="lazy"')
    }
  )

  it('lists related coverage with its source and original headline', async () => {
    const html = await renderCard('tagTwin')
    const { related } = featuredProjects.find(({ id }) => id === 'tagTwin')

    for (const { source, title, url, lang } of related) {
      expect(textContent(html)).toContain(source)
      expect(html).toMatch(
        new RegExp(
          `<a[^>]*href="${escapeRegExp(url)}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*lang="${lang}"[^>]*>${escapeRegExp(title)}</a>`
        )
      )
    }
  })

  it('links public repositories instead of marking the source private', async () => {
    const html = await renderCard('waterMirror')

    expect(html).toContain('href="https://github.com/KageRyo/WaterMirror"')
    expect(html).toContain(
      'href="https://github.com/KageRyo/WQSurrogateModels"'
    )
    expect(html).not.toContain('原始碼未公開')
  })
})
