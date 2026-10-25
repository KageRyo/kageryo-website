import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export const useHighlightCarousel = count => {
  const current = ref(0)
  const playing = ref(true)
  const hovering = ref(false)
  const focusWithin = ref(false)
  const hidden = ref(false)
  let mounted = false
  let timer
  let motion

  const restart = () => {
    clearTimeout(timer)
    if (
      !mounted ||
      !playing.value ||
      hovering.value ||
      focusWithin.value ||
      hidden.value
    )
      return
    timer = setTimeout(() => showSlide(current.value + 1), 5000)
  }

  const showSlide = index => {
    current.value = (index + count) % count
    restart()
  }
  const togglePlayback = () => {
    playing.value = !playing.value
  }
  const updateVisibility = () => {
    hidden.value = document.hidden
  }
  const updateMotion = () => {
    if (motion.matches) playing.value = false
  }

  watch([playing, hovering, focusWithin, hidden], restart, { flush: 'sync' })
  onMounted(() => {
    motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    updateMotion()
    updateVisibility()
    motion.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    mounted = true
    restart()
  })
  onBeforeUnmount(() => {
    mounted = false
    clearTimeout(timer)
    motion?.removeEventListener('change', updateMotion)
    document.removeEventListener('visibilitychange', updateVisibility)
  })

  return {
    current,
    playing,
    hovering,
    focusWithin,
    hidden,
    showSlide,
    togglePlayback
  }
}
