<template>
  <div v-if="media.length || coverage.length">
    <!-- 截圖與成果照片：一律附說明與來源 -->
    <div v-if="media.length" class="media-grid">
      <figure v-for="item in media" :key="item.src" class="media-figure">
        <div class="ts-image is-rounded">
          <img
            :src="item.src"
            :width="item.width"
            :height="item.height"
            :alt="$t(item.altKey)"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption class="ts-text is-description">
          {{ $t(item.captionKey) }}
          <i18n-t
            v-if="item.credit"
            keypath="projectDetail.credit"
            tag="span"
            class="media-credit"
          >
            <template #source>
              <a
                :href="item.credit.url"
                target="_blank"
                rel="noopener noreferrer"
                >{{ item.credit.label }}</a
              >
            </template>
          </i18n-t>
        </figcaption>
      </figure>
    </div>

    <!-- 公開報導：來源、日期與原文標題 -->
    <template v-if="coverage.length">
      <h3 class="ts-header is-heavy coverage-title">
        {{ $t(coverageTitleKey) }}
      </h3>
      <ul class="coverage-list">
        <li v-for="item in coverage" :key="item.url" class="coverage-entry">
          <div class="ts-text is-description">
            {{ item.source }} ·
            <time :datetime="item.date">{{ formatDate(item.date) }}</time>
          </div>
          <a
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :lang="item.lang"
            class="ts-text is-external-link"
            >{{ item.title }}</a
          >
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  media: { type: Array, default: () => [] },
  coverage: { type: Array, default: () => [] },
  coverageTitleKey: { type: String, default: 'projectDetail.coverage' }
})

const { locale } = useI18n({ useScope: 'global' })

// 報導日期以 YYYY-MM-DD 記錄，依目前語系顯示；固定用 UTC 避免時區把日期往前推一天
const formatDate = date =>
  new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`))
</script>

<style scoped>
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.5rem;
}

.media-figure {
  margin: 0;
}

.media-figure figcaption {
  margin-top: 0.5rem;
}

.media-credit {
  margin-left: 0.25rem;
}

.coverage-title {
  margin: 0;
}

.media-grid + .coverage-title {
  margin-top: 2rem;
}

.coverage-list {
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}

.coverage-entry {
  padding: 0.75rem 0;
}

.coverage-entry + .coverage-entry {
  border-top: 1px solid var(--ts-gray-200);
}
</style>
