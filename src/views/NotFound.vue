<template>
  <section class="ts-content is-tertiary is-vertically-padded">
    <div class="ts-container is-center-aligned">
      <h1 class="ts-header is-huge is-heavy">404</h1>
      <p class="ts-text is-secondary has-top-spaced">
        {{ $t('notFound.message') }}
      </p>
      <router-link to="/" class="ts-button has-top-spaced-large">
        {{ $t('notFound.backHome') }}
      </router-link>
    </div>
  </section>
</template>
