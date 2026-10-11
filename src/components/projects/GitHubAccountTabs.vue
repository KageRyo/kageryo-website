<template>
  <div
    class="ts-tab is-pilled has-vertically-spaced"
    role="tablist"
    :aria-label="$t('projects.github.header')"
  >
    <button
      v-for="(account, index) in accounts"
      :key="account.key"
      :ref="element => (tabRefs[index] = element)"
      class="item"
      :class="{ 'is-active': modelValue === account.key }"
      :id="`${account.key}-tab`"
      role="tab"
      :tabindex="modelValue === account.key ? 0 : -1"
      :aria-controls="`${account.key}-panel`"
      :aria-selected="modelValue === account.key"
      type="button"
      @click="selectAccount(account.key)"
      @keydown="handleKeydown($event, index)"
    >
      {{ account.label }}
    </button>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
  accounts: { type: Array, required: true },
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])
const tabRefs = ref([])

const selectAccount = accountKey => emit('update:modelValue', accountKey)

const focusTab = async index => {
  const normalizedIndex =
    (index + props.accounts.length) % props.accounts.length
  selectAccount(props.accounts[normalizedIndex].key)
  await nextTick()
  tabRefs.value[normalizedIndex]?.focus()
}

const handleKeydown = (event, index) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusTab(index + 1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusTab(index - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusTab(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusTab(props.accounts.length - 1)
  }
}
</script>
