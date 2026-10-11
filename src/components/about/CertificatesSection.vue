<template>
  <section
    class="ts-container editorial-section"
    aria-labelledby="about-certificates"
  >
    <h2 id="about-certificates" class="ts-header is-big is-heavy">
      {{ $t('about.certificates.header') }}
    </h2>
    <table class="ts-table has-top-spaced">
      <thead>
        <tr>
          <th>{{ $t('about.certificates.table.index') }}</th>
          <th>{{ $t('about.certificates.table.year') }}</th>
          <th>{{ $t('about.certificates.table.name') }}</th>
          <th>{{ $t('about.certificates.table.level') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cert, index) in certificates" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ cert.year }}</td>
          <td>{{ cert.name }}</td>
          <td>{{ cert.level || '' }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th :colspan="4">
            {{ $t('about.certificates.count', { count: certificates.length }) }}
          </th>
        </tr>
      </tfoot>
    </table>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// 證照數據
const certificates = ref([
  {
    year: '2017',
    name: 'TQC+ 基礎物件導向程式語言 Java6',
    level: '專業級'
  },
  {
    year: '2018',
    name: 'Certiport IC3 Living Online',
    level: ''
  },
  {
    year: '2018',
    name: 'Certiport IC3 Key Applications',
    level: ''
  },
  {
    year: '2018',
    name: 'Certiport IC3 Computing Fundamentals',
    level: ''
  },
  {
    year: '2018',
    name: 'Certiport IC3 GS5',
    level: ''
  },
  {
    year: '2019',
    name: 'TQC+ 基礎行動裝置應用程式設計 Android6',
    level: '專業級'
  },
  {
    year: '2019',
    name: '勞動部勞動力發展署技能檢定中心 電腦軟體應用',
    level: '丙級'
  },
  {
    year: '2019',
    name: '勞動部勞動力發展署技能檢定中心 電腦硬體裝修',
    level: '丙級'
  },
  {
    year: '2020',
    name: '勞動部勞動力發展署技能檢定中心 電腦硬體裝修',
    level: '乙級'
  },
  {
    year: '2021',
    name: 'Microsoft Certified Azure AI Fundamentals',
    level: ''
  }
])
</script>
