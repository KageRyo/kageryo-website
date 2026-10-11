import { describe, expect, it } from 'vitest'
import en from '../locales/en'
import ja from '../locales/ja'
import zhTW from '../locales/zh-TW'
import { getProjectDetail, projectDetails } from './projectDetails'
import { featuredProjects } from './featuredProjects'

describe('project detail pages', () => {
  it('include the KServe contributions', () => {
    expect(getProjectDetail('kserve')).toBeDefined()
  })

  it('reuse the featured project pull request links so statuses stay in sync', () => {
    const kserve = featuredProjects.find(({ id }) => id === 'kserve')
    expect(
      getProjectDetail('kserve').contributions.map(({ pr }) => pr)
    ).toEqual(kserve.links)
  })

  it.each(Object.entries({ 'zh-TW': zhTW, en, ja }))(
    'have page metadata in %s',
    (_locale, messages) => {
      for (const { metaKey } of projectDetails) {
        expect(messages.meta[metaKey]).toMatchObject({
          title: expect.any(String),
          description: expect.any(String)
        })
      }
    }
  )

  it.each(Object.entries({ 'zh-TW': zhTW, en, ja }))(
    'describe every diagram step in %s',
    (_locale, messages) => {
      // 有 PR 的專案依每項改動畫圖，其他專案用 flows；說明文字放在 projectDetail.<projectId>
      for (const { projectId, contributions = [], flows } of projectDetails) {
        const copy = messages.projectDetail[projectId]
        for (const { id } of flows ?? []) {
          expect(copy.diagram.titles[id]).toEqual(expect.any(String))
        }
        for (const { id, flow = [] } of flows ?? contributions) {
          const texts = copy.diagram.steps[id]
          expect(texts).toHaveLength(flow.length)
          flow.forEach((step, index) => {
            if (!Array.isArray(step)) {
              expect(texts[index]).toEqual(expect.any(String))
              return
            }
            // 分支步驟：每條分支都要有說明與「是／否」標籤
            expect(texts[index]).toHaveLength(step.length)
            for (const { when } of step) {
              expect(messages.projectDetail.branch[when]).toEqual(
                expect.any(String)
              )
            }
          })
        }
      }
    }
  )

  it('are linked from an existing featured project', () => {
    for (const { slug } of projectDetails) {
      expect(featuredProjects.some(({ detail }) => detail === slug)).toBe(true)
    }
    for (const { detail } of featuredProjects.filter(({ detail }) => detail)) {
      expect(getProjectDetail(detail)).toBeDefined()
    }
  })

  it.each(['constructor', 'toString', '__proto__', 'hasOwnProperty'])(
    'do not treat the inherited %s property as a project',
    slug => {
      expect(getProjectDetail(slug)).toBeUndefined()
    }
  )
})
