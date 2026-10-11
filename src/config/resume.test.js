import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import en from '../locales/en'
import ja from '../locales/ja'
import zhTW from '../locales/zh-TW'
import { education, experience, resumePdfUrl, skillGroups } from './resume'

const locales = { 'zh-TW': zhTW, en, ja }

describe.each(Object.entries(locales))(
  'resume content in %s',
  (_name, messages) => {
    const resume = messages.about.resume

    it('translates every education entry', () => {
      for (const { id } of education) {
        expect(resume.education.items[id]).toMatchObject({
          period: expect.any(String),
          school: expect.any(String),
          degree: expect.any(String)
        })
      }
    })

    it('translates every experience entry with the same highlights count as English', () => {
      for (const { id } of experience) {
        const item = resume.experience.items[id]
        expect(item).toMatchObject({
          period: expect.any(String),
          organization: expect.any(String),
          role: expect.any(String),
          summary: expect.any(String)
        })
        expect(item.tools).toHaveLength(
          en.about.resume.experience.items[id].tools.length
        )
        expect(item.highlights?.length ?? 0).toBe(
          en.about.resume.experience.items[id].highlights?.length ?? 0
        )
      }
    })

    it('labels and describes every skill group', () => {
      for (const { id } of skillGroups) {
        expect(resume.skills.groups[id]).toEqual(expect.any(String))
        expect(resume.skills.descriptions[id]).toEqual(expect.any(String))
      }
    })

    it('labels every organization link', () => {
      for (const { links } of experience) {
        for (const { labelKey } of links) {
          const label = labelKey
            .split('.')
            .reduce((value, key) => value?.[key], messages)
          expect(label).toEqual(expect.any(String))
        }
      }
    })

    it('has no experience entries without configuration', () => {
      expect(Object.keys(resume.experience.items)).toEqual(
        experience.map(({ id }) => id)
      )
    })
  }
)

describe('public resume PDF', () => {
  it('is served from the public directory', () => {
    const file = fileURLToPath(
      new URL(`../../public${resumePdfUrl}`, import.meta.url)
    )
    expect(existsSync(file)).toBe(true)
  })
})

describe('organization links', () => {
  it('use https', () => {
    for (const { links } of experience) {
      for (const { url } of links) {
        expect(url).toMatch(/^https:\/\//)
      }
    }
  })
})
