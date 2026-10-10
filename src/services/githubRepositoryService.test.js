import { describe, expect, it, vi } from 'vitest'
import {
  fetchGitHubRepositories,
  filterRepositories,
  normalizeRepository,
  sortRepositories
} from './githubRepositoryService'

describe('GitHub repository helpers', () => {
  it('removes forks, archived repositories, and private repositories', () => {
    const repositories = [
      { id: 1, fork: false, archived: false, private: false },
      { id: 2, fork: true, archived: false, private: false },
      { id: 3, fork: false, archived: true, private: false },
      { id: 4, fork: false, archived: false, private: true }
    ]

    expect(filterRepositories(repositories)).toEqual([repositories[0]])
  })

  it('normalizes API fields and sorts newest repositories first', () => {
    const older = normalizeRepository({
      id: 1,
      name: 'older',
      description: '  ',
      html_url: 'https://github.com/example/older',
      updated_at: '2025-01-01T00:00:00Z'
    })
    const newer = normalizeRepository({
      id: 2,
      name: 'newer',
      description: 'Current project',
      html_url: 'https://github.com/example/newer',
      updated_at: '2025-02-01T00:00:00Z'
    })

    expect(older.description).toBeNull()
    expect(sortRepositories([older, newer])).toEqual([newer, older])
  })

  it('fetches, filters, and normalizes GitHub repositories', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      Response.json([
        {
          id: 1,
          name: 'project',
          fork: false,
          archived: false,
          private: false,
          description: 'Test',
          html_url: 'https://github.com/example/project',
          updated_at: '2026-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'forked-project',
          fork: true,
          archived: false,
          private: false
        }
      ])
    )

    const result = await fetchGitHubRepositories(
      { username: 'example' },
      { fetchFn }
    )

    expect(result).toEqual([
      {
        id: 1,
        name: 'project',
        description: 'Test',
        htmlUrl: 'https://github.com/example/project',
        updatedAt: '2026-01-01T00:00:00Z'
      }
    ])
    const { searchParams } = fetchFn.mock.calls[0][0]
    expect(searchParams.get('sort')).toBe('updated')
    expect(searchParams.get('direction')).toBe('desc')
    expect(searchParams.get('per_page')).toBe('100')
  })

  it('follows the Link header until every page is loaded', async () => {
    const repository = id => ({
      id,
      name: `project-${id}`,
      fork: false,
      archived: false,
      private: false,
      html_url: `https://github.com/example/project-${id}`,
      updated_at: `2026-01-0${id}T00:00:00Z`
    })
    const next = 'https://api.github.com/user/1/repos?per_page=100&page=2'
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([repository(1)], {
          headers: { link: `<${next}>; rel="next", <${next}>; rel="last"` }
        })
      )
      .mockResolvedValueOnce(Response.json([repository(2)]))

    const result = await fetchGitHubRepositories(
      { username: 'example' },
      { fetchFn }
    )

    expect(result.map(({ id }) => id)).toEqual([2, 1])
    expect(String(fetchFn.mock.calls[1][0])).toBe(next)
  })

  it.each([
    ['429 Too Many Requests', 429, {}, {}],
    ['403 with no requests left', 403, { 'x-ratelimit-remaining': '0' }, {}],
    [
      '403 secondary rate limit',
      403,
      {},
      { message: 'You have exceeded a secondary rate limit.' }
    ]
  ])('reports %s as rate limited', async (_name, status, headers, body) => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(Response.json(body, { status, headers }))

    await expect(
      fetchGitHubRepositories({ username: 'example' }, { fetchFn })
    ).rejects.toMatchObject({
      status,
      kind: 'rateLimited'
    })
  })

  it.each([
    ['403 with requests left', 403, { 'x-ratelimit-remaining': '42' }],
    ['a server error', 502, {}]
  ])(
    'reports %s as GitHub being unavailable',
    async (_name, status, headers) => {
      const fetchFn = vi
        .fn()
        .mockResolvedValue(
          Response.json({ message: 'Server Error' }, { status, headers })
        )

      await expect(
        fetchGitHubRepositories({ username: 'example' }, { fetchFn })
      ).rejects.toMatchObject({
        status,
        kind: 'unavailable'
      })
    }
  )

  it('reports a failed connection as a network problem', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(
      fetchGitHubRepositories({ username: 'example' }, { fetchFn })
    ).rejects.toMatchObject({
      kind: 'network'
    })
  })
})
