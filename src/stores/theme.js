import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const THEME_PREFERENCE_KEY = 'themePreference'
const LEGACY_THEME_KEY = 'theme'
const LEGACY_THEME_SOURCE_KEY = 'themeSource'

const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getStoredPreference = () => {
  const preference = localStorage.getItem(THEME_PREFERENCE_KEY)
  if (
    preference === 'light' ||
    preference === 'dark' ||
    preference === 'system'
  ) {
    return preference
  }

  if (localStorage.getItem(LEGACY_THEME_SOURCE_KEY) === 'system') {
    return 'system'
  }

  const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY)
  if (legacyTheme === 'is-dark' || legacyTheme === 'is-light') {
    return legacyTheme === 'is-dark' ? 'dark' : 'light'
  }

  return 'system'
}

export const useThemeStore = defineStore('theme', () => {
  const themeSource = ref(getStoredPreference())
  const systemTheme = ref(getSystemTheme())
  const theme = computed(
    () =>
      `is-${themeSource.value === 'system' ? systemTheme.value : themeSource.value}`
  )
  let mediaQuery
  let initialized = false

  const applyTheme = () => {
    const root = document.documentElement
    root.classList.toggle('is-dark', theme.value === 'is-dark')
    root.classList.toggle('is-light', theme.value === 'is-light')
  }

  const saveThemePreference = () => {
    localStorage.setItem(THEME_PREFERENCE_KEY, themeSource.value)
  }

  const setTheme = newTheme => {
    themeSource.value =
      newTheme === 'is-dark' || newTheme === 'dark' ? 'dark' : 'light'
    saveThemePreference()
    applyTheme()
  }

  const setSystemTheme = () => {
    themeSource.value = 'system'
    saveThemePreference()
    applyTheme()
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'is-light' ? 'dark' : 'light')
  }

  const detectSystemTheme = () => `is-${getSystemTheme()}`

  const initTheme = () => {
    if (initialized) {
      applyTheme()
      return
    }

    initialized = true
    mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (mediaQuery) {
      systemTheme.value = mediaQuery.matches ? 'dark' : 'light'
      mediaQuery.addEventListener('change', event => {
        systemTheme.value = event.matches ? 'dark' : 'light'
        if (themeSource.value === 'system') {
          applyTheme()
        }
      })
    }
    applyTheme()
  }

  return {
    theme,
    themeSource,
    setTheme,
    setSystemTheme,
    toggleTheme,
    detectSystemTheme,
    initTheme
  }
})
