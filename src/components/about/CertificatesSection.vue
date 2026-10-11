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
        <tr v-for="(cert, index) in certificates" :key="cert.id">
          <td>{{ index + 1 }}</td>
          <td>{{ cert.year }}</td>
          <td>{{ $t(cert.nameKey) }}</td>
          <td>{{ cert.levelKey ? $t(cert.levelKey) : '' }}</td>
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
import { certificates } from '../../config/certificates'
</script>
