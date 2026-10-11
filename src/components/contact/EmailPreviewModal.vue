<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <dialog
    ref="dialog"
    class="ts-modal"
    aria-labelledby="email-preview-title"
    @cancel.prevent="close"
    @click="handleBackdropClick"
  >
    <div class="content">
      <div class="ts-content has-vertically-padded">
        <h2
          id="email-preview-title"
          class="ts-header is-large has-bottom-spaced"
        >
          <span class="ts-icon is-envelope-icon"></span>
          {{ $t('contact.form.emailModal.title') }}
        </h2>
        <p class="ts-text is-secondary has-bottom-spaced">
          {{ $t('contact.form.emailModal.desc') }}
        </p>

        <div
          class="ts-content is-secondary is-dense is-rounded has-bottom-spaced"
        >
          <div class="ts-text is-label">
            {{ $t('contact.form.emailModal.recipient') }}
          </div>
          <div class="ts-text is-code">{{ recipient }}</div>
        </div>
        <div
          class="ts-content is-secondary is-dense is-rounded has-bottom-spaced"
        >
          <div class="ts-text is-label">
            {{ $t('contact.form.emailModal.subject') }}
          </div>
          <div class="ts-text is-code">{{ subject }}</div>
        </div>
        <div class="ts-content is-secondary is-dense is-rounded">
          <div class="ts-text is-label">
            {{ $t('contact.form.emailModal.body') }}
          </div>
          <div class="ts-text is-code email-body">{{ body }}</div>
        </div>
        <p
          v-if="status"
          class="ts-text is-secondary has-top-spaced-small"
          role="status"
        >
          {{ status }}
        </p>
      </div>

      <div class="ts-divider"></div>

      <div class="ts-content is-tertiary">
        <div class="ts-grid is-3-columns">
          <div class="column">
            <button
              class="ts-button is-fluid"
              type="button"
              @click="copyEmailContent"
            >
              <span class="ts-icon is-copy-icon"></span>
              {{ $t('contact.form.emailModal.copyAll') }}
            </button>
          </div>
          <div class="column">
            <a
              class="ts-button is-fluid"
              :href="mailtoUrl"
              @click="openMailClient"
            >
              <span class="ts-icon is-envelope-icon"></span>
              {{ $t('contact.form.emailModal.openMail') }}
            </a>
          </div>
          <div class="column">
            <button
              class="ts-button is-outlined is-fluid"
              type="button"
              @click="close"
            >
              {{ $t('contact.form.emailModal.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyText, createMailtoUrl } from '../../composables/useMailto'

const props = defineProps({
  visible: Boolean,
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true }
})

const emit = defineEmits(['update:visible'])
const { t } = useI18n({ useScope: 'global' })
const dialog = ref(null)
const status = ref('')

const mailtoUrl = computed(() =>
  createMailtoUrl({
    recipient: props.recipient,
    subject: props.subject,
    body: props.body
  })
)

watch(
  () => props.visible,
  visible => {
    status.value = ''
    if (visible) {
      dialog.value?.showModal()
    } else if (dialog.value?.open) {
      dialog.value.close()
    }
  }
)

const emailContent = computed(
  () => `${props.recipient}\n${props.subject}\n\n${props.body}`
)

const copyEmailContent = async () => {
  const copied = await copyText(emailContent.value)
  status.value = copied
    ? t('contact.form.emailModal.copySuccess')
    : t('contact.form.emailModal.copyFail')
}

const close = () => emit('update:visible', false)

// mailto 無法得知郵件程式是否真的開啟，保留內容讓使用者可以改用複製
const openMailClient = () => {
  status.value = t('contact.form.mailOpened')
}

const handleBackdropClick = event => {
  if (event.target === dialog.value) {
    close()
  }
}
</script>

<style scoped>
.email-body {
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
