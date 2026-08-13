<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useCitiesStore } from '@/stores/citiesStore'
import { iconUrl, formatLocalTime, aqiInfo } from '@/utils/weatherHelpers'
import HourlyForecast from '@/component/HourlyForecast.vue'
import DailyForecast from '@/component/DailyForecast.vue'

const props = defineProps({
  cityId: { type: String, required: true },
})

const router = useRouter()
const configStore = useConfigStore()
const citiesStore = useCitiesStore()

const city = computed(() => citiesStore.cities.find((c) => c.id === props.cityId) ?? null)
const weather = computed(() => citiesStore.weatherById[props.cityId] ?? null)
const isLoading = computed(() => Boolean(citiesStore.loadingIds[props.cityId]))
const badge = computed(() => (weather.value ? aqiInfo(weather.value.aqi) : null))

// Mount 시점에 해당 도시의 날씨 데이터가 없으면 조회
onMounted(() => {
  if (city.value && !weather.value) {
    citiesStore.fetchWeatherFor(city.value)
  }
})
</script>

<template>
  <section v-if="city" class="detail glass-panel">
    <button class="pill-btn back-btn" @click="router.push('/')">← 대시보드로</button>

    <div v-if="isLoading && !weather" class="loading">날씨 정보를 불러오는 중…</div>

    <template v-else-if="weather">
      <header class="detail-header">
        <img class="icon" :src="iconUrl(weather.icon, '4x')" :alt="weather.main" />
        <div>
          <h1>{{ city.name }}</h1>
          <p class="text-sub">
            {{ weather.description }} · 습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }}m/s
          </p>
        </div>
        <div class="temp-block">
          <p class="temp">{{ configStore.convertTemp(weather.temp) }}{{ configStore.unitLabel }}</p>
          <p v-if="weather.temp >= 25" class="pill warm">🔥 더움</p>
          <p v-else class="pill cool">❄️ 선선함</p>
        </div>
      </header>

      <div class="action-line">
        <button
          class="pill-btn"
          :class="{ active: configStore.isFavorite(city.id) }"
          @click="configStore.toggleFavorite(city.id)"
        >
          {{ configStore.isFavorite(city.id) ? '★ 즐겨찾기 됨' : '☆ 즐겨찾기 추가' }}
        </button>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <p class="stat-label">🌡️ 체감</p>
          <p class="stat-value">{{ configStore.convertTemp(weather.feelsLike) }}°</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">🧭 기압</p>
          <p class="stat-value">{{ weather.pressure }} hPa</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">🌅 일출</p>
          <p class="stat-value">{{ formatLocalTime(weather.sunrise, weather.timezone) }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">🌇 일몰</p>
          <p class="stat-value">{{ formatLocalTime(weather.sunset, weather.timezone) }}</p>
        </div>
        <div v-if="badge" class="stat-card aqi" :style="{ '--aqi-color': badge.color }">
          <p class="stat-label">🌫️ 대기질</p>
          <p class="stat-value">{{ badge.label }}</p>
        </div>
      </div>

      <div class="section">
        <p class="section-title">⏱️ 시간별 예보</p>
        <HourlyForecast :hourly="weather.hourly" />
      </div>

      <div class="section">
        <p class="section-title">📅 5일 예보</p>
        <DailyForecast :daily="weather.daily" />
      </div>
    </template>

    <p v-else class="loading">날씨 정보를 불러오지 못했습니다.</p>
  </section>

  <section v-else class="glass-panel not-found">
    <p>해당 도시 정보를 찾을 수 없습니다. (cityId: {{ cityId }})</p>
    <button class="pill-btn" @click="router.push('/')">대시보드로 돌아가기</button>
  </section>
</template>

<style scoped>
.detail {
  padding: 28px;
}

.back-btn {
  margin-bottom: 18px;
}

.loading {
  padding: 40px 0;
  text-align: center;
  color: var(--text-sub);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.icon {
  width: 76px;
  height: 76px;
}

.detail-header h1 {
  margin: 0 0 4px;
}

.temp-block {
  margin-left: auto;
  text-align: right;
}

.temp {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
}

.pill {
  display: inline-block;
  margin-top: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.pill.warm {
  background: rgba(255, 138, 76, 0.35);
}

.pill.cool {
  background: rgba(125, 211, 252, 0.35);
}

.action-line {
  margin-bottom: 22px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
}

.stat-card.aqi {
  border: 1px solid var(--aqi-color);
}

.stat-label {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--text-sub);
}

.stat-value {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.section {
  margin-bottom: 24px;
}

.not-found {
  padding: 40px;
  text-align: center;
}
</style>