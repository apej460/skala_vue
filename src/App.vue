<script setup>
import { computed, watch, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from '@/components/UnitToggler.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import WeatherAnimation from './components/WeatherAnimation.vue'
import { useConfigStore } from '@/stores/configStore'
import { useCitiesStore } from '@/stores/citiesStore'
import { themeClass, isNightNow } from '@/utils/weatherHelpers'
import { PartlyCloudy } from '@element-plus/icons-vue'

const configStore = useConfigStore()
const citiesStore = useCitiesStore()

// 날씨 테마 배경색 클래스 목록 (body에는 항상 이 중 하나만 붙어 있어야 함)
const THEME_CLASSES = [
  'theme-clear',
  'theme-clouds',
  'theme-rain',
  'theme-thunder',
  'theme-snow',
  'theme-mist',
  'theme-night',
]

// 대표 도시의 날씨/주야 상태에 따라 배경 테마를 실시간으로 전환
const currentTheme = computed(() => {
  const w = citiesStore.primaryWeather
  if (!w) return 'theme-clear'
  return themeClass(w.main, isNightNow(w.sunrise, w.sunset))
})

// 배경 애니메이션(태양/구름/비/눈 등)에 넘겨줄 원본 날씨 상태
const primaryMain = computed(() => citiesStore.primaryWeather?.main ?? 'Clear')
const primaryIsNight = computed(() => {
  const w = citiesStore.primaryWeather
  return w ? isNightNow(w.sunrise, w.sunset) : false
})

// 테마 배경을 .app-shell이 아닌 body 전체에 적용해,
// 화면이 app-shell의 max-width(1180px)보다 넓어도 좌우 여백 색이 따로 놀지 않게 한다.
function applyBodyTheme(theme) {
  document.body.classList.remove(...THEME_CLASSES)
  document.body.classList.add(theme)
}

onMounted(() => {
  citiesStore.fetchAll()
  document.body.classList.toggle('dark-mode', configStore.darkMode)
  applyBodyTheme(currentTheme.value)
})

watch(
  () => configStore.darkMode,
  (value) => document.body.classList.toggle('dark-mode', value),
)

watch(currentTheme, (value) => applyBodyTheme(value))
</script>

<template>
  <WeatherAnimation v-if="!configStore.darkMode" :main="primaryMain" :is-night="primaryIsNight" />

  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">
        <el-icon><PartlyCloudy /></el-icon>
        <span>Weather Dashboard</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="pill-btn" active-class="active">홈</RouterLink>
        <RouterLink to="/map" class="pill-btn" active-class="active">전국 지도</RouterLink>
        <RouterLink to="/compare" class="pill-btn" active-class="active">도시 비교</RouterLink>
        <RouterLink to="/about" class="pill-btn" active-class="active">About</RouterLink>
      </div>

      <div class="nav-actions">
        <DarkModeToggle />
        <UnitToggler />
      </div>
    </div>
  </nav>

  <div class="app-shell">
    <RouterView />
  </div>
</template>

<style scoped>
/* 상단 바 자체는 화면 끝까지 꽉 채우고(양옆 마진 없음, 둥근 모서리/테두리 없음),
   스크롤해도 항상 화면 위에 붙어 있도록 sticky로 고정한다. */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
}

/* 안쪽 메뉴 내용물만 카드 영역과 폭을 맞춰 가운데 정렬 (배경은 계속 꽉 참) */
.navbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  justify-self: start;
}

.nav-links {
  display: flex;
  gap: 8px;
  justify-self: center;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-actions {
  display: flex;
  gap: 8px;
  justify-self: end;
}

@media (max-width: 760px) {
  .navbar-inner {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .brand,
  .nav-links,
  .nav-actions {
    justify-self: center;
  }
}
</style>
