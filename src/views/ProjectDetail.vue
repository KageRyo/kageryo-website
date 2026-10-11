<template>
  <article v-if="detail">
    <!-- 穹頂：專案名稱、一段話的摘要、角色與技術，三十秒內就能讀完 -->
    <div class="ts-content is-tertiary is-vertically-padded">
      <div class="ts-container">
        <div class="ts-text is-description">
          {{ $t(`${projectKey}.category`) }}
        </div>
        <h1 class="ts-header is-huge is-heavy">{{ $t(`${copyKey}.title`) }}</h1>
        <p
          v-for="(line, index) in lines('overview')"
          :key="index"
          class="project-lede reading-width"
        >
          {{ line }}
        </p>
        <div class="ts-text is-secondary">
          {{ $t(`${projectKey}.role`) }} · {{ $t(`${projectKey}.period`) }}
        </div>
        <div class="ts-wrap is-compact has-top-spaced-small">
          <span
            v-for="tech in project.stack"
            :key="tech"
            class="ts-chip is-small"
            >{{ tech }}</span
          >
        </div>
      </div>
    </div>

    <!-- 各段落：左側編號與標題，右側內文；手機版上下堆疊 -->
    <section
      v-for="(key, index) in sections"
      :key="key"
      class="ts-container editorial-section"
      :aria-labelledby="`project-${key}`"
    >
      <div class="side-heading-layout">
        <div>
          <SectionKicker
            :index="String(index + 1).padStart(2, '0')"
            :label="KICKERS[key]"
          />
          <h2 :id="`project-${key}`" class="ts-header is-big is-heavy">
            {{ $t(`projectDetail.headings.${key}`) }}
          </h2>
        </div>

        <!-- 貢獻一覽：每項改動的狀態、PR 與對應 issue -->
        <ul v-if="key === 'contributions'" class="contribution-list">
          <li
            v-for="contribution in detail.contributions"
            :key="contribution.id"
            class="contribution-entry"
          >
            <div class="ts-text is-bold contribution-status">
              <span
                class="ts-icon"
                :class="statusIcon(contribution.pr.status)"
                aria-hidden="true"
              ></span>
              {{ $t(`projects.featured.status.${contribution.pr.status}`) }}
            </div>
            <div>
              <h3 class="ts-header is-heavy">
                {{ $t(`${copyKey}.contributions.${contribution.id}`) }}
              </h3>
              <div class="contribution-links">
                <a
                  :href="contribution.pr.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    class="ts-icon is-code-pull-request-icon"
                    aria-hidden="true"
                  ></span>
                  {{ contribution.pr.label }}
                </a>
                <a
                  :href="contribution.issue.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    class="ts-icon is-circle-dot-icon"
                    aria-hidden="true"
                  ></span>
                  {{ contribution.issue.label }}
                </a>
              </div>
            </div>
          </li>
        </ul>

        <ProjectMedia
          v-else-if="key === 'media'"
          :media="detail.media"
          :coverage="detail.coverage"
        />

        <div v-else>
          <!-- 架構圖：每項改動在程式中生效的位置，或資料經過的元件 -->
          <figure
            v-if="key === 'architecture' && diagrams.length"
            class="contribution-flows"
          >
            <div v-for="diagram in diagrams" :key="diagram.id" class="flow">
              <div class="ts-text is-bold">
                {{ $t(diagram.titleKey) }}
              </div>
              <ol
                class="flow-steps"
                :class="{ 'is-vertical': diagram.flow.length > 3 }"
              >
                <li
                  v-for="(step, position) in diagram.flow"
                  :key="position"
                  class="flow-step"
                  :class="{ 'is-branch': Array.isArray(step) }"
                >
                  <!-- 分支：判斷結果為「是」或「否」時各自執行的程式 -->
                  <template v-if="Array.isArray(step)">
                    <div
                      v-for="(branch, index) in step"
                      :key="branch.when"
                      class="flow-branch"
                    >
                      <span class="ts-text is-bold flow-branch-label">{{
                        $t(`projectDetail.branch.${branch.when}`)
                      }}</span>
                      <code>{{ branch.code }}</code>
                      <span>{{
                        diagramSteps(diagram.id)[position][index]
                      }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <code>{{ step }}</code>
                    <span>{{ diagramSteps(diagram.id)[position] }}</span>
                  </template>
                </li>
              </ol>
            </div>
            <figcaption class="ts-text is-description">
              {{ $t(`${copyKey}.diagram.caption`) }}
            </figcaption>
          </figure>

          <p v-if="lines(key).length === 1" class="reading-width">
            {{ lines(key)[0] }}
          </p>
          <ul v-else class="case-detail-list reading-width">
            <li v-for="(line, lineIndex) in lines(key)" :key="lineIndex">
              {{ line }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="ts-container project-back">
      <router-link to="/projects" class="ts-button is-outlined is-start-icon">
        <span class="ts-icon is-arrow-left-icon"></span>
        {{ $t('projectDetail.backToProjects') }}
      </router-link>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProjectDetail } from '../config/projectDetails'
import { featuredProjects } from '../config/featuredProjects'
import SectionKicker from '../components/common/SectionKicker.vue'
import ProjectMedia from '../components/projects/ProjectMedia.vue'

const props = defineProps({
  slug: { type: String, required: true }
})

// 編號小標固定用英文，與各頁共用的職涯定位一致
const KICKERS = {
  contributions: 'Contributions',
  problem: 'Problem',
  role: 'Role',
  architecture: 'Architecture',
  tradeoffs: 'Trade-offs',
  outcomes: 'Outcomes',
  media: 'Media'
}
const NARRATIVE = ['problem', 'role', 'architecture', 'tradeoffs', 'outcomes']

const { tm, rt } = useI18n({ useScope: 'global' })

const detail = computed(() => getProjectDetail(props.slug))
const project = computed(() =>
  featuredProjects.find(({ id }) => id === detail.value.projectId)
)
const projectKey = computed(
  () => `projects.featured.items.${detail.value.projectId}`
)
const copyKey = computed(() => `projectDetail.${detail.value.projectId}`)

// 只顯示有內容的段落：沒有上游 PR 就沒有「貢獻一覽」，沒有寫的段落（例如技術取捨）不留空標題，
// 沒有圖片或報導時也不顯示「成果與媒體」
const sections = computed(() => [
  ...(detail.value.contributions?.length ? ['contributions'] : []),
  ...NARRATIVE.filter(key => hasLines(key)),
  ...(detail.value.media?.length || detail.value.coverage?.length
    ? ['media']
    : [])
])

// 架構圖：有 PR 的專案畫每項改動生效的位置，其他專案畫 flows 裡的資料流程
const diagrams = computed(() =>
  detail.value.flows
    ? detail.value.flows.map(({ id, flow }) => ({
        id,
        flow,
        titleKey: `${copyKey.value}.diagram.titles.${id}`
      }))
    : (detail.value.contributions ?? [])
        .filter(({ flow }) => flow?.length)
        .map(({ id, flow }) => ({
          id,
          flow,
          titleKey: `${copyKey.value}.contributions.${id}`
        }))
)

const statusIcon = status =>
  status === 'merged' ? 'is-code-merge-icon' : 'is-code-pull-request-icon'

// 各段落為字串陣列（te() 只認得字串訊息，所以用 tm() 檢查），需逐行轉譯；架構圖的分支步驟是巢狀陣列
const hasLines = key => {
  const message = tm(`${copyKey.value}.${key}`)
  return Array.isArray(message) && message.length > 0
}
const translate = message =>
  Array.isArray(message) ? message.map(translate) : rt(message)
const translateLines = key => tm(key).map(translate)
const lines = key => translateLines(`${copyKey.value}.${key}`)
const diagramSteps = id =>
  translateLines(`${copyKey.value}.diagram.steps.${id}`)
</script>

<style scoped>
.project-lede {
  margin: 0.5rem 0 0.75rem;
  font-size: 1.1rem;
}

.side-heading-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2.5fr);
  gap: 1rem 3rem;
}

