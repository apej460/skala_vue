<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { iconUrl, buildSparklinePoints } from '@/utils/weatherHelpers'

const props = defineProps({
  daily: { type: Array, default: () => [] },
})

const configStore = useConfigStore()

const CHART_W = 220
const CHART_SIDE_PAD = 14 // 양 끝 점의 라벨이 잘리지 않도록 하는 좌우 여백
const CHART_LINE_H = 26 // 선이 오르내리는 세로 폭
const CHART_TOP_PAD = 16 // 점 위 온도 라벨을 위한 여백
const CHART_BOTTOM_PAD = 16 // 점 아래 요일 라벨을 위한 여백
const CHART_H = CHART_TOP_PAD + CHART_LINE_H + CHART_BOTTOM_PAD

// 5일 최고기온 추세를 잇는 스파크라인 (참고: Weather.com 트렌드 그래프)
// -> 값만 있고 라벨이 없으면 무엇을 나타내는 선인지 알 수 없어서,
//    각 지점에 실제 최고기온 값과 요일을 함께 표시한다.
const sparkDots = computed(() => {
  const raw = buildSparklinePoints(
    props.daily.map((d) => d.high),
    CHART_W - CHART_SIDE_PAD * 2,
    CHART_LINE_H
  )
  return raw
    .split(' ')
    .filter(Boolean)
    .map((pair, i) => {
      const [x, y] = pair.split(',').map(Number)
      const d = props.daily[i]
      return {
        x: x + CHART_SIDE_PAD,
        y: y + CHART_TOP_PAD,
        temp: configStore.convertTemp(d.high),
        day: d.day,
      }
    })
})

const sparkPoints = computed(() => sparkDots.value.map((p) => `${p.x},${p.y}`).join(' '))
</script>

<template>
  <div class="daily">
    <p v-if="daily.length > 1" class="chart-caption">🌡️ 일자별 최고기온 추이 ({{ configStore.unitLabel }})</p>
    <div v-if="daily.length > 1" class="chart-wrap">
      <svg class="sparkline" :viewBox="`0 0 ${CHART_W} ${CHART_H}`">
        <polyline :points="sparkPoints" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" />
        <g v-for="p in sparkDots" :key="p.day">
          <circle :cx="p.x" :cy="p.y" r="3" fill="#fff" />
          <text :x="p.x" :y="p.y - 8" text-anchor="middle" class="spark-value">{{ p.temp }}°</text>
          <text :x="p.x" :y="CHART_TOP_PAD + CHART_LINE_H + 13" text-anchor="middle" class="spark-day">
            {{ p.day }}
          </text>
        </g>
      </svg>
    </div>

    <ul class="daily-list">
      <li v-for="d in daily" :key="d.date">
        <span class="day">{{ d.day }}요일</span>
        <img :src="iconUrl(d.icon)" :alt="d.main" class="icon" />
        <span class="range">
          {{ configStore.convertTemp(d.low) }}° ~ {{ configStore.convertTemp(d.high) }}°
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chart-caption {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--text-sub);
}

.chart-wrap {
  display: flex;
  justify-content: center; /* 부모 폭이 얼마든 svg를 항상 가운데 정렬 */
}

.sparkline {
  display: block;
  width: 100%;
  max-width: 420px; /* 화면이 넓어져도 이 이상 늘어나지 않게 고정 */
  height: auto;
  aspect-ratio: 220 / 58; /* viewBox 비율과 동일하게 유지해 찌그러지지 않게 함 */
  margin-bottom: 6px;
}

.spark-value {
  font-size: 9px;
  font-weight: 700;
  fill: #fff;
}

.spark-day {
  font-size: 8px;
  fill: var(--text-sub);
}

.daily-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.daily-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 14px;
}

.day {
  font-weight: 600;
  width: 70px;
}

.icon {
  width: 30px;
  height: 30px;
}

.range {
  color: var(--text-sub);
  width: 100px;
  text-align: right;
}
</style>
