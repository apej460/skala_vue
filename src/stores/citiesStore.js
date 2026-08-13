import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { defaultCities } from '@/data/defaultCities'
import { fetchCityWeatherBundle, fetchCurrentOnly, reverseGeocode } from '@/services/weatherService'
import { mapWithConcurrency } from '@/utils/concurrency'

const STORAGE_KEY = 'weather-dashboard:cities'
const MAP_CACHE_MS = 10 * 60 * 1000

function loadCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('오류 발생:', e)
  }
  return defaultCities
}

// 추적 중인 도시 목록 + 각 도시의 실시간 날씨 데이터를 관리하는 스토어
export const useCitiesStore = defineStore('cities', () => {
  const cities = ref(loadCities())
  const weatherById = ref({})
  const loadingIds = ref({})
  const errorById = ref({})
  const primaryId = ref(cities.value[0]?.id ?? null)

  // 전국 지도 페이지 전용 경량 날씨 캐시 (도시별 현재 온도/아이콘만)
  const mapWeatherById = ref({})
  const mapLoading = ref(false)
  const mapUpdatedAt = ref(0)

  const primaryCity = computed(
    () => cities.value.find((c) => c.id === primaryId.value) ?? cities.value[0],
  )
  const primaryWeather = computed(() =>
    primaryCity.value ? weatherById.value[primaryCity.value.id] : null,
  )
  const isAnyLoading = computed(() => Object.keys(loadingIds.value).length > 0)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.value))
  }

  async function fetchWeatherFor(city) {
    loadingIds.value = { ...loadingIds.value, [city.id]: true }
    try {
      const data = await fetchCityWeatherBundle(city)
      weatherById.value = { ...weatherById.value, [city.id]: data }
      const { [city.id]: _removed, ...rest } = errorById.value
      errorById.value = rest
    } catch (err) {
      errorById.value = { ...errorById.value, [city.id]: err.message }
    } finally {
      const { [city.id]: _done, ...rest } = loadingIds.value
      loadingIds.value = rest
    }
  }

  async function fetchAll() {
    await Promise.all(cities.value.map((city) => fetchWeatherFor(city)))
  }

  function makeId(name, lat, lon) {
    return `${name}-${lat.toFixed(2)}-${lon.toFixed(2)}`.toLowerCase().replace(/\s+/g, '-')
  }

  async function addCity({ name, country, lat, lon }) {
    const id = makeId(name, lat, lon)
    const existing = cities.value.find((c) => c.id === id)
    if (existing) return existing.id

    const city = { id, name, country, lat, lon }
    cities.value = [...cities.value, city]
    persist()
    await fetchWeatherFor(city)
    return id
  }

  function removeCity(id) {
    cities.value = cities.value.filter((c) => c.id !== id)
    const { [id]: _removed, ...rest } = weatherById.value
    weatherById.value = rest
    persist()
    if (primaryId.value === id) {
      primaryId.value = cities.value[0]?.id ?? null
    }
  }

  function setPrimary(id) {
    primaryId.value = id
  }

  // Geolocation API + 역지오코딩으로 내 위치 날씨를 추가하고 대표 도시로 설정
  function useMyLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords
            const place = await reverseGeocode(latitude, longitude)
            const id = await addCity({
              name: place?.name ?? '내 위치',
              country: place?.country ?? '',
              lat: latitude,
              lon: longitude,
            })
            setPrimary(id)
            resolve(id)
          } catch (err) {
            reject(err)
          }
        },
        () => reject(new Error('위치 접근 권한이 거부되었습니다.')),
      )
    })
  }

  // 전국 지도 페이지: KMA 도시 목록 전체의 현재 날씨를 동시성 제한(8개씩)으로 조회, 10분 캐시
  async function fetchMapWeather(koreaCityList) {
    if (mapLoading.value) return
    if (mapUpdatedAt.value && Date.now() - mapUpdatedAt.value < MAP_CACHE_MS) return
    mapLoading.value = true
    try {
      await mapWithConcurrency(koreaCityList, 8, async (city) => {
        try {
          const data = await fetchCurrentOnly(city.lat, city.lon)
          mapWeatherById.value = { ...mapWeatherById.value, [city.id]: data }
        } catch (err) {
          console.log('오류:', err)
        }
      })
      mapUpdatedAt.value = Date.now()
    } finally {
      mapLoading.value = false
    }
  }

  // 지도에서 클릭한 KMA 도시를 추적 목록에 추가(이미 있으면 재사용)하고 상세용 전체 데이터를 조회
  async function trackKoreaCity(koreaCity) {
    const existing = cities.value.find((c) => c.id === koreaCity.id)
    if (!existing) {
      cities.value = [
        ...cities.value,
        {
          id: koreaCity.id,
          name: koreaCity.name,
          country: 'KR',
          lat: koreaCity.lat,
          lon: koreaCity.lon,
        },
      ]
      persist()
    }
    const city = cities.value.find((c) => c.id === koreaCity.id)
    if (!weatherById.value[koreaCity.id]) {
      await fetchWeatherFor(city)
    }
    return koreaCity.id
  }

  return {
    cities,
    weatherById,
    loadingIds,
    errorById,
    primaryId,
    primaryCity,
    primaryWeather,
    isAnyLoading,
    mapWeatherById,
    mapLoading,
    fetchWeatherFor,
    fetchAll,
    fetchMapWeather,
    trackKoreaCity,
    addCity,
    removeCity,
    setPrimary,
    useMyLocation,
  }
})
