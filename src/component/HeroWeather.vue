<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { iconUrl, formatLocalTime, aqiInfo } from '@/utils/weatherHelpers'

const props = defineProps({
  city: { type: Object, default: null },
  weather: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const configStore = useConfigStore()

const badge = computed(() => (props.weather ? aqiInfo(props.weather.aqi) : null))
</script>

<template>
  <section class="hero glass-panel">
    <div v-if="!city" class="empty">
      <p>추적 중인 도시가 없습니다. 아래에서 도시를 추가해보세요.</p>
    </div>

    <template v-else>
      <div class="hero-top">
        <div>
          <p class="place">📍 {{ city.name }}<span v-if="city.country"> · {{ city.country }}</span></p>
          <p v-if="weather" class="desc">{{ weather.description }}</p>
          <p v-else-if="loading" class="desc">불러오는 중…</p>
        </div>
        <img v-if="weather" class="hero-icon" :src="iconUrl(weather.icon, '4x')" :alt="weather.main" />
      </div>

      <p v-if="weather" class="hero-temp">
        {{ configStore.convertTemp(weather.temp) }}<span class="unit">{{ configStore.unitLabel }}</span>
      </p>
      <p v-if="weather" class="hero-range">
        체감 {{ configStore.convertTemp(weather.feelsLike) }}° · 최고
        {{ configStore.convertTemp(weather.tempMax) }}° · 최저 {{ configStore.convertTemp(weather.tempMin) }}°
      </p>

      <div v-if="weather" class="stat-grid">
        <div class="stat-card">
          <p class="stat-label">💧 습도</p>
          <p class="stat-value">{{ weather.humidity }}%</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">🌬️ 풍속</p>
          <p class="stat-value">{{ weather.windSpeed }} m/s</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">🧭 기압</p>
          <p class="stat-value">{{ weather.pressure }} hPa</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">👁️ 가시거리</p>
          <p class="stat-value">{{ (weather.visibility / 1000).toFixed(1) }} km</p>
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
    </template>
  </section>
</template>

<style scoped>
.hero {
  padding: 30px;
  margin-bottom: 24px;
}

.empty {
  text-align: center;
  padding: 20px;
  color: var(--text-sub);
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.place {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-sub);
}

.desc {
  margin: 0;
  font-size: 18px;
  text-transform: capitalize;
}

.hero-icon {
  width: 84px;
  height: 84px;
  margin-top: -14px;
}

.hero-temp {
  margin: 4px 0 0;
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
}

.unit {
  font-size: 30px;
  font-weight: 500;
  opacity: 0.8;
}

.hero-range {
  margin: 8px 0 22px;
  color: var(--text-sub);
  font-size: 14px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
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

@media (max-width: 560px) {
  .hero-temp {
    font-size: 48px;
  }
}
</style>
