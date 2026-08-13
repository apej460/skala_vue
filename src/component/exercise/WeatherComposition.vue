<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 반응형 상태 정의 (searchQuery, selectedCityInfo, weatherList)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주도', temp: 13, status: '비' },
  { id: 'city_05', name: '부산 기장', temp: 15, status: '구름' },
  { id: 'city_06', name: '강릉', temp: 29, status: '맑음' },
  { id: 'city_07', name: '대전', temp: 22, status: '흐림' }
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 5. 본인만의 반응형 상태 변수: 더운 도시(25도 이상)만 보기 필터 토글
const showHotOnly = ref(false)

// 2. computed 활용: 도시 이름 필터링 + (본인 상태 필터 반영)
const filteredWeatherList = computed(() => {
  let list = weatherList.value
  const q = searchQuery.value.trim()

  if (q) {
    list = list.filter((item) => item.name.includes(q))
  }
  if (showHotOnly.value) {
    list = list.filter((item) => item.temp >= 25)
  }

  return list
})

// 5. 본인만의 Computed: 전체 도시 중 25도 이상인 더운 도시 개수 계산
const hotCityCount = computed(() => {
  return weatherList.value.filter((item) => item.temp >= 25).length
})

// 3. watch 이용: selectedCityInfo 감시 (상태바 변경 추적)
watch(selectedCityInfo, (newVal, oldVal) => {
  if (newVal) {
    console.log(
      `[watch] 상태바 변경: "${oldVal?.name || '없음'}" -> "${newVal.name}"(으)로 선택되었습니다.`
    )
  } else {
    console.log('[watch] 선택된 도시 없음')
  }
})

// 3. watchEffect 이용: searchQuery 감시
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// 5. 본인만의 Watcher: showHotOnly 토글 상태 변화 감시
watch(showHotOnly, (newVal) => {
  console.log(`[watch] 더움(25도 이상) 전용 필터 상태 변경: ${newVal ? 'ON' : 'OFF'}`)
})

// 도시 카드 선택 함수
const selectCity = (item) => {
  selectedCityInfo.value = item
}

// 상세보기 버튼 클릭 함수 (버블링 방지)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="mockup-container">
    <header class="mockup-header">
      <h1>⛅️ 과제 2: 날씨 (컴포지션)</h1>
    </header>

    <!-- 검색 및 필터 영역 -->
    <section class="search-section card">
      <h2>🔍 도시 검색</h2>
      <div class="search-input-wrapper">
        <input
          type="text"
          :value="searchQuery"
          @input="searchQuery = $event.target.value.trim()"
          placeholder="도시명을 입력하세요"
          class="search-input"
        />
      </div>

      <div class="filter-wrapper">
        <p class="search-result">
          입력한 도시 : <span class="highlight">{{ searchQuery }}</span>
        </p>

        <!-- 본인 반응형 상태(showHotOnly) 조작용 버튼 -->
        <button
          class="btn-filter"
          :class="{ active: showHotOnly }"
          @click="showHotOnly = !showHotOnly"
        >
          🔥 더운 도시만 보기 (총 {{ hotCityCount }}곳)
        </button>
      </div>
    </section>

    <section class="weather-section card">
      <h2>🗺️ 지역별 날씨 현황</h2>

      <ul v-if="filteredWeatherList.length > 0" class="weather-grid">
        <li
          v-for="item in filteredWeatherList"
          :key="item.id"
          class="weather-card"
          @click="selectCity(item)"
        >
          <div class="card-header">
            <p class="city-name">
              {{ item.name }} <span class="status">({{ item.status }})</span>
            </p>
            <button
              class="btn-detail"
              @click.stop="showDetail(item.name, item.status)"
            >
              상세보기
            </button>
          </div>

          <p class="temp">현재 기온: {{ item.temp }}°C</p>

          <!-- 기온 조건부 렌더링 (25도 이상 / 25도 미만) -->
          <div class="badge-wrapper">
            <p v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</p>
            <p v-else class="badge cool">❄️ 선선함 (25도 미만)</p>
          </div>
        </li>
      </ul>

      <!-- 검색어 및 필터 조건과 일치하는 데이터가 없을 때 -->
      <div v-else class="empty-box">
        <p class="empty-text">🔍 검색 결과와 일치하는 도시가 없습니다.</p>
      </div>
    </section>

    <!-- 상태바 -->
    <footer class="status-bar card">
      <p v-if="selectedCityInfo">📢 {{ selectedCityInfo.name }}이(가) 선택되었습니다.</p>
      <p v-else>📢 카드를 클릭하거나 검색해보세요.</p>
    </footer>
  </div>
</template>
<style scoped>

/* 전체 페이지 */
.mockup-container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 30px;

  background: #1e293b;

  border: 1px solid #334155;
  border-radius: 20px;

  box-sizing: border-box;
}

