<template>
  <!-- 背景遮罩 -->
  <button
    v-if="modalStore.mobileMenuVisible"
    class="drawer-backdrop"
    @click="modalStore.closeMobileMenu"
    :aria-label="t('ui.drawer.close')"
    type="button"
  ></button>

  <div
    id="mobile-navigation"
    ref="drawer"
    class="ts-app-drawer is-end"
    :class="{ 'is-visible': modalStore.mobileMenuVisible }"
    :inert="!modalStore.mobileMenuVisible"
    :aria-hidden="!modalStore.mobileMenuVisible"
    aria-modal="true"
    aria-labelledby="mobile-navigation-title"
    role="dialog"
    @keydown="trapFocus"
  >
    <div class="content">
      <div class="ts-app-sidebar">
        <!-- 頂部區域包含標題和關閉按鈕 -->
        <div class="ts-content is-padded">
          <div class="ts-grid is-middle-aligned">
            <div class="column">
              <h2
                id="mobile-navigation-title"
                class="ts-header is-large is-heavy is-text"
              >
                {{ t('ui.drawer.title') }}
              </h2>
            </div>
            <div class="column is-fluid"></div>
            <div class="column">
              <button
                ref="closeButton"
                class="ts-button is-rounded is-outlined is-small"
                @click="handleCloseClick"
                :aria-label="t('ui.drawer.close')"
                type="button"
              >
                <span class="ts-icon is-xmark-icon"></span>
              </button>
            </div>
          </div>
        </div>

        <div class="ts-divider"></div>

        <!-- 導航項目 -->
        <div class="ts-menu is-separated is-start-icon">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="item is-indented"
            :class="{ 'is-active': isActiveNavPath($route.path, item.path) }"
            @click="handleNavClick"
          >
            <span class="ts-icon" :class="item.icon"></span>
            {{ item.label }}
          </router-link>
        </div>

        <div class="ts-divider"></div>

        <!-- 底部資訊 -->
        <div class="ts-content is-padded">
          <div class="item is-indented is-disabled">KageRyo Developer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isActiveNavPath } from '../../router/guards'
import { computed, toRef } from 'vue'
import { useModalStore } from '../../stores/modal'
import { useI18n } from 'vue-i18n'
import { useDrawerFocus } from '../../composables/useDrawerFocus'

const modalStore = useModalStore()

const { t } = useI18n({ useScope: 'global' })
const { drawer, closeButton, trapFocus } = useDrawerFocus(
  toRef(modalStore, 'mobileMenuVisible'),
  modalStore.closeMobileMenu
)

const navItems = computed(() => [
  { name: 'home', path: '/', label: t('nav.home'), icon: 'is-house-icon' },
  {
    name: 'about',
    path: '/about',
    label: t('nav.about'),
    icon: 'is-user-icon'
  },
  {
    name: 'projects',
    path: '/projects',
    label: t('nav.projects'),
    icon: 'is-folder-icon'
  },
  {
    name: 'contact',
    path: '/contact',
    label: t('nav.contact'),
    icon: 'is-envelope-icon'
  }
])

// 處理關閉按鈕點擊
const handleCloseClick = () => {
  modalStore.closeMobileMenu()
}

// 處理導航項目點擊
const handleNavClick = () => {
  modalStore.closeMobileMenu()
}
</script>
