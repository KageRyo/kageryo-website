import { describe, expect, it } from 'vitest'
import { isActiveNavPath, resolveProjectDetailRoute } from './guards'

const detailRoute = (slug, extra = {}) => ({
  name: 'ProjectDetail',
  path: `/projects/${slug}`,
  params: { slug },
  query: {},
  hash: '',
  meta: {},
  ...extra
})

describe('resolveProjectDetailRoute', () => {
  it('leaves other routes alone', () => {
    expect(
      resolveProjectDetailRoute({ name: 'About', path: '/about', meta: {} })
    ).toBeUndefined()
  })

  it('sets the page title and description keys for a known project', () => {
    const to = detailRoute('kserve')

    expect(resolveProjectDetailRoute(to)).toBeUndefined()
    expect(to.meta).toEqual({
      titleKey: 'meta.kserveProject.title',
      descriptionKey: 'meta.kserveProject.description'
    })
  })

  it('sets the TAG-Twin page title and description keys', () => {
    const to = detailRoute('tag-twin')

    expect(resolveProjectDetailRoute(to)).toBeUndefined()
    expect(to.meta).toEqual({
      titleKey: 'meta.tagTwinProject.title',
      descriptionKey: 'meta.tagTwinProject.description'
    })
  })

  it.each(['not-a-project', 'constructor', 'toString', '__proto__'])(
    'shows the not-found page for /projects/%s and keeps the URL',
    slug => {
      const to = detailRoute(slug, { query: { ref: 'x' }, hash: '#top' })

      expect(resolveProjectDetailRoute(to)).toEqual({
        name: 'NotFound',
        params: { pathMatch: ['projects', slug] },
        query: { ref: 'x' },
        hash: '#top'
      })
    }
  )
})

describe('isActiveNavPath', () => {
  it.each([
    ['/projects', '/projects', true],
    ['/projects/kserve', '/projects', true],
    ['/projects', '/', false],
    ['/', '/', true],
    ['/projects-archive', '/projects', false],
    ['/about', '/projects', false]
  ])('%s marks %s as active: %s', (current, item, active) => {
    expect(isActiveNavPath(current, item)).toBe(active)
  })
})
