<template>
  <div class="ts-content is-tertiary is-vertically-padded">
    <div class="ts-container">
      <h1 class="ts-header is-huge is-heavy">Chien-Hsun Chang</h1>
      <div class="ts-text is-secondary">{{ headline }}</div>

      <div class="hero-layout has-top-spaced">
        <div class="hero-intro ts-box">
          <div class="ts-content is-secondary hero-intro-content">
            <!-- 個人簡述 -->
            <div>
              <h2 class="ts-header is-big is-heavy">Hello👏</h2>
              <h2 class="ts-header is-big is-heavy">I'm Chien-Hsun Chang</h2>
              <div class="ts-text is-description has-bottom-spaced-small">
                A Student && Developer from Taiwan.
                <span class="ts-flag is-taiwan-flag"></span>
              </div>

              <!-- 個人資料 -->
              <h2 class="ts-header is-big is-heavy">張健勳</h2>
              <div class="ts-text is-description has-bottom-spaced-small">
                來自臺灣的學生開發者
              </div>
            </div>

            <div>
              <!-- 介紹文字 -->
              <span class="ts-text">
                {{ $t('home.hero.introduction') }}
              </span>

              <!-- 學業與求職狀態 -->
              <div class="ts-text is-description has-top-spaced-small">
                <span class="ts-icon is-graduation-cap-icon"></span>
                {{ $t('home.hero.academic') }}
              </div>
              <div class="ts-text is-description">
                <span class="ts-icon is-briefcase-icon"></span>
                {{ $t('home.hero.availability') }}
              </div>

              <!-- 作品集與履歷：作品集是首頁唯一的主要按鈕 -->
              <div class="ts-grid is-compact mobile:is-stacked has-top-spaced">
                <div class="column is-fluid">
                  <router-link
                    to="/projects"
                    class="ts-button is-fluid is-start-icon"
                  >
                    <span class="ts-icon is-folder-open-icon"></span>
                    {{ $t('home.hero.viewProjects') }}
                  </router-link>
                </div>
                <div class="column is-fluid">
                  <a
                    :href="resumePdfUrl"
                    class="ts-button is-fluid is-outlined is-start-icon"
                    download
                  >
                    <span class="ts-icon is-download-icon"></span>
                    {{ $t('home.hero.downloadResume') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <HighlightsCarousel />

          <!-- 社群連結與電子信箱 -->
          <div class="hero-contact">
            <div class="ts-wrap">
              <a
                href="https://coderyo.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord (opens in a new tab)"
                class="ts-icon is-secondary is-discord-icon is-circular is-large"
              ></a>
              <a
                href="https://github.com/KageRyo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub (opens in a new tab)"
                class="ts-icon is-secondary is-github-icon is-circular is-large"
              ></a>
              <a
                href="https://www.linkedin.com/in/kageryo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                class="ts-icon is-secondary is-linkedin-icon is-circular is-large"
              ></a>
            </div>
            <a href="mailto:kageryo@coderyo.com" class="no-underline"
              >📬kageryo@coderyo.com</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HighlightsCarousel from './HighlightsCarousel.vue'
import { headline } from '../../config/site'
import { resumePdfUrl } from '../../config/resume'
</script>

<style scoped>
.hero-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-areas: 'intro' 'visual';
}

.hero-intro {
  grid-area: intro;
}

.hero-visual {
  grid-area: visual;
  min-width: 0;
}

.hero-contact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-top: 0.75rem;
}

/* 平板與小筆電：介紹在前，問候與內文左右分欄 */
@media (min-width: 768px) and (max-width: 1199.98px) {
  .hero-intro-content {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: 0 2rem;
  }
}

/* 寬螢幕：輪播在左、介紹在右，輪播與聯絡方式垂直置中 */
@media (min-width: 1200px) {
  .hero-layout {
    grid-template-columns: minmax(0, 11fr) minmax(0, 5fr);
    grid-template-areas: 'visual intro';
    gap: 2rem;
  }

  .hero-visual {
    align-self: center;
  }
}
</style>
