import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const unfinishedModalVisible = ref(false)
  const mobileMenuVisible = ref(false)

  const showUnfinishedModal = () => {
    unfinishedModalVisible.value = true
  }

  const closeUnfinishedModal = () => {
    unfinishedModalVisible.value = false
  }

  const toggleMobileMenu = () => {
    mobileMenuVisible.value = !mobileMenuVisible.value
  }

  const closeMobileMenu = () => {
    mobileMenuVisible.value = false
  }

  return {
    unfinishedModalVisible,
    mobileMenuVisible,
    showUnfinishedModal,
    closeUnfinishedModal,
    toggleMobileMenu,
    closeMobileMenu
  }
})
