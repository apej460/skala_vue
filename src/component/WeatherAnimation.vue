<script setup>
import { computed } from 'vue'

const props = defineProps({
  main: { type: String, default: '' }, // OpenWeatherMap main 코드: Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow, Mist/Fog/Haze
  isNight: { type: Boolean, default: false },
})

// main + 주야 여부 → 애니메이션 종류
const kind = computed(() => {
  const m = props.main
  if (m === 'Thunderstorm') return 'thunder'
  if (m === 'Rain' || m === 'Drizzle') return 'rain'
  if (m === 'Snow') return 'snow'
  if (m === 'Mist' || m === 'Fog' || m === 'Haze') return 'mist'
  if (m === 'Clouds') return 'clouds'
  return 'clear'
})

function rand(min, max) {
  return Math.random() * (max - min) + min
}

// count개의 랜덤 위치/타이밍 아이템 생성 (kind가 바뀔 때만 재계산)
function genItems(count, build) {
  return Array.from({ length: count }, (_, i) => ({ id: i, style: build(i) }))
}

// 비/뇌우: 낙하하는 빗줄기
const rainDrops = computed(() => {
  if (kind.value !== 'rain' && kind.value !== 'thunder') return []
  return genItems(90, () => ({
    left: rand(0, 100) + '%',
    animationDelay: rand(0, 1.4) + 's',
    animationDuration: rand(0.45, 0.9) + 's',
    opacity: rand(0.3, 0.7),
  }))
})

// 눈: 낙하하며 좌우로 흔들리는 눈송이
const snowFlakes = computed(() => {
  if (kind.value !== 'snow') return []
  return genItems(55, () => ({
    left: rand(0, 100) + '%',
    animationDelay: rand(0, 8) + 's',
    animationDuration: rand(7, 13) + 's',
    fontSize: rand(8, 18) + 'px',
    opacity: rand(0.5, 0.95),
    '--drift': rand(-60, 60) + 'px',
  }))
})

// 구름: 서로 다른 속도/깊이로 흘러가는 구름 (비/뇌우/안개일 때도 하늘에 깔림)
const clouds = computed(() => {
  if (!['clouds', 'rain', 'thunder', 'mist'].includes(kind.value)) return []
  const count = kind.value === 'clouds' ? 6 : 4
  return genItems(count, () => ({
    top: rand(4, 34) + '%',
    animationDelay: -rand(0, 40) + 's',
    animationDuration: rand(38, 70) + 's',
    '--s': rand(0.7, 1.5).toFixed(2),
    opacity: rand(0.35, 0.75),
  }))
})

// 안개: 좌우로 흐르는 반투명 띠
const mistBands = computed(() => {
  if (kind.value !== 'mist') return []
  return genItems(5, (i) => ({
    top: 14 + i * 16 + '%',
    animationDelay: -rand(0, 20) + 's',
    animationDuration: rand(16, 26) + 's',
    opacity: rand(0.25, 0.5),
  }))
})

// 맑은 밤: 반짝이는 별
const stars = computed(() => {
  if (kind.value !== 'clear' || !props.isNight) return []
  return genItems(70, () => ({
    left: rand(0, 100) + '%',
    top: rand(0, 70) + '%',
    animationDelay: rand(0, 4) + 's',
    animationDuration: rand(2, 5) + 's',
    width: rand(1, 3) + 'px',
    height: rand(1, 3) + 'px',
  }))
})
</script>

<template>
  <div class="weather-fx" :class="[`fx-${kind}`, { 'fx-night': isNight }]" aria-hidden="true">
    <!-- 맑음(낮): 태양 + 회전 광선 -->
    <div v-if="kind === 'clear' && !isNight" class="sun-wrap">
      <div class="sun-rays"></div>
      <div class="sun-core"></div>
    </div>

    <!-- 맑음(밤): 달 + 별 -->
    <template v-if="kind === 'clear' && isNight">
      <div class="moon"></div>
      <span v-for="s in stars" :key="'star-' + s.id" class="star" :style="s.style"></span>
    </template>

    <!-- 구름 (구름/비/뇌우/안개 공통 배경 구름) -->
    <div v-for="c in clouds" :key="'cloud-' + c.id" class="cloud" :style="c.style">
      <span></span>
    </div>

    <!-- 비 -->
    <div v-for="d in rainDrops" :key="'rain-' + d.id" class="raindrop" :style="d.style"></div>

    <!-- 뇌우: 번개 플래시 -->
    <div v-if="kind === 'thunder'" class="lightning-flash"></div>

    <!-- 눈 -->
    <span v-for="f in snowFlakes" :key="'snow-' + f.id" class="snowflake" :style="f.style">❄</span>

    <!-- 안개 -->
    <div v-for="b in mistBands" :key="'mist-' + b.id" class="mist-band" :style="b.style"></div>
  </div>