.side-heading-layout h2 {
  margin: 0;
}

.contribution-list,
.flow-steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.contribution-entry {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: 0.25rem 1.5rem;
  padding: 1rem 0;
}

.contribution-entry:first-child {
  padding-top: 0;
}

.contribution-entry + .contribution-entry {
  border-top: 1px solid var(--ts-gray-200);
}

.contribution-entry h3 {
  margin: 0;
}

.contribution-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
}

.contribution-links .ts-icon {
  margin-right: 0.25rem;
}

.contribution-flows {
  margin: 0 0 1.5rem;
  padding: 1.25rem;
  border-radius: var(--ts-border-radius-container);
  background: var(--ts-gray-100);
}

.flow + .flow {
  margin-top: 1.25rem;
}

.flow-steps {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 2rem;
  margin-top: 0.5rem;
}

.flow-step {
  position: relative;
  padding: 0.75rem 1rem;
  border: 1px solid var(--ts-gray-300);
  border-radius: var(--ts-border-radius-element);
  background: var(--ts-gray-50);
  font-size: 0.9rem;
}

/* 步驟之間的箭頭只是裝飾，順序已由 <ol> 表達 */
.flow-step + .flow-step::before {
  content: '→';
  content: '→' / '';
  position: absolute;
  top: 50%;
  left: -1.4rem;
  transform: translateY(-50%);
  color: var(--ts-gray-600);
}

.flow-step code {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.flow-step.is-branch {
  padding: 0;
}

.flow-branch {
  padding: 0.6rem 1rem;
}

.flow-branch + .flow-branch {
  border-top: 1px dashed var(--ts-gray-300);
}

.flow-branch-label {
  float: left;
  margin-right: 0.5rem;
}

.contribution-flows figcaption {
  margin-top: 1rem;
}

.case-detail-list {
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.case-detail-list li + li {
  margin-top: 0.5rem;
}

.project-back {
  padding-bottom: 3rem;
}

/* 超過三步的流程在桌機也由上而下排列，避免每格太窄、程式名稱被拆字 */
.flow-steps.is-vertical {
  grid-auto-flow: row;
  gap: 1.75rem;
}

.flow-steps.is-vertical .flow-step + .flow-step::before {
  content: '↓';
  content: '↓' / '';
  top: -1.45rem;
  left: 50%;
  transform: translateX(-50%);
}

@media (max-width: 767.98px) {
  .side-heading-layout,
  .contribution-entry {
    grid-template-columns: minmax(0, 1fr);
  }

  .flow-steps {
    grid-auto-flow: row;
    gap: 1.75rem;
  }

  .flow-step + .flow-step::before {
    content: '↓';
    content: '↓' / '';
    top: -1.45rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
