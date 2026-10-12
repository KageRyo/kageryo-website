<template>
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-introduction"
  >
    <div class="profile-layout">
      <!-- 個人照片 -->
      <div class="profile-photo">
        <div class="ts-image is-rounded">
          <img
            src="/assets/img/chienhsun.webp"
            alt="Chien-Hsun Chang 個人照片"
            width="900"
            height="900"
            decoding="async"
          />
        </div>
      </div>

      <!-- 個人資訊：直接排在照片旁，不另外加框 -->
      <div class="profile-content">
        <h2 id="about-introduction" class="ts-header is-big is-heavy">
          Chien-Hsun Chang 張健勳
        </h2>
        <div class="ts-text is-description">
          A Student && Developer from Taiwan.
          <span class="ts-flag is-taiwan-flag"></span>
        </div>
        <div class="ts-text is-description">來自臺灣的學生開發者</div>

        <div class="ts-iconset has-top-spaced has-bottom-spaced">
          <span
            class="ts-icon is-graduation-cap-icon"
            aria-hidden="true"
          ></span>
          <div class="content">
            <div class="title">{{ $t('about.personal.basic.education') }}</div>
            <div class="text">{{ $t('about.personal.currentEducation') }}</div>
          </div>
        </div>

        <p class="profile-lede">{{ $t('about.personal.introduction') }}</p>
        <p class="profile-motto">{{ $t('about.personal.basic.motto') }}</p>

        <!-- 公開版履歷與 GitHub -->
        <div class="ts-wrap has-top-spaced">
          <a
            :href="resumePdfUrl"
            class="ts-button is-start-icon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="ts-icon is-file-pdf-icon"></span>
            {{ $t('about.personal.resumeView') }}
          </a>
          <a
            href="https://github.com/KageRyo"
            target="_blank"
            rel="noopener noreferrer"
            class="ts-button is-outlined is-start-icon"
          >
            <span class="ts-icon is-github-icon"></span>
            GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-biography"
  >
    <div class="biography-layout">
      <h2 id="about-biography" class="ts-header is-big is-heavy">
        {{ $t('about.personal.biographyTitle') }}
      </h2>
      <div class="biography-body">
        <p v-for="(paragraph, index) in summary" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { resumePdfUrl } from '../../config/resume'

const { tm, rt } = useI18n({ useScope: 'global' })

// 自我介紹沿用 CV 的自傳，分成多段
const summary = computed(() =>
  tm('about.personal.summary').map(paragraph => rt(paragraph))
)
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}
.profile-photo {
  min-width: 0;
}
.profile-content {
  min-width: 0;
}
.profile-lede {
  max-width: 36em;
  font-size: 1.125rem;
  line-height: 1.8;
  margin: 1.5rem 0 1rem;
}
.biography-body {
  min-width: 0;
  margin-top: 1.5rem;
}
.biography-body p {
  line-height: 1.85;
  margin: 0 0 1.5rem;
}
.profile-motto {
  color: var(--ts-gray-600);
  line-height: 1.8;
  max-width: 36em;
  margin: 0 0 1.5rem;
}
@media (max-width: 767px) {
  .profile-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
  .profile-photo {
    max-width: 20rem;
    width: 100%;
  }
  .profile-content {
    display: contents;
  }
  #about-introduction {
    grid-row: 1;
  }
  .profile-photo {
    grid-row: 4;
  }
  .profile-lede {
    margin: 0;
    font-size: 1rem;
  }
}
</style>
