<template>
  <header class="ts-app-topbar has-dark">
    <div class="start">
      <router-link to="/" class="item is-text">KageRyo Developer</router-link>
    </div>

    <div class="end">
      <nav
        class="ts-tab tablet-:has-hidden"
        :aria-label="t('ui.navigation.primary')"
      >
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
        :title="
          themeStore.theme === 'is-dark'
            ? t('ui.theme.light')
            : t('ui.theme.dark')
        "
        :aria-label="
          themeStore.theme === 'is-dark'
            ? t('ui.theme.light')
            : t('ui.theme.dark')
        "
        type="button"
        @click="themeStore.toggleTheme"
      >
        <span
          class="ts-icon"
          :class="
            themeStore.theme === 'is-dark' ? 'is-moon-icon' : 'is-sun-icon'
          "
        ></span>
      </button>

      <div ref="languagePicker" class="language-picker">
        <button
          ref="languageTrigger"
          class="ts-button is-secondary language-trigger"
          type="button"
          aria-haspopup="menu"
          aria-controls="language-menu"
          :aria-label="`${t('ui.language.label')}: ${currentLanguage.label}`"
          :aria-expanded="languageMenuOpen"
          :aria-busy="languageBusy"
          :aria-describedby="languageError ? 'language-error' : undefined"
          @click="toggleLanguageMenu"
          @keydown="onLanguageTriggerKeydown"
        >
          <span class="ts-icon is-globe-icon" aria-hidden="true"></span>
          <span>{{ currentLanguage.label }}</span>
          <span
            class="ts-icon is-angle-down-icon language-chevron"
            aria-hidden="true"
          ></span>
        </button>
        <div
          v-show="languageMenuOpen"
          id="language-menu"
          class="ts-dropdown language-menu"
          role="menu"
          tabindex="-1"
          :aria-label="t('ui.language.label')"
          @keydown="onLanguageMenuKeydown"
        >
          <button
            v-for="(option, index) in localeOptions"
            :key="option.key"
            :ref="element => setLanguageOption(element, index)"
            class="item language-option"
            type="button"
            role="menuitemradio"
            :lang="option.key"
            :aria-checked="locale === option.key"
            :disabled="languageBusy"
            tabindex="-1"
            @click="changeLocale(option.key)"
          >
            {{ option.label }}
            <span
              v-if="locale === option.key"
              class="ts-icon is-check-icon"
              aria-hidden="true"
            ></span>
          </button>
        </div>
        <span
          v-if="languageError"
          id="language-error"
          class="visually-hidden"
          role="alert"
          >{{ t('ui.language.failed') }}</span
        >
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const languagePicker = ref(null)
const languageTrigger = ref(null)
const languageMenuOpen = ref(false)
const languageBusy = ref(false)
const languageError = ref(false)
const languageOptions = []
const currentLanguage = computed(() =>
  localeOptions.find(option => option.key === locale.value)
)

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
  },
  { immediate: true }
)

const setLanguageOption = (element, index) => {
  languageOptions[index] = element
}

const focusLanguageOption = index => languageOptions[index]?.focus()

const openLanguageMenu = async (focus = 'current') => {
  if (languageBusy.value) return
  languageError.value = false
  languageMenuOpen.value = true
  await nextTick()
  const index =
    focus === 'first'
      ? 0
      : focus === 'last'
        ? localeOptions.length - 1
        : localeOptions.findIndex(option => option.key === locale.value)
  focusLanguageOption(index)
}

const closeLanguageMenu = (restoreFocus = false) => {
  languageMenuOpen.value = false
  if (restoreFocus) nextTick(() => languageTrigger.value?.focus())
}

const toggleLanguageMenu = () => {
  if (languageMenuOpen.value) closeLanguageMenu()
  else openLanguageMenu()
}

const onLanguageTriggerKeydown = event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openLanguageMenu(event.key === 'ArrowDown' ? 'first' : 'last')
  }
}

const onLanguageMenuKeydown = event => {
  const current = languageOptions.indexOf(document.activeElement)
  let target
  if (event.key === 'ArrowDown') target = (current + 1) % localeOptions.length
  else if (event.key === 'ArrowUp')
    target = (current - 1 + localeOptions.length) % localeOptions.length
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = localeOptions.length - 1
  else if (event.key === 'Escape') {
    event.preventDefault()
    closeLanguageMenu(true)
    return
  } else if (event.key === 'Tab') {
    closeLanguageMenu()
    return
  } else return
  event.preventDefault()
  focusLanguageOption(target)
}

const onOutsidePointerDown = event => {
  if (languageMenuOpen.value && !languagePicker.value?.contains(event.target))
    closeLanguageMenu()
}

onMounted(() => document.addEventListener('pointerdown', onOutsidePointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', onOutsidePointerDown)
)

// 文字載入成功後才記錄使用者的明確選擇；失敗時保留目前語言與偏好設定。
const changeLocale = async value => {
  if (languageBusy.value) return
  languageBusy.value = true
  languageError.value = false
  try {
    await setLocale(value)
    localStorage.setItem('locale', value)
    closeLanguageMenu(true)
  } catch (error) {
    languageError.value = true
    closeLanguageMenu(true)
  } finally {
    languageBusy.value = false
  }
}

const toggleMobileMenu = () => {
  modalStore.toggleMobileMenu()
}
</script>

<style scoped>
.language-picker {
  position: relative;
  flex: 0 0 auto;
}

.ts-app-topbar .language-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding-inline: 0.7rem;
  color: #fff;
  white-space: nowrap;
}

.ts-app-topbar .language-trigger:hover,
.ts-app-topbar .language-trigger[aria-expanded='true'] {
  background: rgb(255 255 255 / 0.12);
}

.language-chevron {
  margin-left: 0.15rem;
  font-size: 0.8em;
}

.language-menu {
  position: absolute;
  top: calc(100% + 0.45rem);
  right: 0;
  z-index: 120;
  display: grid;
  min-width: 11rem;
  padding: 0.3rem;
  border: 1px solid light-dark(#d5d9d0, #4d5447);
  border-radius: 0.45rem;
  background: light-dark(#fff, #242824);
  box-shadow: 0 0.55rem 1.5rem rgb(0 0 0 / 0.2);
}

.language-option {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0.6rem 0.7rem;
  border: 0;
  border-radius: 0.25rem;
  background: transparent;
  color: light-dark(#202520, #f3f6ef);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.language-option:hover,
.language-option:focus-visible {
  background: light-dark(#edf3e6, #3b4632);
}

.language-option[aria-checked='true'] .ts-icon {
  color: var(--kageryo-accent);
}

.ts-app-topbar .language-trigger:focus-visible,
.language-option:focus-visible {
  outline-color: var(--kageryo-green);
}

@media (max-width: 390px) {
  .ts-app-topbar .language-trigger {
    gap: 0.3rem;
    padding-inline: 0.45rem;
  }
}
</style>
