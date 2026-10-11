<template>
  <!-- 未完成功能模態框 -->
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    ref="modalDialog"
    class="ts-modal"
    :open="modalStore.unfinishedModalVisible"
    aria-labelledby="unfinished-modal-title"
    @cancel.prevent="modalStore.closeUnfinishedModal"
    @close="modalStore.closeUnfinishedModal"
    @click="handleBackdropClick"
  >
    <div class="content">
      <div class="ts-content">
        <h2 id="unfinished-modal-title" class="ts-header is-icon">
          <span class="ts-icon is-circle-exclamation-icon"></span>
          這個功能還沒有開放
        </h2>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content">如果您有其他問題，歡迎到此專案的 GitHub。</div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <button
          class="ts-button is-fluid"
          @click="modalStore.closeUnfinishedModal"
        >
          了解
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useModalStore } from '../../stores/modal'

const modalStore = useModalStore()
const modalDialog = ref(null)

// 監聽模態框狀態變化
watch(
  () => modalStore.unfinishedModalVisible,
  newVal => {
    if (newVal && modalDialog.value) {
      modalDialog.value.showModal()
    } else if (modalDialog.value) {
      modalDialog.value.close()
    }
  }
)

// 處理點擊背景關閉
const handleBackdropClick = event => {
  if (event.target === modalDialog.value) {
    modalStore.closeUnfinishedModal()
  }
}
</script>
