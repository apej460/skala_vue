<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { iconUrl, statusEmoji, aqiInfo } from '@/utils/weatherHelpers'

const props = defineProps({
  city: { type: Object, required: true }, // { id, name, country, lat, lon }
  weather: { type: Object, default: null }, // 정규화된 날씨 번들 (없으면 로딩/에러 상태)
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  removable: { type: Boolean, default: false },
})

// select-card: 카드를 누르면 상태바 갱신용으로 부모에게 전달
// click-detail: 상세보기 버튼 클릭 시 부모에게 전달 (버블링 없이)
const emit = defineEmits(['select-card', 'click-detail', 'remove-city'])

const configStore = useConfigStore()

const isWarm = computed(() => props.weather && props.weather.temp >= 25)
const displayTemp = computed(() => (props.weather ? configStore.convertTemp(props.weather.temp) : null))
const badge = computed(() => (props.weather ? aqiInfo(props.weather.aqi) : null))

function handleCardClick() {
  emit('select-card', props.city)
}
function handleDetailClick() {
  emit('click-detail', props.city)
}
function handleFavoriteClick() {
  configStore.toggleFavorite(props.city.id)
}
function handleRemoveClick() {
  emit('remove-city', props.city)
}
</script>

<template>
  <div class="weather-card glass-card" @click="handleCardClick">
    <div class="corner-actions">
      <button v-if="removable" class="icon-btn" title="삭제" @click.stop="handleRemoveClick">✕</button>
      <button class="icon-btn fav" @click.stop="handleFavoriteClick">
        {{ configStore.isFavorite(city.id) ? '★' : '☆' }}
      </button>
    </div>

    <div class="card-top">
      <img v-if="weather" class="icon" :src="iconUrl(weather.icon)" :alt="weather.main" />
      <span v-else class="icon emoji">{{ statusEmoji(weather?.main) }}</span>
      <div>
        <p class="city-name">{{ city.name }}</p>
        <p class="status">{{ loading ? '불러오는 중…' : weather?.description ?? (error ? '오류' : '-') }}</p>
      </div>
    </div>

    <template v-if="weather">
      <p class="temp">{{ displayTemp }}{{ configStore.unitLabel }}</p>

      <!-- 조건부 렌더링 (v-if / v-else) : 기온 기준 라벨 -->
      <p v-if="isWarm" class="pill warm">🔥 더움 (25도 이상)</p>
      <p v-else class="pill cool">💨 선선함 (25도 미만)</p>

      <div class="meta-row">
        <span>💧 {{ weather.humidity }}%</span>
        <span>🌬️ {{ weather.windSpeed }}m/s</span>
        <span v-if="badge" class="aqi-chip" :style="{ background: badge.color + '55' }">
          대기질 {{ badge.label }}
        </span>
      </div>
    </template>
    <p v-else-if="error" class="error-text">{{ error }}</p>
    <p v-else class="loading-text">날씨 정보를 불러오는 중…</p>

    <button class="detail-btn" @click.stop="handleDetailClick">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  padding: 18px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 190px;
}

.weather-card:hover {
  transform: translateY(-3px);
}

.corner-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
}

.icon-btn {
  background: rgba(0, 0, 0, 0.15);
  color: var(--text-main);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.fav {
  color: #ffd166;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  width: 44px;
  height: 44px;
}

.icon.emoji {
  font-size: 32px;
  width: auto;
  height: auto;
}

.city-name {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.status {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub);
}

.temp {
  margin: 2px 0 0;
  font-size: 32px;
  font-weight: 700;
}

.pill {
  align-self: flex-start;
  margin: 0;
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

.meta-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-sub);
  flex-wrap: wrap;
  align-items: center;
}

.aqi-chip {
  padding: 2px 8px;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
}

.error-text {
  font-size: 12px;
  color: #ffb4b4;
}

.loading-text {
  font-size: 12px;
  color: var(--text-sub);
}

.detail-btn {
  margin-top: auto;
  padding: 8px 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.25);
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>