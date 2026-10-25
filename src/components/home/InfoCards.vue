<template>
  <!-- 首頁最下方的卡片列：沿用最初的資訊卡片樣式（上圖、置中標題、說明、圖示連結），可左右滑動 -->
  <section
    class="ts-container has-top-spaced-big"
    aria-labelledby="home-cards-title"
  >
    <h2 id="home-cards-title" class="visually-hidden">
      {{ $t('home.infoCards.header') }}
    </h2>
    <ul id="home-card-track" ref="track" class="card-track">
      <!-- KageRyo Developer -->
      <li class="card-slide">
        <div class="ts-box home-card">
          <div class="ts-image card-media">
            <img
              :src="responsiveImages.portrait.src"
              :srcset="responsiveImages.portrait.srcset"
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 42vw, 82vw"
              alt="KageRyo Developer"
              width="900"
              height="900"
              loading="lazy"
              decoding="async"
              class="is-portrait"
            />
          </div>
          <div class="ts-content card-body">
            <div class="ts-header is-heavy has-flex-center">
              KageRyo Developer
            </div>
            <p class="card-text">
              <i18n-t keypath="home.infoCards.intro" tag="span">
                <template #ccu>
                  <a
                    href="https://www.ccu.edu.tw/"
                    class="ts-text is-external-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ $t('home.infoCards.links.ccu') }}</a
                  >
                </template>
                <template #cs>
                  <a
                    href="https://cs.ccu.edu.tw/"
                    class="ts-text is-external-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ $t('home.infoCards.links.cs') }}</a
                  >
                </template>
                <template #about>
                  <router-link to="/about" class="item">{{
                    $t('home.infoCards.links.about')
                  }}</router-link>
                </template>
                <template #projects>
                  <router-link to="/projects" class="item">{{
                    $t('home.infoCards.links.projects')
                  }}</router-link>
                </template>
              </i18n-t>
            </p>
            <div class="has-flex-center">
              <div class="ts-wrap">
                <a
                  href="https://coderyo.com/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord (opens in a new tab)"
                  class="ts-icon is-secondary is-discord-icon is-circular is-large"
                ></a>
                <a
                  href="https://github.com/KageRyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub (opens in a new tab)"
                  class="ts-icon is-secondary is-github-icon is-circular is-large"
                ></a>
                <a
                  href="https://www.linkedin.com/in/kageryo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn (opens in a new tab)"
                  class="ts-icon is-secondary is-linkedin-icon is-circular is-large"
                ></a>
                <a
                  href="mailto:kageryo@coderyo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email KageRyo"
                  class="ts-icon is-secondary is-envelope-icon is-circular is-large"
                ></a>
              </div>
            </div>
          </div>
        </div>
      </li>

      <!-- 專案 -->
      <li v-for="card in cards" :key="card.id" class="card-slide">
        <div class="ts-box home-card">
          <div v-if="card.image" class="ts-image card-media">
            <img
              :src="card.image.src"
              :srcset="card.image.srcset"
              sizes="(min-width: 1024px) 340px, (min-width: 768px) 42vw, 82vw"
              :width="card.image.width"
              :height="card.image.height"
              :alt="$t(`projects.featured.items.${card.id}.imageAlt`)"
              loading="lazy"
              decoding="async"
            />
          </div>
          <!-- 還沒有可公開的圖片時，用與首頁插圖相同的黑底與螢光綠封面 -->
          <div v-else class="project-cover" aria-hidden="true">
            <span class="project-cover-ring">
              <span class="ts-icon" :class="card.icon"></span>
            </span>
          </div>
          <div class="ts-content card-body">
            <div class="ts-header is-heavy has-flex-center">
              {{ card.title }}
            </div>
            <p class="card-text">
              {{ $t(`home.infoCards.projects.${card.id}`) }}
            </p>
            <div class="has-flex-center">
              <div class="ts-wrap">
                <template v-for="link in card.links" :key="link.url">
                  <router-link
                    v-if="link.internal"
                    :to="link.url"
                    :aria-label="link.label"
                    :title="link.label"
                    class="ts-icon is-secondary is-circular is-large"
                    :class="link.icon"
                  ></router-link>
                  <a
                    v-else
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="link.label"
                    :title="link.label"
                    class="ts-icon is-secondary is-circular is-large"
                    :class="link.icon"
                  ></a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- 上一張／下一張：觸控可以直接左右滑，滑鼠與鍵盤用按鈕 -->
    <div class="card-controls">
      <button
        type="button"
        class="ts-button is-icon is-outlined"
        :aria-label="$t('home.infoCards.previous')"
        aria-controls="home-card-track"
        :disabled="atStart"
        @click="scrollCards(-1)"
      >
        <span class="ts-icon is-chevron-left-icon"></span>
      </button>
      <button
        type="button"
        class="ts-button is-icon is-outlined"
        :aria-label="$t('home.infoCards.next')"
        aria-controls="home-card-track"
        :disabled="atEnd"
        @click="scrollCards(1)"
      >
        <span class="ts-icon is-chevron-right-icon"></span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { responsiveImages } from '../../config/responsiveImages'
