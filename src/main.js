import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n, { initialLocale, loadLocaleMessages } from './i18n'

// 依手動選擇或瀏覽器偏好語言載入文字，再顯示第一個畫面
await loadLocaleMessages(initialLocale)

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.use(router)
app.mount('#app')
