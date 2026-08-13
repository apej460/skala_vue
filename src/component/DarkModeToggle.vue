<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button class="pill-btn dark-toggle" @click="configStore.toggleDarkMode()">
    {{ configStore.darkMode ? '☀️ 라이트' : '🌙 다크' }}
  </button>
</template>

<style scoped>
.dark-toggle {
  font-size: 13px;
  min-width: 88px;
  text-align: center;
}
</style>
