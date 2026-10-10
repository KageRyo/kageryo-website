import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.js'

const DEFAULT_LOCALE = 'zh-TW'
const SUPPORTED_LOCALES = ['zh-TW', 'en', 'ja']
const savedLocale = localStorage.getItem('locale')
export const initialLocale = SUPPORTED_LOCALES.includes(savedLocale) ? savedLocale : DEFAULT_LOCALE

// 預設的正體中文跟著主程式下載；英文與日文切換到時才下載
const loaders = {
  en: () => import('./locales/en.js'),
  ja: () => import('./locales/ja.js')
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    [DEFAULT_LOCALE]: zhTW
  }
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
