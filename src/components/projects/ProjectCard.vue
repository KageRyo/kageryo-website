<template>
  <div class="tablet+:column tablet+:is-8-wide mobile:ts-content">
    <article :id="`project-${project.id}`" class="ts-box project-card">
      <!-- 已確認可公開的截圖或照片 -->
      <div v-if="project.image" class="ts-image project-card-media">
        <img
          :src="project.image.src"
          :srcset="project.image.srcset"
          sizes="(min-width: 1024px) 800px, calc(100vw - 32px)"
          :width="project.image.width"
          :height="project.image.height"
          :alt="$t(`${itemKey}.imageAlt`)"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="ts-content is-secondary">
        <div class="ts-text is-description">
          {{ $t(`${itemKey}.category`) }}
        </div>
        <h3 class="ts-header is-heavy">{{ $t(`${itemKey}.title`) }}</h3>
        <div class="ts-text is-description">
          {{ $t(`${itemKey}.period`) }}
          <template v-if="$te(`${itemKey}.role`)">
            · {{ $t(`${itemKey}.role`) }}</template
          >
        </div>
        <p>{{ $t(`${itemKey}.summary`) }}</p>
        <div class="ts-wrap is-compact">
          <span
            v-for="tech in project.stack"
            :key="tech"
            class="ts-chip is-small"
            >{{ tech }}</span
          >
        </div>

        <!-- 連結各自獨立，不包在整張卡片的超連結裡 -->
        <div v-if="project.links.length" class="ts-wrap has-top-spaced">
          <a
            v-for="link in project.links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="ts-button is-small is-outlined is-start-icon"
          >
            <span
              class="ts-icon"
              :class="
                link.status === 'merged'
                  ? 'is-code-merge-icon'
                  : 'is-code-pull-request-icon'
              "
            ></span>
            {{ link.label }} ·
            {{ $t(`projects.featured.status.${link.status}`) }}
          </a>
        </div>
        <!-- 公開的程式碼庫 -->
        <div v-if="project.repositories?.length" class="ts-wrap has-top-spaced">
          <a
            v-for="repository in project.repositories"
            :key="repository.url"
            :href="repository.url"
            target="_blank"
            rel="noopener noreferrer"
            class="ts-button is-small is-outlined is-start-icon"
          >
            <span class="ts-icon is-github-icon"></span>
            {{ repository.label }}
          </a>
        </div>
        <div
          v-if="!project.links.length && !project.repositories?.length"
          class="ts-text is-description has-top-spaced"
        >
          <span class="ts-icon is-lock-icon"></span>
          {{ $t('projects.featured.privateSource') }}
        </div>

        <!-- 相關報導、計畫頁與論文，來源與標題沿用原文 -->
        <div v-if="project.related?.length" class="project-related">
          <div class="ts-text is-bold">
            {{ $t('projects.featured.related') }}
          </div>
          <ul>
            <li v-for="link in project.related" :key="link.url">
              <span
                class="ts-icon"
                :class="RELATED_ICONS[link.kind]"
                aria-hidden="true"
              ></span>
              <span class="ts-text is-description">{{ link.source }}</span>
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :lang="link.lang"
                class="ts-text is-external-link"
                >{{ link.title }}</a
              >
            </li>
          </ul>
        </div>
        <router-link
          v-if="project.detail"
          :to="`/projects/${project.detail}`"
          class="ts-button is-small is-start-icon has-top-spaced-small"
        >
          <span class="ts-icon is-book-open-icon"></span>
          {{ $t('projectDetail.viewDetails') }}
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true }
})

const itemKey = computed(() => `projects.featured.items.${props.project.id}`)

const RELATED_ICONS = {
  news: 'is-newspaper-icon',
  page: 'is-globe-icon',
  paper: 'is-file-lines-icon'
}
</script>

<style scoped>
.project-card {
  height: 100%;
  overflow: hidden;
}

.project-card-media {
  aspect-ratio: 16 / 9;
}

.project-card .project-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-related {
  margin-top: 1rem;
}

.project-related ul {
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
}

.project-related li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 0.5rem;
}

.project-related li + li {
  margin-top: 0.35rem;
}
</style>
