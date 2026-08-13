<script setup>
import { ref, watch } from 'vue'
import { geocodeSearch } from '@/services/weatherService'
import { useCitiesStore } from '@/stores/citiesStore'
import { Location } from '@element-plus/icons-vue'

const citiesStore = useCitiesStore()

const query = ref('')
const results = ref([])
const isSearching = ref(false)
const isOpen = ref(false)
const locationError = ref('')
let debounceTimer = null

watch(query, (value) => {
  clearTimeout(debounceTimer)
  if (!value.trim()) {
    results.value = []
    isOpen.value = false
    return
  }
  debounceTimer = setTimeout(async () => {
    isSearching.value = true
    try {
      results.value = await geocodeSearch(value, 5)
      isOpen.value = true
    } catch (err) {
      results.value = []
      console.error('오류 발생:', err)
    } finally {
      isSearching.value = false
    }
  }, 350)
})

async function pickResult(result) {
  await citiesStore.addCity(result)
  query.value = ''
  results.value = []
  isOpen.value = false
}

async function useMyLocation() {
  locationError.value = ''
  try {
    await citiesStore.useMyLocation()
  } catch (err) {
    locationError.value = err.message
  }
}
</script>

<template>
  <div class="add-city">
    <div class="row">
      <div class="input-wrap">
        <el-input
          v-model="query"
          type="text"
          placeholder="+ 도시 추가 (예: 도쿄, 뉴욕, 파리)"
          @focus="isOpen = results.length > 0"
        />
        <ul v-if="isOpen && results.length > 0" class="suggestions glass-card">
          <li v-for="r in results" :key="`${r.lat}-${r.lon}`" @click="pickResult(r)">
            <span>{{ r.name }}</span>
            <span class="sub">{{ [r.state, r.country].filter(Boolean).join(', ') }}</span>
          </li>
        </ul>
      </div>
      <button class="pill-btn" @click="useMyLocation">
        <el-icon><Location /></el-icon> 내 위치 사용
      </button>
    </div>
    <p class="status-line" :class="{ visible: isSearching || locationError, error: locationError }">
      {{ locationError || (isSearching ? '검색 중…' : '') }}
    </p>
  </div>
</template>

<style scoped>
.add-city {
  margin-bottom: 20px;
}

.row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.input-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.input-wrap :deep(.el-input__wrapper) {
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6) inset;
}

.input-wrap :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

.input-wrap :deep(.el-input__inner) {
  color: #1e2a3a;
  font-size: 14px;
}

.input-wrap :deep(.el-input__inner::placeholder) {
  color: #5b6b7d;
}

.suggestions {
  color: #1e2a3a;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  list-style: none;
  margin: 0;
  padding: 6px;
  z-index: 20;
  max-height: 220px;
  overflow-y: auto;
}

.suggestions li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}
li {
  border-bottom: 1px solid #334155;
  padding: 12px 0;
}

li:last-child {
  border-bottom: none;
}

.suggestions li:hover {
  background: rgba(255, 255, 255, 0.2);
}

.suggestions .sub {
  font-size: 12px;
  color: var(--text-sub);
}

.status-line {
  margin: 6px 0 0 16px;
  min-height: 16px;
  font-size: 12px;
  color: var(--text-sub);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.status-line.visible {
  opacity: 1;
}

.status-line.error {
  color: #ffb4b4;
}
</style>
