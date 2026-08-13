<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useCitiesStore } from '@/stores/citiesStore'
import { iconUrl, aqiInfo } from '@/utils/weatherHelpers'

const router = useRouter()
const configStore = useConfigStore()
const citiesStore = useCitiesStore()

// 기본으로 즐겨찾기 도시(최대 3개)를 선택 상태로 채워둠
const selectedIds = ref(
  citiesStore.cities
    .filter((c) => configStore.isFavorite(c.id))
    .slice(0, 3)
    .map((c) => c.id)
)

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((v) => v !== id)
  } else if (selectedIds.value.length < 4) {
    selectedIds.value = [...selectedIds.value, id]
  }
}

const selectedCities = computed(() =>
  citiesStore.cities
    .filter((c) => selectedIds.value.includes(c.id))
    .map((c) => ({ city: c, weather: citiesStore.weatherById[c.id] }))
    .filter((entry) => entry.weather)
)

const warmestId = computed(() => {
  if (selectedCities.value.length === 0) return null
  return selectedCities.value.reduce((a, b) => (a.weather.temp > b.weather.temp ? a : b)).city.id
})
const bestAirId = computed(() => {
  const withAqi = selectedCities.value.filter((e) => e.weather.aqi)
  if (withAqi.length === 0) return null
  return withAqi.reduce((a, b) => (a.weather.aqi < b.weather.aqi ? a : b)).city.id
})

const rows = [
  { key: 'temp', label: '현재 기온', unit: true },
  { key: 'feelsLike', label: '체감 온도', unit: true },
  { key: 'humidity', label: '습도', suffix: '%' },
  { key: 'windSpeed', label: '풍속', suffix: 'm/s' },
  { key: 'pressure', label: '기압', suffix: 'hPa' },
]
</script>

<template>
  <section class="glass-panel compare">
    <h1>🆚 도시 비교</h1>
    <p class="text-sub intro">
      최대 4개 도시를 선택해 기온·습도·바람·대기질을 한눈에 비교해보세요.
    </p>

    <div class="picker">
      <button
        v-for="c in citiesStore.cities"
        :key="c.id"
        class="pill-btn"
        :class="{ active: selectedIds.includes(c.id) }"
        @click="toggleSelect(c.id)"
      >
        {{ c.name }}
      </button>
    </div>

    <div v-if="selectedCities.length === 0" class="empty">
      비교할 도시를 선택해주세요. (날씨 데이터가 아직 없다면 홈에서 먼저 불러와주세요)
    </div>

    <div v-else class="compare-grid">
      <div v-for="entry in selectedCities" :key="entry.city.id" class="compare-card glass-card">
        <div class="badges">
          <span v-if="entry.city.id === warmestId" class="badge hot">🔥 가장 따뜻함</span>
          <span v-if="entry.city.id === bestAirId" class="badge air">🌿 대기질 최상</span>
        </div>

        <RouterLink :to="{ name: 'weather-detail', params: { cityId: entry.city.id } }" class="city-link">
          <img :src="iconUrl(entry.weather.icon)" :alt="entry.weather.main" class="icon" />
          <p class="name">{{ entry.city.name }}</p>
        </RouterLink>

        <p class="temp">{{ configStore.convertTemp(entry.weather.temp) }}{{ configStore.unitLabel }}</p>

        <ul class="stat-list">
          <li v-for="row in rows.slice(1)" :key="row.key">
            <span>{{ row.label }}</span>
            <span>
              {{ row.unit ? configStore.convertTemp(entry.weather[row.key]) + configStore.unitLabel : entry.weather[row.key] + (row.suffix || '') }}
            </span>
          </li>
          <li v-if="entry.weather.aqi">
            <span>대기질</span>
            <span :style="{ color: aqiInfo(entry.weather.aqi).color }">
              {{ aqiInfo(entry.weather.aqi).label }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <button class="pill-btn back" @click="router.push('/')">← 대시보드로</button>
  </section>
</template>

<style scoped>
.compare {
  padding: 30px;
}

.compare h1 {
  margin: 0 0 6px;
}

.intro {
  margin: 0 0 20px;
  font-size: 14px;
}

.picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.empty {
  padding: 30px 0;
  text-align: center;
  color: var(--text-sub);
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 26px;
}

.compare-card {
  padding: 18px;
  text-align: center;
  position: relative;
}

.badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  margin-bottom: 8px;
  min-height: 20px;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.city-link {
  display: block;
}

.icon {
  width: 48px;
  height: 48px;
}

.name {
  margin: 2px 0 0;
  font-weight: 700;
  font-size: 16px;
}

.temp {
  margin: 6px 0 14px;
  font-size: 30px;
  font-weight: 800;
}

.stat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.stat-list li {
  display: flex;
  justify-content: space-between;
  color: var(--text-sub);
}

.stat-list li span:last-child {
  color: var(--text-main);
  font-weight: 600;
}

.back {
  margin-top: 4px;
}
</style>