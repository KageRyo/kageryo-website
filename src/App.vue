<template>
  <div id="app">
    <a class="skip-link" href="#main-content">{{ $t('ui.skipToMain') }}</a>
    <!-- 頂部導航欄 -->
    <AppHeader />

    <!-- 主要內容區域 -->
    <main id="main-content" tabindex="-1">
      <router-view />
    </main>

    <!-- 底部 -->
    <AppFooter />

    <!-- 全局模組 -->
    <MobileDrawer />
    <UnfinishedModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from './stores/theme'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import MobileDrawer from './components/layout/MobileDrawer.vue'
import UnfinishedModal from './components/common/UnfinishedModal.vue'

const themeStore = useThemeStore()
onMounted(() => {
  themeStore.initTheme()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
