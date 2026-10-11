import { createI18n } from 'vue-i18n'

const SUPPORTED_LOCALES = ['zh-TW', 'en', 'ja']
const savedLocale = localStorage.getItem('locale')
const preferredLanguage = navigator.languages?.[0] || navigator.language || 'en'
const language = preferredLanguage.toLowerCase().split('-')[0]
const browserLocale =
  language === 'zh' ? 'zh-TW' : language === 'ja' ? 'ja' : 'en'

export const initialLocale = SUPPORTED_LOCALES.includes(savedLocale)
  ? savedLocale
  : browserLocale

// 每種語言都獨立載入，首次顯示前只下載訪客使用的語言。
const loaders = {
  'zh-TW': () => import('./locales/zh-TW.js'),
  en: () => import('./locales/en.js'),
  ja: () => import('./locales/ja.js')
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {}
})

export const loadLocaleMessages = async locale => {
  if (i18n.global.availableLocales.includes(locale)) return
  const { default: messages } = await loaders[locale]()
  i18n.global.setLocaleMessage(locale, messages)
}

let requestedLocale = initialLocale

// 文字載入後才切換語言；連續切換時以最後選的語言為準
export const setLocale = async locale => {
  requestedLocale = locale
  await loadLocaleMessages(locale)
  if (requestedLocale === locale) i18n.global.locale.value = locale
}

export default i18n
