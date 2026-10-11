<template>
  <section
    ref="container"
    class="highlights-carousel"
    :aria-label="$t('home.highlights.label')"
    :aria-roledescription="$t('home.highlights.carousel')"
  >
    <div class="highlight-stage" :aria-live="playing ? 'off' : 'polite'">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="highlight-slide"
        :class="{ 'is-active': index === current }"
        role="group"
        :aria-roledescription="$t('home.highlights.slide')"
        :aria-label="`${index + 1} / ${slides.length}`"
        :aria-hidden="index !== current"
        :inert="index !== current"
      >
        <div class="highlight-media ts-image is-rounded">
          <img
            :src="
              index === 0 || preloadReady || index === current
                ? slide.image
                : undefined
            "
            :alt="$t(slide.alt)"
            :width="slide.width"
            :height="slide.height"
            :style="{ objectPosition: slide.position }"
            :fetchpriority="index === 0 ? 'high' : 'low'"
            decoding="async"
            @load="onImageReady(index)"
            @error="onImageReady(index)"
          />
        </div>
        <div class="highlight-caption">
          <div class="ts-header">
            {{ slide.id === 'brand' ? 'KageRyo Developer' : $t(slide.header) }}
          </div>
          <p v-if="slide.description">{{ $t(slide.description) }}</p>
          <a
            v-if="slide.href"
            :href="slide.href"
            :aria-label="$t(slide.linkLabel)"
            target="_blank"
            rel="noopener noreferrer"
            class="ts-text is-external-link"
            >{{ $t(slide.linkText) }}</a
          >
        </div>
      </div>
    </div>
    <div class="highlight-controls">
      <button
        type="button"
        class="highlight-control"
        :aria-label="
          $t(playing ? 'home.highlights.pause' : 'home.highlights.play')
        "
        :title="$t(playing ? 'home.highlights.pause' : 'home.highlights.play')"
        @click="togglePlayback"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path v-if="playing" d="M6 4h4v16H6zM14 4h4v16h-4z" />
          <path v-else d="M7 3v18l14-9z" />
        </svg>
      </button>
      <div class="highlight-navigation">
        <button
          type="button"
          class="highlight-control"
          :aria-label="$t('home.highlights.previous')"
          @click="showSlide(current - 1)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m15 4-8 8 8 8 1.5-1.5L10 12l6.5-6.5z" />
          </svg>
        </button>
        <div class="highlight-dots">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            type="button"
            class="highlight-control highlight-dot"
            :aria-label="$t('home.highlights.showSlide', { number: index + 1 })"
            :aria-current="index === current ? 'true' : undefined"
            @click="showSlide(index)"
          >
            <span aria-hidden="true"></span>
          </button>
        </div>
        <button
          type="button"
          class="highlight-control"
          :aria-label="$t('home.highlights.next')"
          @click="showSlide(current + 1)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m9 4-1.5 1.5L14 12l-6.5 6.5L9 20l8-8z" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useHighlightCarousel } from '../../composables/useHighlightCarousel'
import brandImage from '../../../assets/img/card.webp'
import ministryImage from '../../../assets/img/ministry-of-education.webp'
import coscupImage from '../../../assets/img/coscup-lightingtalk.webp'

const slides = [
  {
    id: 'brand',
    image: brandImage,
    width: 1600,
    height: 900,
    position: 'center',
    alt: 'home.highlights.brandAlt'
  },
  {
    id: 'ministry',
    image: ministryImage,
    width: 1200,
    height: 800,
    position: '50% 40%',
    alt: 'home.highlights.ministryAlt',
    header: 'home.featuredPhotos.ministry.header',
    description: 'home.featuredPhotos.ministry.description',
    href: 'https://www.edu.tw/News_Content.aspx?n=9E7AC85F1954DDA8&s=BB1CB6531ABFD661',
    linkText: 'home.highlights.ministryLink',
    linkLabel: 'home.highlights.ministryLinkLabel'
  },
  {
    id: 'coscup',
    image: coscupImage,
    width: 1200,
    height: 800,
    position: '50% 70%',
    alt: 'home.highlights.coscupAlt',
    header: 'home.featuredPhotos.coscup.header',
    description: 'home.featuredPhotos.coscup.description',
    href: 'https://coscup.org/2023/zh-TW/',
    linkText: 'home.highlights.coscupLink',
    linkLabel: 'home.highlights.coscupLinkLabel'
  }
]
const { current, playing, hovering, focusWithin, showSlide, togglePlayback } =
  useHighlightCarousel(slides.length)
const preloadReady = ref(false)
const container = ref(null)
const onImageReady = index => {
  if (index === 0) preloadReady.value = true
}
useEventListener(container, 'mouseenter', () => {
  hovering.value = true
})
useEventListener(container, 'mouseleave', () => {
  hovering.value = false
})
useEventListener(container, 'focusin', () => {
  focusWithin.value = true
})
useEventListener(container, 'focusout', event => {
  focusWithin.value = event.currentTarget.contains(event.relatedTarget)
})
</script>

<style scoped>
.highlights-carousel {
  min-width: 0;
}

/* All captions size the same grid cell, so changing slides never moves the page. */
.highlight-stage {
  display: grid;
}

.highlight-slide {
  grid-area: 1 / 1;
  min-width: 0;
  visibility: hidden;
  pointer-events: none;
}

.highlight-slide.is-active {
  visibility: visible;
  pointer-events: auto;
}

.highlight-media {
  display: block;
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #121212;
  opacity: 0;
  transition: opacity 180ms ease;
}

.highlight-slide.is-active .highlight-media {
  opacity: 1;
}

.highlight-media img[width] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.highlight-caption {
  padding-top: 0.75rem;
  overflow-wrap: anywhere;
}

.highlight-caption p {
  margin: 0.25rem 0 0.5rem;
}

.highlight-controls,
.highlight-navigation,
.highlight-dots {
  display: flex;
  align-items: center;
}

.highlight-controls {
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.highlight-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--ts-gray-800);
  cursor: pointer;
}

.highlight-control:hover {
  background: var(--ts-gray-200);
}

.highlight-control:focus-visible {
  outline: 2px solid var(--kageryo-accent);
  outline-offset: 2px;
}

.highlight-control svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.highlight-dot span {
  width: 9px;
  height: 9px;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.highlight-dot[aria-current='true'] span {
  background: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .highlight-media {
    transition: none;
  }
}
</style>
