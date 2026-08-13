<script setup>
import { useConfigStore } from '@/stores/configStore'
import { Sunny, Moon } from '@element-plus/icons-vue'

const configStore = useConfigStore()
</script>

<template>
  <button class="pill-btn dark-toggle" @click="configStore.toggleDarkMode()">
    <el-icon><component :is="configStore.darkMode ? Sunny : Moon" /></el-icon>
    {{ configStore.darkMode ? '라이트' : '다크' }}
  </button>
</template>

<style scoped>
.dark-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  min-width: 88px;
  justify-content: center;
}
</style>
