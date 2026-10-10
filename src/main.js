import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n, { initialLocale, loadLocaleMessages } from './i18n'

// 上次選了英文或日文的訪客，先載入該語言的文字再顯示畫面
await loadLocaleMessages(initialLocale)

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
