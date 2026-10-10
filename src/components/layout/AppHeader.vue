<template>
  <header class="ts-app-topbar has-dark">
    <div class="start">
      <router-link to="/" class="item is-text">KageRyo Developer</router-link>
    </div>

    <div class="end">
      <nav class="ts-tab mobile:has-hidden" :aria-label="t('ui.navigation.primary')">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="item"
          :class="{ 'is-active': isActiveNavPath($route.path, item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <button
        class="ts-button is-icon is-secondary"
        :title="themeStore.theme === 'is-dark' ? t('ui.theme.light') : t('ui.theme.dark')"
        :aria-label="themeStore.theme === 'is-dark' ? t('ui.theme.light') : t('ui.theme.dark')"
        type="button"
        @click="themeStore.toggleTheme"
      >
        <span class="ts-icon" :class="themeStore.theme === 'is-dark' ? 'is-moon-icon' : 'is-sun-icon'"></span>
      </button>

      <div class="ts-select is-basic">
        <label class="visually-hidden" for="language-select">{{ t('ui.language.label') }}</label>
        <select id="language-select" :value="locale" :aria-label="t('ui.language.label')" @change="changeLocale">
          <option v-for="option in localeOptions" :key="option.key" :value="option.key">
            {{ option.label }}
          </option>
        </select>
      </div>

      <button
        class="ts-button is-icon desktop+:has-hidden"
        type="button"
        aria-controls="mobile-navigation"
        :aria-expanded="modalStore.mobileMenuVisible"
        :aria-label="t('ui.drawer.title')"
        @click="toggleMobileMenu"
      >
        <span class="ts-icon is-bars-icon"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { isActiveNavPath } from '../../router/guards'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n'
import { useModalStore } from '../../stores/modal'
import { useThemeStore } from '../../stores/theme'

const localeOptions = [
  { key: 'zh-TW', label: '正體中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' }
]

const themeStore = useThemeStore()
const modalStore = useModalStore()
const { t, locale } = useI18n({ useScope: 'global' })

const navItems = computed(() => [
  { name: 'home', path: '/', label: t('nav.home') },
  { name: 'about', path: '/about', label: t('nav.about') },
  { name: 'projects', path: '/projects', label: t('nav.projects') },
  { name: 'contact', path: '/contact', label: t('nav.contact') }
])

watch(
  locale,
  value => {
    document.documentElement.lang = value
    localStorage.setItem('locale', value)
  },
  { immediate: true }
)

// 語言的文字是切換時才下載，下載失敗（例如網路斷線）就維持原本的語言，選單也改回去
const changeLocale = async ({ target }) => {
  try {
    await setLocale(target.value)
  } catch (error) {
    target.value = locale.value
    throw error
  }
}

const toggleMobileMenu = () => {
  modalStore.toggleMobileMenu()
}

</script>
