import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fetchGitHubRepositories } from '../services/githubRepositoryService'
import { useProjectStore } from './projects'

vi.mock('../services/githubRepositoryService', () => ({
  fetchGitHubRepositories: vi.fn()
}))

describe('project store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('caches an empty successful response', async () => {
    fetchGitHubRepositories.mockResolvedValueOnce([])
    const store = useProjectStore()

    await store.fetchProjects('kageryo')
    await store.fetchProjects('kageryo')

    expect(fetchGitHubRepositories).toHaveBeenCalledTimes(1)
  })

  it('shares one GitHub request between concurrent calls', async () => {
    let resolveRequest
    fetchGitHubRepositories.mockReturnValueOnce(
      new Promise(resolve => {
        resolveRequest = resolve
      })
    )
    const store = useProjectStore()

    const first = store.fetchProjects('kageryo')
    const second = store.fetchProjects('kageryo', { force: true })
    resolveRequest([{ id: 1 }])

    await expect(first).resolves.toEqual([{ id: 1 }])
    await expect(second).resolves.toEqual([{ id: 1 }])
    expect(fetchGitHubRepositories).toHaveBeenCalledTimes(1)
    expect(store.loadingByAccount.kageryo).toBe(false)
  })

  it('retries after a failed request instead of reusing it', async () => {
    const rateLimited = Object.assign(
      new Error('GitHub request failed (403)'),
      {
        kind: 'rateLimited'
      }
    )
    fetchGitHubRepositories
      .mockRejectedValueOnce(rateLimited)
      .mockResolvedValueOnce([{ id: 2 }])
    const store = useProjectStore()

    await expect(store.fetchProjects('kageryo')).rejects.toBe(rateLimited)
    expect(store.errorsByAccount.kageryo).toBe(rateLimited)

    await expect(store.fetchProjects('kageryo')).resolves.toEqual([{ id: 2 }])
    expect(store.errorsByAccount.kageryo).toBeNull()
    expect(fetchGitHubRepositories).toHaveBeenCalledTimes(2)
  })

  it('keeps requests for different accounts independent', async () => {
    fetchGitHubRepositories.mockResolvedValue([])
    const store = useProjectStore()

    await Promise.all([
      store.fetchProjects('kageryo'),
      store.fetchProjects('coderyostudio')
    ])

    expect(fetchGitHubRepositories).toHaveBeenCalledTimes(2)
  })
})
