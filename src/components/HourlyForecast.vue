<script setup>
import { useConfigStore } from '@/stores/configStore'
import { iconUrl } from '@/utils/weatherHelpers'

defineProps({
  hourly: { type: Array, default: () => [] },
})

const configStore = useConfigStore()
</script>

<template>
  <div class="hourly-row">
    <div v-for="slot in hourly" :key="slot.dt" class="hourly-chip">
      <p class="time">{{ slot.label }}</p>
      <img :src="iconUrl(slot.icon)" :alt="slot.main" class="icon" />
      <p class="temp">{{ configStore.convertTemp(slot.temp) }}°</p>
    </div>
  </div>
</template>

<style scoped>
.hourly-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.hourly-chip {
  min-width: 74px;
  text-align: center;
  padding: 14px 8px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.16);
  flex-shrink: 0;
}

.time {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub);
}

.icon {
  width: 36px;
  height: 36px;
  margin: 2px auto;
}

.temp {
  margin: 0;
  font-weight: 700;
  font-size: 15px;
}
</style>
