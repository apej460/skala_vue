<script setup>
import { Location } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  statusText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="base-dashboard glass-panel">
    <header class="dashboard-header">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="statusText" class="status-bar">
        <el-icon><Location /></el-icon> {{ statusText }}
      </p>
    </header>

    <!-- 검색 UI가 주입되는 slot -->
    <div class="search-slot">
      <slot name="search" />
    </div>

    <!-- 날씨 리스트 등 기본 컨텐츠가 주입되는 slot -->
    <div class="content-slot">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.base-dashboard {
  padding: 26px;
  margin-bottom: 24px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 20px;
}

.status-bar {
  margin: 0;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.search-slot {
  margin-bottom: 20px;
}
</style>
