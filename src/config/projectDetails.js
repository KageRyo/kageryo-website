import { featuredProjects } from './featuredProjects'

const kserve = featuredProjects.find(({ id }) => id === 'kserve')
const tagTwin = featuredProjects.find(({ id }) => id === 'tagTwin')
const kservePullRequest = number =>
  kserve.links.find(({ url }) => url.endsWith(`/pull/${number}`))

// 專案介紹頁的結構與連結；文字放在 locales 的 projectDetail.*，
// PR 連結沿用作品集卡片的資料，讓合併狀態只需維護一處。
// flow 是架構圖每一步的程式名稱，說明文字在 projectDetail.<slug>.diagram.steps；
// 以陣列表示的步驟是分支（例如判斷結果為「是」或「否」時各自執行的程式）。
// 沒有上游 PR 的專案不放 contributions，架構圖改用 flows（每張圖的 id 與步驟）。
// 選填的 media（圖片）與 coverage（報導）只放已確認來源與授權的公開素材，沒有就省略
export const projectDetails = [
  {
    slug: 'kserve',
    projectId: 'kserve',
    metaKey: 'kserveProject',
    contributions: [
      {
        id: 'logging',
        // 最後一步依 logger.hasHandlers() 的結果分成兩條路
        flow: [
          'configure_logging()',
          'logger.hasHandlers()',
          [
            { when: 'yes', code: 'return' },
            { when: 'no', code: 'dictConfig()' }
          ]
        ],
        pr: kservePullRequest(4687),
        issue: {
          label: 'kserve/kserve#3919',
          url: 'https://github.com/kserve/kserve/issues/3919'
        }
      },
      {
        id: 'domainValidation',
        // 停用 Ingress 建立時只回傳網域，不再驗證
        flow: [
          'GenerateDomainName()',
          'DisableIngressCreation',
          [
            { when: 'yes', code: 'return domainName' },
            { when: 'no', code: 'IsFullyQualifiedDomainName()' }
          ]
        ],
        pr: kservePullRequest(4919),
        issue: {
          label: 'kserve/kserve#4807',
          url: 'https://github.com/kserve/kserve/issues/4807'
        }
      },
      {
        id: 'runtimeClassName',
        flow: ['spec.runtimeClassName', 'MergePodSpec()', 'PodSpec'],
        pr: kservePullRequest(5198),
        issue: {
          label: 'kserve/kserve#5057',
          url: 'https://github.com/kserve/kserve/issues/5057'
        }
      }
    ]
  },
  {
    slug: 'tag-twin',
    projectId: 'tagTwin',
    metaKey: 'tagTwinProject',
    // 依 CV 的描述整理洪水模擬資料從模擬結果到 Unreal Engine 5 場景的流程
    flows: [
      {
        id: 'floodData',
        flow: [
          'Flood simulation',
          'Data pipeline',
          'FastAPI · PostgreSQL/PostGIS',
          'API · WebSocket',
          'Unreal Engine 5'
        ]
      }
    ],
    // 擁有者提供的智慧城市展照片，與作品集卡片同一張
    media: [
      {
        ...tagTwin.image,
        altKey: 'projects.featured.items.tagTwin.imageAlt',
        captionKey: 'projectDetail.tagTwin.media.expo'
      }
    ],
    coverage: tagTwin.related.filter(({ kind }) => kind === 'news')
  }
]

// 用 Map 查詢，避免 constructor、__proto__ 等繼承屬性被當成專案
const projectDetailsBySlug = new Map(
  projectDetails.map(detail => [detail.slug, detail])
)

export const getProjectDetail = slug => projectDetailsBySlug.get(slug)
