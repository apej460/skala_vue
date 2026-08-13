<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useCitiesStore } from '@/stores/citiesStore'
import BaseDashboardCard from '@/component/exercise/BaseDashboardCard.vue'
import SearchBar from '@/component/exercise/SearchBar.vue'
import WeatherCard from '@/component/exercise/WeatherCard.vue'
import HeroWeather from '@/component/HeroWeather.vue'
import AddCitySearch from '@/component/AddCitySearch.vue'
import HourlyForecast from '@/component/HourlyForecast.vue'
import DailyForecast from '@/component/DailyForecast.vue'

const router = useRouter()
const configStore = useConfigStore()
const citiesStore = useCitiesStore()

// 1) 반응형 상태
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const statusText = ref('도시 카드를 눌러 선택해보세요')

onMounted(() => {
  if (Object.keys(citiesStore.weatherById).length === 0) citiesStore.fetchAll()
})

// 2) computed: 검색어가 포함된 도시만 필터링
const filteredCities = computed(() => {
  if (!searchQuery.value.trim()) return citiesStore.cities
  return citiesStore.cities.filter((c) => c.name.includes(searchQuery.value.trim()))
})

// 검색 힌트 문구를 하나의 요소로 유지해 검색할 때마다 DOM이 교체되며 화면이 흔들리는 것을 방지
const hintText = computed(() => {
  if (!searchQuery.value.trim()) return `전체 ${citiesStore.cities.length}개 도시를 추적 중입니다.`
  if (filteredCities.value.length > 0) return `"${searchQuery.value}" 검색 결과 ${filteredCities.value.length}건`
  return '검색 결과와 일치하는 도시가 없습니다 🙁'
})
const isHintEmpty = computed(() => searchQuery.value.trim() && filteredCities.value.length === 0)

const favoriteCities = computed(() =>
  citiesStore.cities.filter((c) => configStore.isFavorite(c.id))
)

// 3) watch: selectedCityInfo가 바뀔 때마다 상태바 갱신 + 콘솔 로그
watch(selectedCityInfo, (newCity) => {
  if (!newCity) return
  statusText.value = `${newCity.name}이 선택되었습니다.`
  console.log('[watch] selectedCityInfo →', newCity)
})

// watchEffect: 검색어 변화 추적 (의존성 자동 감지)
watchEffect(() => {
  console.log('[watchEffect] searchQuery →', searchQuery.value)
})

function handleUpdateQuery(value) {
  searchQuery.value = value
}
function handleSelectCard(city) {
  selectedCityInfo.value = city
  citiesStore.setPrimary(city.id)
  // 카드 선택 시 상단의 히어로 영역으로 스크롤해 변경된 정보가 바로 보이도록 함
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function handleClickDetail(city) {
  router.push({ name: 'weather-detail', params: { cityId: city.id } })
}
function handleRemoveCity(city) {
  citiesStore.removeCity(city.id)
}
</script>

<template>
  <HeroWeather
    :city="citiesStore.primaryCity"
    :weather="citiesStore.primaryWeather"
    :loading="citiesStore.primaryCity && citiesStore.loadingIds[citiesStore.primaryCity.id]"
  />

  <BaseDashboardCard v-if="citiesStore.primaryWeather" title="예보">
    <p class="section-title">⏱️ 시간별 예보</p>
    <HourlyForecast :hourly="citiesStore.primaryWeather.hourly" />
    <p class="section-title" style="margin-top: 20px">📅 5일 예보</p>
    <DailyForecast :daily="citiesStore.primaryWeather.daily" />
  </BaseDashboardCard>

  <BaseDashboardCard title="지역별 날씨 현황" :status-text="statusText">
    <AddCitySearch />

    <template #search>
      <SearchBar :model-value="searchQuery" @update-query="handleUpdateQuery" />
    </template>

    <!-- 검색 결과 표시 (하나의 요소를 유지해 검색 시 레이아웃이 흔들리지 않도록 함) -->
    <p class="hint" :class="{ empty: isHintEmpty }">{{ hintText }}</p>

    <TransitionGroup tag="div" name="card-fade" class="card-grid">
      <WeatherCard
        v-for="city in filteredCities"
        :key="city.id"
        :city="city"
        :weather="citiesStore.weatherById[city.id]"
        :loading="Boolean(citiesStore.loadingIds[city.id])"
        :error="citiesStore.errorById[city.id]"
        :removable="citiesStore.cities.length > 1"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
        @remove-city="handleRemoveCity"
      />
    </TransitionGroup>
  </BaseDashboardCard>

  <BaseDashboardCard title="⭐ 즐겨찾기">
    <div v-if="favoriteCities.length === 0" class="hint">
      카드 우측 상단의 ☆를 눌러 즐겨찾기에 도시를 추가해보세요.
    </div>
    <div v-else class="favorite-row">
      <RouterLink
        v-for="city in favoriteCities"
        :key="city.id"
        :to="{ name: 'weather-detail', params: { cityId: city.id } }"
        class="favorite-chip"
      >
        <span>{{ city.name }}</span>
        <span v-if="citiesStore.weatherById[city.id]">
          {{ configStore.convertTemp(citiesStore.weatherById[city.id].temp) }}{{ configStore.unitLabel }}
        </span>
      </RouterLink>
    </div>
  </BaseDashboardCard>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--text-sub);
  margin: 0 0 14px;
}

.hint.empty {
  color: #ffd8a8;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  position: relative;
}

.card-fade-move {
  transition: transform 0.25s ease;
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

.favorite-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.favorite-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 14px;
  font-weight: 600;
}

.favorite-chip:hover {
  background: rgba(255, 255, 255, 0.32);
}
</style>