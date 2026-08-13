// OpenWeatherMap 아이콘 코드를 실제 이미지 URL로 변환
export function iconUrl(code, size = '2x') {
  return code ? `https://openweathermap.org/img/wn/${code}@${size}.png` : ''
}

// 이모지 폴백 (API 실패 시 사용)
export function statusEmoji(main) {
  const map = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  }
  return map[main] || '🌤️'
}

// Element Plus 아이콘 폴백 (API 이미지 실패 시 사용).
// main.js에서 전역 등록된 아이콘 컴포넌트 이름을 반환하며,
// <component :is="statusIconName(main)" /> 형태로 사용한다.
export function statusIconName(main) {
  const map = {
    Clear: 'Sunny',
    Clouds: 'Cloudy',
    Rain: 'Pouring',
    Drizzle: 'Drizzling',
    Thunderstorm: 'Lightning',
    Snow: 'MostlyCloudy',
    Mist: 'Cloudy',
    Fog: 'Cloudy',
    Haze: 'Cloudy',
  }
  return map[main] || 'PartlyCloudy'
}

// UTC 초 단위 시각 + 타임존 오프셋(초) → "HH:MM" 로컬 시각 문자열
export function formatLocalTime(unixSeconds, tzOffsetSeconds = 0) {
  if (!unixSeconds) return '-'
  const localMs = (unixSeconds + tzOffsetSeconds) * 1000
  const d = new Date(localMs)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// 현재 시각이 일몰~일출 사이(밤)인지 판단
export function isNightNow(sunrise, sunset) {
  const now = Math.floor(Date.now() / 1000)
  if (!sunrise || !sunset) return false
  return now < sunrise || now > sunset
}

// OpenWeatherMap Air Pollution API의 aqi(1~5) → 한글 라벨/색상
export function aqiInfo(aqi) {
  const table = {
    1: { label: '좋음', color: '#4ade80' },
    2: { label: '보통', color: '#a3e635' },
    3: { label: '민감군 주의', color: '#facc15' },
    4: { label: '나쁨', color: '#fb923c' },
    5: { label: '매우 나쁨', color: '#f87171' },
  }
  return table[aqi] ?? { label: '정보 없음', color: '#9ca3af' }
}

// 날씨 상태 + 주야 여부 → 배경 테마 클래스명
export function themeClass(main, isNight) {
  if (isNight) return 'theme-night'
  const map = {
    Clear: 'theme-clear',
    Clouds: 'theme-clouds',
    Rain: 'theme-rain',
    Drizzle: 'theme-rain',
    Thunderstorm: 'theme-thunder',
    Snow: 'theme-snow',
    Mist: 'theme-mist',
    Fog: 'theme-mist',
    Haze: 'theme-mist',
  }
  return map[main] || 'theme-clear'
}

// 섭씨 온도 배열 → 0~100 범위로 정규화된 SVG polyline points 문자열 (5일 예보 스파크라인용)
export function buildSparklinePoints(values, width = 220, height = 46) {
  if (!values || values.length === 0) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = width / (values.length - 1 || 1)
  return values
    .map((v, i) => {
      const x = Math.round(i * step)
      const y = Math.round(height - ((v - min) / range) * height)
      return `${x},${y}`
    })
    .join(' ')
}
