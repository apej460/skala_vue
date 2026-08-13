import axios from 'axios'

// OpenWeatherMap 연동: 현재 날씨 / 5일 예보 / 대기질 / 지오코딩
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

export function hasApiKey() {
  return Boolean(API_KEY)
}

// 도시명(한글/영문)으로 좌표 검색 (자동완성용, 최대 limit개)
export async function geocodeSearch(query, limit = 5) {
  if (!API_KEY || !query.trim()) return []
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit, appid: API_KEY },
  })
  return data.map((d) => ({
    name: d.local_names?.ko || d.name,
    country: d.country,
    state: d.state,
    lat: d.lat,
    lon: d.lon,
  }))
}

// 좌표 → 지명 (내 위치 사용 기능)
export async function reverseGeocode(lat, lon) {
  if (!API_KEY) return null
  const { data } = await axios.get(`${GEO_URL}/reverse`, {
    params: { lat, lon, limit: 1, appid: API_KEY },
  })
  const d = data[0]
  if (!d) return null
  return { name: d.local_names?.ko || d.name, country: d.country }
}

async function fetchCurrentRaw(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return data
}

// 지도 페이지처럼 다수 도시를 한번에 훑을 때 쓰는 경량 조회 (현재 날씨만, 예보/대기질 제외)
export async function fetchCurrentOnly(lat, lon) {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다.')
  }
  const current = await fetchCurrentRaw(lat, lon)
  return {
    temp: Math.round(current.main.temp),
    description: current.weather[0].description,
    main: current.weather[0].main,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    updatedAt: Date.now(),
  }
}

async function fetchForecastRaw(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return data
}

async function fetchAirQualityRaw(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  })
  return data
}

function buildHourly(list) {
  return list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    main: item.weather[0].main,
    label: new Date(item.dt * 1000).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }))
}

function buildDaily(list) {
  const byDate = {}
  list.forEach((item) => {
    const date = item.dt_txt.slice(0, 10)
    if (!byDate[date]) byDate[date] = { temps: [], icons: {}, mains: {} }
    byDate[date].temps.push(item.main.temp)
    byDate[date].icons[item.weather[0].icon] = (byDate[date].icons[item.weather[0].icon] || 0) + 1
    byDate[date].mains[item.weather[0].main] = (byDate[date].mains[item.weather[0].main] || 0) + 1
  })
  return Object.entries(byDate)
    .slice(0, 5)
    .map(([date, info]) => {
      const icon = Object.entries(info.icons).sort((a, b) => b[1] - a[1])[0][0]
      const main = Object.entries(info.mains).sort((a, b) => b[1] - a[1])[0][0]
      return {
        date,
        day: new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' }),
        low: Math.round(Math.min(...info.temps)),
        high: Math.round(Math.max(...info.temps)),
        icon,
        main,
      }
    })
}

// 하나의 도시(좌표)에 대해 현재 날씨 + 5일 예보 + 대기질을 한번에 조회 후 정규화
export async function fetchCityWeatherBundle(city) {
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다. .env의 VITE_OPENWEATHER_API_KEY를 확인해주세요.')
  }
  const [current, forecast, air] = await Promise.all([
    fetchCurrentRaw(city.lat, city.lon),
    fetchForecastRaw(city.lat, city.lon),
    fetchAirQualityRaw(city.lat, city.lon).catch(() => null),
  ])

  return {
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    tempMin: Math.round(current.main.temp_min),
    tempMax: Math.round(current.main.temp_max),
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    visibility: current.visibility,
    windSpeed: current.wind.speed,
    description: current.weather[0].description,
    main: current.weather[0].main,
    icon: current.weather[0].icon,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    timezone: current.timezone,
    dt: current.dt,
    aqi: air?.list?.[0]?.main?.aqi ?? null,
    hourly: buildHourly(forecast.list),
    daily: buildDaily(forecast.list),
    updatedAt: Date.now(),
  }
}
