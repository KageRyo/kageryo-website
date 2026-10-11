<template>
  <div class="ts-box has-top-spaced-small">
    <table class="ts-table">
      <thead>
        <tr>
          <th>{{ $t('projects.github.table.index') }}</th>
          <th>{{ $t('projects.github.table.name') }}</th>
          <th>{{ $t('projects.github.table.url') }}</th>
          <th class="mobile:has-hidden">
            {{ $t('projects.github.table.desc') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(repository, index) in repositories" :key="repository.id">
          <td>{{ index + 1 }}</td>
          <td>
            <a
              :href="repository.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ts-text is-link"
            >
              {{ repository.name }}
            </a>
          </td>
          <td>
            <a
              :href="repository.htmlUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ts-text is-link is-small"
            >
              {{ repository.htmlUrl }}
            </a>
          </td>
          <td class="mobile:has-hidden">
            {{ repository.description || $t('projects.github.table.noDesc') }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="4">
            {{
              $t('projects.github.table.count', { count: repositories.length })
            }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
defineProps({
  repositories: { type: Array, required: true }
})
</script>
