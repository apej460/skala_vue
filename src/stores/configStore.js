import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-dashboard:config'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('오류 발생:', e)
  }
  return { unit: 'C', favorites: ['ulsan'], darkMode: false }
}

export const useConfigStore = defineStore('config', {
  state: () => loadState(),
  getters: {
    unitLabel: (state) => (state.unit === 'C' ? '°C' : '°F'),
    convertTemp: (state) => (celsius) => {
      if (celsius === null || celsius === undefined) return '-'
      if (state.unit === 'C') return Math.round(celsius)
      return Math.round((celsius * 9) / 5 + 32)
    },
    isFavorite: (state) => (cityId) => state.favorites.includes(cityId),
  },
  actions: {
    // 섭씨 / 화씨 토글
    toggleUnit() {
      this.unit = this.unit === 'C' ? 'F' : 'C'
      this.persist()
    },
    // 즐겨찾기 토글
    toggleFavorite(cityId) {
      this.favorites = this.favorites.includes(cityId)
        ? this.favorites.filter((id) => id !== cityId)
        : [...this.favorites, cityId]
      this.persist()
    },
    // 다크모드 / 라이트모드 토글
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.persist()
    },
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ unit: this.unit, favorites: this.favorites, darkMode: this.darkMode })
      )
    },
  },
})
