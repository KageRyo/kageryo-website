const API_BASE_URL = 'https://api.github.com'
const REQUEST_TIMEOUT = 10_000

export const normalizeRepository = repository => ({
  id: repository.id,
  name: repository.name,
  description: repository.description?.trim() || null,
  htmlUrl: repository.html_url,
  updatedAt: repository.updated_at
})

export const filterRepositories = repositories =>
  repositories.filter(repository => !repository.fork && !repository.archived && !repository.private)

export const sortRepositories = repositories =>
  [...repositories].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  )

// GitHub 一頁最多 100 筆，跟著 Link 標頭往下抓；最多 10 頁，避免異常回應讓請求停不下來
const MAX_PAGES = 10

const nextPageUrl = response =>
  response.headers.get('link')?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null

// 依原因分類錯誤，畫面才能說明真正發生了什麼：
// rateLimited：未登入的查詢次數用完；unavailable：GitHub 回應錯誤；network：連不上或逾時
const requestError = async response => {
  const { message = '' } = await response.json().catch(() => ({}))
  const rateLimited =
    response.status === 429 ||
    (response.status === 403 &&
      (response.headers.get('x-ratelimit-remaining') === '0' ||
        response.headers.has('retry-after') ||
        /rate limit/i.test(message)))
  const error = new Error(`GitHub request failed (${response.status})`)
  error.status = response.status
  error.kind = rateLimited ? 'rateLimited' : 'unavailable'
  return error
}

export const fetchGitHubRepositories = async (account, { fetchFn = fetch } = {}) => {
  const url = new URL(`/users/${encodeURIComponent(account.username)}/repos`, API_BASE_URL)
  url.search = new URLSearchParams({ sort: 'updated', direction: 'desc', per_page: '100' })

  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const repositories = []
    let pageUrl = url
    for (let page = 0; pageUrl && page < MAX_PAGES; page += 1) {
      let response
      try {
        response = await fetchFn(pageUrl, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: controller.signal
        })
      } catch (cause) {
        throw Object.assign(new Error('Could not reach GitHub', { cause }), {
          kind: 'network'
        })
      }
      if (!response.ok) throw await requestError(response)
      repositories.push(...(await response.json()))
      pageUrl = nextPageUrl(response)
    }
    return sortRepositories(filterRepositories(repositories).map(normalizeRepository))
  } finally {
    globalThis.clearTimeout(timeoutId)
  }
}
