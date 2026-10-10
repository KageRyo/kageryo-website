<template>
  <!-- 學歷：只有兩筆，桌機並排、手機堆疊，不加框；校徽放在校名左側 -->
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-education"
  >
    <h2 id="about-education" class="ts-header is-big is-heavy">
      {{ $t('about.resume.education.header') }}
    </h2>
    <ul class="education-list">
      <li v-for="item in education" :key="item.id" class="education-entry">
        <!-- 校名就在旁邊，校徽不用再唸一次 -->
        <img
          :src="item.logo.src"
          :width="item.logo.width"
          :height="item.logo.height"
          alt=""
          loading="lazy"
          decoding="async"
          class="school-logo"
        />
        <div>
          <div class="ts-text is-description entry-period">
            {{ $t(`about.resume.education.items.${item.id}.period`) }}
          </div>
          <h3 class="ts-header is-heavy">
            {{ $t(`about.resume.education.items.${item.id}.school`) }}
          </h3>
          <div class="ts-text is-secondary">
            {{ $t(`about.resume.education.items.${item.id}.degree`) }}
          </div>
        </div>
      </li>
    </ul>
  </section>

  <!-- 工作經歷：全寬列表；桌機分成時間、職稱與單位、工作重點三欄 -->
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-experience"
  >
    <h2 id="about-experience" class="ts-header is-big is-heavy">
      {{ $t('about.resume.experience.header') }}
    </h2>
    <ol class="experience-list">
      <li v-for="item in experience" :key="item.id" class="experience-entry">
        <div class="ts-text is-description entry-period">
          {{ $t(`about.resume.experience.items.${item.id}.period`) }}
        </div>
        <div>
          <h3 class="ts-header is-heavy">
            {{ $t(`about.resume.experience.items.${item.id}.role`) }}
          </h3>
          <div class="ts-text is-secondary">
            {{ $t(`about.resume.experience.items.${item.id}.organization`) }}
          </div>
          <div
            v-if="$te(`about.resume.experience.items.${item.id}.corp`)"
            class="ts-text is-description"
          >
            {{ $t(`about.resume.experience.items.${item.id}.corp`) }}
          </div>
          <ul class="entry-links">
            <li v-for="link in item.links" :key="link.url">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ts-text is-external-link"
                >{{ $t(link.labelKey) }}</a
              >
            </li>
          </ul>
        </div>
        <div class="entry-detail">
          <p class="entry-summary">
            {{ $t(`about.resume.experience.items.${item.id}.summary`) }}
          </p>
          <ul class="highlights">
            <li
              v-for="(line, index) in lines(item.id, 'highlights')"
              :key="index"
            >
              {{ line }}
            </li>
          </ul>
          <div class="ts-wrap is-compact entry-tools">
            <span
              v-for="tool in lines(item.id, 'tools')"
              :key="tool"
              class="ts-chip is-small"
              >{{ tool }}</span
            >
          </div>
        </div>
      </li>
    </ol>
  </section>

  <!-- 技能：About 頁唯一的色塊，方便快速掃描 -->
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-skills"
  >
    <h2 id="about-skills" class="ts-header is-big is-heavy">
      {{ $t('about.resume.skills.header') }}
    </h2>
    <div class="ts-content is-tertiary is-rounded skills-panel">
      <div v-for="group in skillGroups" :key="group.id" class="skill-group">
        <div class="ts-text is-bold">
          {{ $t(`about.resume.skills.groups.${group.id}`) }}
        </div>
        <div>
          <p class="skill-description">
            {{ $t(`about.resume.skills.descriptions.${group.id}`) }}
          </p>
          <div class="ts-wrap is-compact">
            <span
              v-for="skill in group.items"
              :key="skill"
              class="ts-chip is-small"
              >{{ skill }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { education, experience, skillGroups } from '../../config/resume'

const { tm, rt } = useI18n({ useScope: 'global' })

// 經歷重點與使用技術為字串陣列，需逐行轉譯
const lines = (id, field) =>
  tm(`about.resume.experience.items.${id}.${field}`).map(line => rt(line))
</script>

<style scoped>
.education-list,
.experience-list {
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.education-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 3rem;
}

.experience-entry {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr) minmax(0, 1.8fr);
  gap: 0.25rem 2rem;
  padding: 1.5rem 0;
}

.experience-entry:first-child {
  padding-top: 0;
}

.experience-entry:last-child {
  padding-bottom: 0;
}

.experience-entry + .experience-entry {
  border-top: 1px solid var(--ts-gray-200);
}

.entry-period {
  font-variant-numeric: tabular-nums;
}

.education-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 兩個校徽寬高比不同，放進同樣大小的方框，校名才會對齊 */
.school-logo {
  flex: none;
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
}

.education-entry h3 {
  margin: 0.25rem 0 0;
}

.experience-entry h3 {
  margin: 0;
}

.entry-links {
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
}

.entry-summary {
  margin: 0 0 0.5rem;
}

.highlights {
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.entry-tools {
  margin-top: 0.75rem;
}

.skill-description {
  margin: 0 0 0.5rem;
}

.highlights li + li {
  margin-top: 0.25rem;
}

.skills-panel {
  margin-top: 1.5rem;
  padding: 1.5rem;
}

.skill-group {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 0.5rem 1rem;
  align-items: start;
}

.skill-group + .skill-group {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ts-gray-300);
}

/* 平板：工作重點移到職稱下方 */
@media (max-width: 1023.98px) {
  .experience-entry {
    grid-template-columns: 9rem minmax(0, 1fr);
  }

  .entry-detail {
    grid-column: 2;
    margin-top: 0.5rem;
  }
}

@media (max-width: 767.98px) {
  .education-list,
  .experience-entry,
  .skill-group {
    grid-template-columns: minmax(0, 1fr);
  }

  .entry-detail {
    grid-column: auto;
  }

  .skills-panel {
    padding: 1rem;
  }
}
</style>
