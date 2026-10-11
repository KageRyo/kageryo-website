<template>
  <div>
    <!-- 穹頂 -->
    <div class="ts-content is-tertiary is-vertically-padded">
      <div class="ts-container">
        <h1 class="ts-header is-huge is-heavy">Chien-Hsun Chang</h1>
        <div class="ts-text is-secondary">{{ headline }}</div>
      </div>
    </div>

    <!-- 個人資訊 -->
    <PersonalInfo />

    <!-- 履歷資訊 -->
    <ResumeSection />

    <!-- 證照 -->
    <CertificatesSection />
  </div>
</template>

<script setup>
import { headline } from '../config/site'
import PersonalInfo from '../components/about/PersonalInfo.vue'
import ResumeSection from '../components/about/ResumeSection.vue'
import CertificatesSection from '../components/about/CertificatesSection.vue'
</script>
