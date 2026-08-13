<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <button
      class="unit-btn"
      :class="{ active: configStore.unit === 'C' }"
      @click="configStore.unit !== 'C' && configStore.toggleUnit()"
    >
      °C
    </button>
    <button
      class="unit-btn"
      :class="{ active: configStore.unit === 'F' }"
      @click="configStore.unit !== 'F' && configStore.toggleUnit()"
    >
      °F
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid var(--glass-border);
}

.unit-btn {
  padding: 6px 12px;
  border-radius: 999px;
  background: transparent;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
  opacity: 0.7;
}

.unit-btn.active {
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
}
</style>