</template>

<style scoped>
.weather-fx {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

/* ---------- 맑음(낮): 태양 ---------- */
.sun-wrap {
  position: absolute;
  top: 8%;
  right: 10%;
  width: 160px;
  height: 160px;
}

.sun-core {
  position: absolute;
  inset: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff9e6 0%, #ffe27a 45%, #ffc93c 75%, rgba(255, 201, 60, 0) 100%);
  box-shadow: 0 0 60px 18px rgba(255, 210, 100, 0.55);
  animation: sun-pulse 4s ease-in-out infinite;
}

.sun-rays {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: repeating-conic-gradient(
    rgba(255, 244, 200, 0.55) 0deg 4deg,
    transparent 4deg 18deg
  );
  animation: sun-rotate 60s linear infinite;
  filter: blur(0.5px);
}

@keyframes sun-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes sun-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.92;
  }
}

/* ---------- 맑음(밤): 달 + 별 ---------- */
.moon {
  position: absolute;
  top: 9%;
  right: 12%;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, #fdfdf6 0%, #eef0e0 55%, #d9dbc9 100%);
  box-shadow: 0 0 34px 6px rgba(230, 233, 210, 0.45),
    inset -14px -6px 0 0 rgba(0, 0, 0, 0.12);
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: star-twinkle ease-in-out infinite;
}

@keyframes star-twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

/* ---------- 구름 ---------- */
.cloud {
  position: absolute;
  left: -220px;
  width: 140px;
  height: 46px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50px;
  animation-name: cloud-drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.cloud span,
.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud::before {
  width: 70px;
  height: 70px;
  top: -30px;
  left: 18px;
}

.cloud::after {
  width: 56px;
  height: 56px;
  top: -20px;
  right: 20px;
}

.fx-rain .cloud,
.fx-thunder .cloud,
.fx-mist .cloud {
  background: rgba(210, 218, 228, 0.75);
}

@keyframes cloud-drift {
  from {
    transform: translateX(0) scale(var(--s, 1));
  }
  to {
    transform: translateX(calc(100vw + 260px)) scale(var(--s, 1));
  }
}

/* ---------- 비 ---------- */
.raindrop {
  position: absolute;
  top: -6%;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, rgba(210, 230, 255, 0) 0%, rgba(210, 230, 255, 0.8) 100%);
  animation-name: rain-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  transform: rotate(10deg);
}

@keyframes rain-fall {
  from {
    transform: translateY(-10vh) rotate(10deg);
  }
  to {
    transform: translateY(110vh) rotate(10deg);
  }
}

/* ---------- 뇌우: 번개 ---------- */
.lightning-flash {
  position: absolute;
  inset: 0;
  background: #eef3ff;
  opacity: 0;
  animation: lightning-strike 7s ease-in-out infinite;
}

@keyframes lightning-strike {
  0%,
  91%,
  100% {
    opacity: 0;
  }
  92% {
    opacity: 0.85;
  }
  93% {
    opacity: 0.1;
  }
  94% {
    opacity: 0.65;
  }
  95%,
  97% {
    opacity: 0;
  }
  97.5% {
    opacity: 0.4;
  }
  98% {
    opacity: 0;
  }
}

/* ---------- 눈 ---------- */
.snowflake {
  position: absolute;
  top: -8%;
  color: #fff;
  animation-name: snow-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes snow-fall {
  from {
    transform: translate(0, -10vh);
  }
  to {
    transform: translate(var(--drift, 0px), 110vh);
  }
}

/* ---------- 안개 ---------- */
.mist-band {
  position: absolute;
  left: -30%;
  width: 160%;
  height: 90px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(6px);
  animation-name: mist-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes mist-drift {
  0% {
    transform: translateX(-6%);
  }
  50% {
    transform: translateX(6%);
  }
  100% {
    transform: translateX(-6%);
  }
}

/* 모션 최소화 설정 존중 */
@media (prefers-reduced-motion: reduce) {
  .weather-fx * {
    animation: none !important;
  }
}

@media (max-width: 560px) {
  .sun-wrap {
    width: 110px;
    height: 110px;
    top: 4%;
    right: 6%;
  }
  .moon {
    width: 50px;
    height: 50px;
  }
}
</style>
