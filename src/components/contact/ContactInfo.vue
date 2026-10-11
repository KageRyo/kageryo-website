<template>
  <div class="tablet+:column tablet+:is-8-wide">
    <h2 class="ts-header is-big is-heavy">{{ $t('contact.info.header') }}</h2>

    <a
      href="https://coderyo.com/discord"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <div class="ts-iconset has-top-spaced-small">
        <span class="ts-icon is-discord-icon"></span>
        <div class="content">
          <div class="title">{{ $t('contact.info.discord') }}</div>
          <div class="text">KageRyo</div>
        </div>
      </div>
    </a>

    <a
      href="https://github.com/KageRyo/"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <div class="ts-iconset has-top-spaced">
        <span class="ts-icon is-github-icon"></span>
        <div class="content">
          <div class="title">{{ $t('contact.info.github') }}</div>
          <div class="text">KageRyo</div>
        </div>
      </div>
    </a>

    <a
      href="https://www.linkedin.com/in/kageryo/"
      target="_blank"
      rel="noopener noreferrer"
      class="no-underline"
    >
      <div class="ts-iconset has-top-spaced">
        <span class="ts-icon is-linkedin-icon"></span>
        <div class="content">
          <div class="title">{{ $t('contact.info.linkedin') }}</div>
          <div class="text">Chien-Hsun Chang 張健勳</div>
        </div>
      </div>
    </a>

    <a href="mailto:kageryo@coderyo.com" class="no-underline">
      <div class="ts-iconset has-top-spaced">
        <span class="ts-icon is-envelope-icon"></span>
        <div class="content">
          <div class="title">{{ $t('contact.info.email') }}</div>
          <div class="text">kageryo@coderyo.com</div>
        </div>
      </div>
    </a>
  </div>
</template>