/* 제목 영역 */
.mockup-header {
  margin-bottom: 30px;
}

.mockup-header h1 {
  text-align: center;
  color: #f8fafc;
  margin: 0;

  font-size: 28px;
  font-weight: 700;
}


/* 공통 카드 */
.card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 16px;

  box-sizing: border-box;
}


/* =========================
   검색 영역
========================= */

.search-section {
  padding: 25px;
  margin-bottom: 25px;
}

.search-section h2 {
  margin: 0 0 20px;

  color: #f8fafc;
  font-size: 20px;
  text-align: center;
}


/* 검색창 */
.search-input-wrapper {
  display: flex;
  justify-content: center;
}

.search-input {
  width: 320px;

  padding: 12px 16px;

  background: #1e293b;
  color: #f8fafc;

  border: 1px solid #334155;
  border-radius: 10px;

  outline: none;

  font-size: 15px;

  transition: 0.2s;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: #64748b;
  box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.15);
}


/* 검색 결과 + 필터 */
.filter-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;

  margin-top: 20px;
}

.search-result {
  margin: 0;

  color: #cbd5e1;
  font-size: 15px;
}

.highlight {
  color: #f8fafc;
  font-weight: 700;
}


/* 더운 도시 필터 버튼 */
.btn-filter {
  padding: 10px 16px;

  background: #1e293b;
  color: #cbd5e1;

  border: 1px solid #334155;
  border-radius: 10px;

  cursor: pointer;

  font-weight: 600;

  transition: 0.2s;
}

.btn-filter:hover {
  background: #334155;
  color: #f8fafc;
}

.btn-filter.active {
  background: #7c2d12;
  border-color: #f97316;
  color: #fed7aa;
}


/* =========================
   날씨 영역
========================= */

.weather-section {
  padding: 25px;
  margin-bottom: 25px;
}

.weather-section h2 {
  margin: 0 0 25px;

  color: #f8fafc;
  font-size: 20px;
  text-align: center;
}


/* 날씨 카드 그리드 */
.weather-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 20px;

  padding: 0;
  margin: 0;

  list-style: none;
}


/* 개별 날씨 카드 */
.weather-card {
  padding: 20px;

  background: #1e293b;

  border: 1px solid #334155;
  border-radius: 14px;

  cursor: pointer;

  transition: 0.2s;

  box-sizing: border-box;
}

.weather-card:hover {
  transform: translateY(-5px);

  border-color: #64748b;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}


/* 카드 상단 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 18px;
}


/* 도시 이름 */
.city-name {
  margin: 0;

  color: #f8fafc;

  font-size: 20px;
  font-weight: 700;
}

.city-name .status {
  color: #94a3b8;

  font-size: 14px;
  font-weight: 400;
}


/* 상세보기 버튼 */
.btn-detail {
  padding: 7px 11px;

  background: #2563eb;
  color: white;

  border: none;
  border-radius: 8px;

  cursor: pointer;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;

  transition: 0.2s;
}

.btn-detail:hover {
  background: #1d4ed8;
}


/* 현재 기온 */
.temp {
  margin: 10px 0 15px;

  color: #f8fafc;

  font-size: 27px;
  font-weight: 700;

  text-align: center;
}


/* 더움 / 선선함 영역 */
.badge-wrapper {
  display: flex;
  justify-content: center;

  margin-top: 10px;
}


/* 공통 배지 */
.badge {
  margin: 0;

  padding: 7px 12px;

  border-radius: 20px;

  font-size: 13px;
  font-weight: 700;
}


/* 25도 이상 */
.badge.hot {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;

  border: 1px solid rgba(249, 115, 22, 0.3);
}


/* 25도 미만 */
.badge.cool {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;

  border: 1px solid rgba(56, 189, 248, 0.3);
}


/* =========================
   검색 결과 없음
========================= */

.empty-box {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 180px;

  background: #1e293b;

  border: 1px dashed #475569;
  border-radius: 12px;
}

.empty-text {
  margin: 0;

  color: #94a3b8;

  font-size: 15px;
}


/* =========================
   상태바
========================= */

.status-bar {
  padding: 18px 20px;

  text-align: center;
}

.status-bar p {
  margin: 0;

  color: #cbd5e1;

  font-size: 15px;
}


/* 선택된 도시가 있을 때 */
.status-bar p:not(:only-child) {
  color: #f8fafc;
}


/* =========================
   반응형
========================= */

@media (max-width: 900px) {
  .weather-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


@media (max-width: 650px) {
  .mockup-container {
    margin: 20px;
    padding: 20px;
  }

  .weather-grid {
    grid-template-columns: 1fr;
  }

  .filter-wrapper {
    flex-direction: column;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }

  .search-input-wrapper {
    width: 100%;
  }
}

</style>