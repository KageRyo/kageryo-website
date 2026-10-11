<template>
  <div class="ts-container has-top-spaced-large">
    <h2 class="ts-header is-big is-heavy">{{ $t('projects.tools.header') }}</h2>
    <p class="ts-text is-secondary">{{ $t('projects.tools.description') }}</p>
    <div class="ts-grid is-relaxed tablet+:is-3-columns">
      <div
        v-for="tool in openSourceTools"
        :key="tool.id"
        class="column mobile:ts-content"
      >
        <article class="ts-box tool-card">
          <div class="ts-content">
            <h3 class="ts-header is-heavy">
              <a
                :href="tool.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ts-text is-external-link"
                >{{ tool.name }}</a
              >
            </h3>
            <span class="ts-chip is-small">{{ tool.language }}</span>
            <p class="ts-text is-secondary">
              {{ $t(`projects.tools.items.${tool.id}`) }}
            </p>
            <a
              v-if="tool.packageUrl"
              :href="tool.packageUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ts-text is-external-link is-small"
              >PyPI</a
            >
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { openSourceTools } from '../../config/featuredProjects'
</script>

<style scoped>
.tool-card {
  height: 100%;
}
</style>
