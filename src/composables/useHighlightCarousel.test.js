import { createRenderer } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHighlightCarousel } from './useHighlightCarousel'

// The composable owns browser listeners and a Vue mount lifecycle, but needs no DOM.
const renderer = createRenderer({
  createComment: () => ({}),
  insert: () => {},
  remove: () => {},
  parentNode: () => null,
  nextSibling: () => null
})
let visibility
let motion
let unmount

const mount = () => {
  let state
  const app = renderer.createApp({
    setup() {
      state = useHighlightCarousel(3)
      return () => null
    }
  })
  app.mount({})
  unmount = () => app.unmount()
  return state
}

const setHidden = hidden => {
  visibility.hidden = hidden
  visibility.dispatchEvent(new Event('visibilitychange'))
}

const setMotion = matches => {
  motion.matches = matches
  motion.dispatchEvent(new Event('change'))
}

beforeEach(() => {
  vi.useFakeTimers()
  visibility = Object.assign(new EventTarget(), { hidden: false })
  motion = Object.assign(new EventTarget(), { matches: false })
  vi.stubGlobal('document', visibility)
  vi.stubGlobal('window', { matchMedia: () => motion })
})

afterEach(() => {
  unmount?.()
  unmount = undefined
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('highlight carousel playback', () => {
  it('advances at eight seconds and wraps from the third slide to the first', () => {
    const { current } = mount()
    vi.advanceTimersByTime(7999)
    expect(current.value).toBe(0)
    vi.advanceTimersByTime(1)
    expect(current.value).toBe(1)
    vi.advanceTimersByTime(8000)
    expect(current.value).toBe(2)
    vi.advanceTimersByTime(8000)
    expect(current.value).toBe(0)
  })

  it('wraps manual navigation and starts a full interval even when selecting the same slide', () => {
    const { current, showSlide } = mount()
    showSlide(-1)
    expect(current.value).toBe(2)
    showSlide(3)
    expect(current.value).toBe(0)
    vi.advanceTimersByTime(7000)
    showSlide(0)
    vi.advanceTimersByTime(7999)
    expect(current.value).toBe(0)
    vi.advanceTimersByTime(1)
    expect(current.value).toBe(1)
  })

  it('waits until hover, focus and hidden-page pauses all clear before restarting', () => {
    const { current, hovering, focusWithin } = mount()
    vi.advanceTimersByTime(7000)
    hovering.value = true
    focusWithin.value = true
    setHidden(true)
    vi.advanceTimersByTime(24000)
    expect(current.value).toBe(0)
    hovering.value = false
    focusWithin.value = false
    vi.advanceTimersByTime(8000)
    expect(current.value).toBe(0)
    setHidden(false)
    vi.advanceTimersByTime(7999)
    expect(current.value).toBe(0)
    vi.advanceTimersByTime(1)
    expect(current.value).toBe(1)
  })

  it('preserves an explicit pause through interactions and resumes only on play', () => {
    const { current, playing, hovering, focusWithin, togglePlayback } = mount()
    togglePlayback()
    expect(playing.value).toBe(false)
    hovering.value = true
    focusWithin.value = true
    setHidden(true)
    hovering.value = false
    focusWithin.value = false
    setHidden(false)
    vi.advanceTimersByTime(24000)
    expect(current.value).toBe(0)
    togglePlayback()
    vi.advanceTimersByTime(8000)
    expect(current.value).toBe(1)
  })

  it('starts paused for reduced motion, allows manual play and pauses when that preference changes', () => {
    motion.matches = true
    const { current, playing, showSlide, togglePlayback } = mount()
    expect(playing.value).toBe(false)
    vi.advanceTimersByTime(16000)
    expect(current.value).toBe(0)
    showSlide(1)
    expect(current.value).toBe(1)
    togglePlayback()
    vi.advanceTimersByTime(8000)
    expect(current.value).toBe(2)
    setMotion(false)
    setMotion(true)
    expect(playing.value).toBe(false)
    vi.advanceTimersByTime(16000)
    expect(current.value).toBe(2)
  })

  it('removes pending work and browser listeners on unmount', () => {
    const { current, playing, togglePlayback } = mount()
    unmount()
    unmount = undefined
    expect(vi.getTimerCount()).toBe(0)
    setMotion(true)
    expect(playing.value).toBe(true)
    setHidden(true)
    setHidden(false)
    togglePlayback()
    togglePlayback()
    vi.advanceTimersByTime(24000)
    expect(current.value).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })
})
