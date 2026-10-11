<template>
  <div class="tablet+:column tablet+:is-8-wide">
    <h2 class="ts-header is-big is-heavy">{{ $t('contact.form.header') }}</h2>
    <div class="ts-container is-very-narrow has-top-spaced-large">
      <form @submit.prevent="showEmailPreview">
        <label for="contact-name" class="ts-text is-label">{{
          $t('contact.form.name')
        }}</label>
        <div class="ts-input is-underlined is-fluid has-top-spaced">
          <input
            id="contact-name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            :placeholder="$t('contact.form.namePlaceholder')"
            required
          />
        </div>

        <label
          for="contact-email"
          class="ts-text is-label has-top-spaced-large"
          >{{ $t('contact.form.email') }}</label
        >
        <div class="ts-input is-underlined is-fluid has-top-spaced">
          <input
            id="contact-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            :placeholder="$t('contact.form.emailPlaceholder')"
            required
          />
        </div>

        <label
          for="contact-message"
          class="ts-text is-label has-top-spaced-large"
          >{{ $t('contact.form.message') }}</label
        >
        <div
          class="ts-input is-resizable is-underlined is-fluid has-top-spaced"
        >
          <textarea
            id="contact-message"
            v-model="form.message"
            :placeholder="$t('contact.form.messagePlaceholder')"
            required
          ></textarea>
        </div>

        <button
          class="ts-button is-fluid is-start-icon has-top-spaced has-bottom-spaced-large"
          type="submit"
        >
          <span class="ts-icon is-envelope-open-text-icon"></span>
          {{ $t('contact.form.send') }}
        </button>
      </form>

      <EmailPreviewModal
        v-model:visible="modalVisible"
        :recipient="emailContent.recipient"
        :subject="emailContent.subject"
        :body="emailContent.body"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EmailPreviewModal from './EmailPreviewModal.vue'
import {
  buildMailBody,
  buildMailSubject,
  CONTACT_EMAIL
} from '../../composables/useMailto'

const { t } = useI18n({ useScope: 'global' })
const form = reactive({ name: '', email: '', message: '' })
const modalVisible = ref(false)

const emailContent = computed(() => ({
  recipient: CONTACT_EMAIL,
  subject: buildMailSubject(t, form),
  body: buildMailBody(t, form)
}))

const showEmailPreview = () => {
  modalVisible.value = true
}
</script>
