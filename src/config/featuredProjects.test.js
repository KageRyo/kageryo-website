import { describe, expect, it } from 'vitest'
import en from '../locales/en'
import ja from '../locales/ja'
import zhTW from '../locales/zh-TW'
import {
  featuredProjects,
  openSourceTools,
  homeCards
} from './featuredProjects'

const locales = { 'zh-TW': zhTW, en, ja }

describe.each(Object.entries(locales))(
  'project content in %s',
  (_name, messages) => {
    const { featured, tools } = messages.projects

    it('translates every featured project', () => {
      for (const { id } of featuredProjects) {
        expect(featured.items[id]).toMatchObject({
          title: expect.any(String),
          category: expect.any(String),
          period: expect.any(String),
          summary: expect.any(String)
        })
      }
    })

    it('labels every link status used by featured projects', () => {
      const statuses = featuredProjects.flatMap(({ links }) =>
        links.map(({ status }) => status)
      )
      for (const status of statuses) {
        expect(featured.status[status]).toEqual(expect.any(String))
      }
    })

    it('describes every open-source tool', () => {
      for (const { id } of openSourceTools) {
        expect(tools.items[id]).toEqual(expect.any(String))
      }
    })
  }
)

describe('featured project links', () => {
  it('only link to public HTTPS destinations', () => {
    const urls = [
      ...featuredProjects.flatMap(({ links }) => links.map(({ url }) => url)),
      ...openSourceTools.flatMap(({ url, packageUrl }) =>
        [url, packageUrl].filter(Boolean)
      )
    ]
    for (const url of urls) {
      expect(new URL(url).protocol).toBe('https:')
    }
  })
})

describe('home cards', () => {
  it('only show featured projects, which hold their titles, images and links', () => {
    const ids = featuredProjects.map(({ id }) => id)
    for (const { id } of homeCards) {
      expect(ids).toContain(id)
    }
  })

  it.each(Object.entries(locales))(
    'have a home summary in %s',
    (_name, messages) => {
      for (const { id } of homeCards) {
        expect(messages.home.infoCards.projects[id]).toEqual(expect.any(String))
      }
    }
  )
})

describe('related coverage and pages', () => {
  it('give every related link a source, a title and an https address', () => {
    const related = featuredProjects.flatMap(({ related = [] }) => related)

    expect(related.length).toBeGreaterThan(0)
    for (const link of related) {
      expect(link).toMatchObject({
        kind: expect.stringMatching(/^(news|page|paper)$/),
        source: expect.any(String),
        title: expect.any(String),
        url: expect.stringMatching(/^https:\/\//)
      })
    }
  })
})

describe('featured project pictures', () => {
  it('give every featured project a sized image', () => {
    for (const { image } of featuredProjects) {
      expect(image).toMatchObject({
        src: expect.stringMatching(/\.webp$/),
        width: expect.any(Number),
        height: expect.any(Number)
      })
    }
  })

  it.each(Object.entries(locales))(
    'describe every featured image in %s',
    (_name, messages) => {
      for (const { id } of featuredProjects) {
        expect(messages.projects.featured.items[id].imageAlt).toEqual(
          expect.any(String)
        )
      }
    }
  )
})
