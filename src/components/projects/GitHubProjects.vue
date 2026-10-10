<template>
  <div class="ts-container has-top-spaced-large">
    <h2 class="ts-header is-big is-heavy">{{ $t('projects.github.header') }}</h2>
    <GitHubAccountTabs v-model="activeTab" :accounts="githubAccounts" />

    <div
      :id="`${activeTab}-panel`"
      role="tabpanel"
      :aria-labelledby="`${activeTab}-tab`"
      :aria-busy="isInitialLoading"
      tabindex="0"
    >
      <div v-if="isInitialLoading" class="ts-content is-center-aligned has-top-spaced" role="status" aria-live="polite">
        <div class="ts-loading"></div>
        <div class="ts-text is-secondary">{{ $t('projects.github.loading', { tab: activeAccount.label }) }}</div>
      </div>

      <div v-else-if="currentError && !currentProjects.length" class="ts-content is-center-aligned has-top-spaced" role="alert">
        <div class="ts-text is-warning">
          <div class="ts-icon is-circle-exclamation-icon"></div>
          <h3 class="ts-header is-large">{{ $t(`projects.github.errors.${errorKind}.title`) }}</h3>
          <div class="ts-text is-secondary has-top-spaced-small">
            {{ $t(`projects.github.errors.${errorKind}.desc`) }}
          </div>
          <div class="ts-text is-small has-top-spaced">
            {{ $t('projects.github.visitDirectly') }}<br>
            <a :href="activeAccount.profileUrl" target="_blank" rel="noopener noreferrer" class="ts-text is-link">
              {{ activeAccount.profileUrl.replace('https://', '') }}
            </a>
          </div>
          <button class="ts-button is-outlined has-top-spaced" type="button" @click="retryFetch">
            {{ $t('projects.github.retryBtn') }}
          </button>
        </div>
      </div>

      <GitHubProjectTable v-else-if="currentProjects.length" :repositories="currentProjects" />

      <div v-else class="ts-content is-center-aligned has-top-spaced">
        <div class="ts-text is-secondary">{{ $t('projects.github.noProjects') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { githubAccounts, githubAccountsByKey } from '../../config/githubAccounts'
import { useProjectStore } from '../../stores/projects'
import GitHubAccountTabs from './GitHubAccountTabs.vue'
import GitHubProjectTable from './GitHubProjectTable.vue'

const projectStore = useProjectStore()
const activeTab = ref(githubAccounts[0].key)
const activeAccount = computed(() => githubAccountsByKey[activeTab.value])
const currentProjects = computed(() => projectStore.projects[activeTab.value] || [])
const currentError = computed(() => projectStore.errorsByAccount[activeTab.value])
// 服務層沒有分類到的錯誤（例如程式錯誤）當作 GitHub 暫時無法使用
const errorKind = computed(() => currentError.value?.kind ?? 'unavailable')
const isInitialLoading = computed(
  () => projectStore.loadingByAccount[activeTab.value] && currentProjects.value.length === 0
)

const retryFetch = () => projectStore.fetchProjects(activeTab.value, { force: true }).catch(() => {})

watch(activeTab, accountKey => {
  projectStore.fetchProjects(accountKey).catch(() => {})
})

onMounted(() => {
  projectStore.fetchProjects(activeTab.value).catch(() => {})
})
</script>
