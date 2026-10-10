<template>
  <div class="ts-container has-top-spaced-large">
    <div class="has-full-size">
      <iframe 
        class="map-container" 
        frameborder="0" 
        scrolling="no" 
        marginheight="0" 
        marginwidth="0"
        title="Map of the National Chung Cheng University area"
        loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=120.47565042972566%2C23.561024541296668%2C120.48010826110841%2C23.563161052774895&amp;layer=mapnik"
        style="width: 100%; height: 400px; border-radius: 8px;"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
// 地圖模組
</script>

<style scoped>
.map-container {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
