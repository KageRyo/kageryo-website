import { nextTick, ref, watch } from 'vue'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

export const useDrawerFocus = (visible, close) => {
  const drawer = ref(null)
  const closeButton = ref(null)
  let returnFocusElement = null

  const trapFocus = event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab' || !drawer.value) return

    const focusableElements = [
      ...drawer.value.querySelectorAll(focusableSelector)
    ]
    if (!focusableElements.length) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  watch(visible, async isVisible => {
    if (isVisible) {
      returnFocusElement = document.activeElement
      await nextTick()
      closeButton.value?.focus()
      return
    }

    await nextTick()
    returnFocusElement?.focus?.()
    returnFocusElement = null
  })

  return { drawer, closeButton, trapFocus }
}