import { featuredProjects, homeCards } from '../../config/featuredProjects'

const { t } = useI18n({ useScope: 'global' })

const RELATED_ICONS = {
  news: 'is-newspaper-icon',
  page: 'is-globe-icon',
  paper: 'is-file-lines-icon'
}

// 作品集裡的專案沿用作品集的標題與 PR 連結；有專案介紹頁就加上入口，沒有就連到作品集上的卡片
// 卡片沿用作品集的標題、圖片與連結：PR、專案介紹頁或作品集卡片、程式碼庫，以及相關報導
const cards = computed(() =>
  homeCards.map(card => {
    const project = featuredProjects.find(({ id }) => id === card.id)
    const pullRequests = project.links.map(link => ({
      url: link.url,
      icon:
        link.status === 'merged'
          ? 'is-code-merge-icon'
          : 'is-code-pull-request-icon',
      label: `${link.label} · ${t(`projects.featured.status.${link.status}`)}`
    }))
    const page = project.detail
      ? {
          url: `/projects/${project.detail}`,
          icon: 'is-book-open-icon',
          label: t('projectDetail.viewDetails'),
          internal: true
        }
      : {
          url: `/projects#project-${card.id}`,
          icon: 'is-folder-open-icon',
          label: t('home.infoCards.links.projectsPage'),
          internal: true
        }
    const repositories = (project.repositories ?? []).map(repository => ({
      url: repository.url,
      icon: 'is-github-icon',
      label: `GitHub ${repository.label}`
    }))
    // 公開報導、計畫頁與論文，標籤用原文的來源與標題
    const related = (project.related ?? []).map(link => ({
      url: link.url,
      icon: RELATED_ICONS[link.kind],
      label: `${link.source}｜${link.title}`
    }))
    return {
      ...card,
      image: project.image,
      title: t(`projects.featured.items.${card.id}.title`),
      links: [...pullRequests, page, ...repositories, ...related]
    }
  })
)

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const updateEdges = () => {
  const element = track.value
  if (!element) return
  atStart.value = element.scrollLeft <= 1
  atEnd.value =
    element.scrollLeft + element.clientWidth >= element.scrollWidth - 1
}

// 一次捲動一張卡片的寬度；使用者偏好減少動態時直接跳過去
const scrollCards = direction => {
  const element = track.value
  const slide = element.querySelector('.card-slide')
  const gap = parseFloat(getComputedStyle(element).columnGap) || 0
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  element.scrollBy({
    left: direction * (slide.getBoundingClientRect().width + gap),
    behavior: reduceMotion ? 'auto' : 'smooth'
  })
}

useEventListener(track, 'scroll', updateEdges, { passive: true })
useResizeObserver(track, updateEdges)
onMounted(updateEdges)
</script>

<style scoped>
.card-track {
  --gap: 1.5rem;
  display: flex;
  gap: var(--gap);
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.card-track::-webkit-scrollbar {
  display: none;
}

/* 桌機顯示約三張半、平板兩張多、手機一張多，露出的下一張提示可以滑動 */
.card-slide {
  display: flex;
  flex: 0 0 calc((100% - 3 * var(--gap)) / 3.25);
  scroll-snap-align: start;
}

.home-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.home-card .card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 個人照片是正方形，裁成 16:9 時保留臉部 */
.home-card .card-media img.is-portrait {
  object-position: center 22%;
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 卡片很窄又常有長的英文識別字，左右對齊會拉出大空隙，改成靠左並允許斷字 */
.card-text {
  flex: 1;
  text-align: start;
  hyphens: auto;
  overflow-wrap: break-word;
}

.card-controls {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* 封面沿用首頁插圖的黑底、斜線圓與螢光綠圓圈 */
.project-cover {
  --cover-ink: #141414;
  --cover-stripe: #2c2c2c;
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--cover-ink);
}

.project-cover::before {
  content: '';
  position: absolute;
  top: -35%;
  right: -12%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: repeating-linear-gradient(
    135deg,
    var(--cover-stripe) 0 4px,
    transparent 4px 11px
  );
}

.project-cover-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  border: 3px solid var(--kageryo-green, #b0ff30);
  border-radius: 50%;
  color: var(--kageryo-green, #b0ff30);
  font-size: 1.6rem;
}

@media (max-width: 1023.98px) {
  .card-slide {
    flex-basis: calc((100% - 2 * var(--gap)) / 2.25);
  }
}

@media (max-width: 767.98px) {
  .card-track {
    --gap: 1rem;
  }

  .card-slide {
    flex-basis: 82%;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .card-track {
    scroll-behavior: smooth;
  }
}
</style>
