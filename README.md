# Vue 3 Weather Dashboard (skala_vue)

> **Vue 3 기반의 실시간 날씨 대시보드 웹 애플리케이션**
> 본 프로젝트는 Vue 3의 핵심 기능(Syntax, Composition API, Components, Router, Pinia, Axios, UI Library)을 순차적으로 적용하고 디렉터리 구조를 확장하며 완성한 최종 프로젝트입니다.

## 개요 및 작성 지침

> **학습 및 커스텀 기록 안내**
> 각 단원별 실습이 진행될 때마다 과제 기본 요구사항 외에 **개인별 Customization** 한 내역을 기록하였습니다.

## 폴더 구조

```
src/
├── main.js                     # Pinia + Router + Element Plus 전역 등록
├── App.vue                     # 내비게이션 바(그리드 중앙정렬) + 날씨별 동적 배경 테마/애니메이션
├── asset/main.css              # 전역 스타일 (다크모드, 테마 배경, app-shell 레이아웃 등)
├── router/index.js             # Lazy Loading 라우트 + Catch-all Route
├── stores/
│   ├── configStore.js          # 단위(℃/℉), 즐겨찾기, 다크모드 (localStorage 저장)
│   └── citiesStore.js          # 추적 도시 목록 + 실시간 날씨 + 전국 지도 캐시
├── services/weatherService.js  # Axios + OpenWeatherMap (현재/예보/대기질/지오코딩)
├── utils/
│   ├── weatherHelpers.js       # 아이콘/이모지 매핑, 시간 변환, 대기질 라벨, 배경 테마, 스파크라인
│   └── concurrency.js          # 지도 페이지용 동시 요청 제한 유틸
├── data/
│   ├── defaultCities.js        # 홈 화면 기본 추적 도시
│   └── koreaCities.js          # 기상청 예보 지점 전국 60여개 도시 좌표 (지도 페이지용)
├── components/
│   ├── HeroWeather.vue         # 대표 도시 실시간 날씨 히어로 영역
│   ├── AddCitySearch.vue       # 지오코딩 자동완성으로 도시 추가 + 내 위치 사용
│   ├── HourlyForecast.vue      # 시간별 예보 가로 스크롤
│   ├── DailyForecast.vue       # 5일 예보 + 기온 스파크라인
│   ├── WeatherAnimation.vue    # 날씨별 배경 애니메이션 (신규)
│   ├── UnitToggler.vue / DarkModeToggle.vue
│   └── exercise/
│       ├── WeatherMockup.vue      # 1일차(Vue Syntax) 실습 결과물 - v-for/v-if/양방향 바인딩/이벤트
│       ├── WeatherComposition.vue # 2일차(Composition API) 실습 결과물 - ref/computed/watch
│       ├── BaseDashboardCard.vue  # 3일차(Components) - slot 기반 공통 레이아웃
│       ├── SearchBar.vue          # 3일차(Components) - props/emits (도시 목록 필터)
│       └── WeatherCard.vue        # 3일차(Components) - props/emits (선택/상세보기/즐겨찾기/삭제)
└── views/
    ├── WeatherHomeView.vue     # 메인 대시보드
    ├── WeatherDetailView.vue   # /weather/:cityId 상세 페이지
    ├── KoreaMapView.vue        # /map 전국 지도 페이지 (신규)
    ├── WeatherCompareView.vue  # /compare 도시 비교 페이지 (신규)
    ├── WeatherAboutView.vue    # /about 소개 페이지
    └── NotFoundView.vue        # 404 catch-all
```

## 단원별 요구사항 및 개인 Customization 내역

### 1. Vue Syntax (기초 문법 & 템플릿)

#### 과제 요구사항

* **배열 렌더링 (`v-for`)**: 임의의 날씨 데이터 배열(`weatherList`)을 활용해 화면에 날씨 카드를 반복 출력 (속성 `:key="city.id"` 바인딩 필수).
* **조건부 렌더링 (`v-if`)**: 기온 25°C 이상은 `"🔥 더움 (25도 이상)"`, 25°C 미만은 `"❄️ 선선함 (25도 미만)"` 라벨 표시.
* **양방향 바인딩 및 한글 처리 (`:value`, `@input`)**: 한글 검색 `input` 생성 후 입력된 도시명 출력.
* **이벤트 및 수식어**:
  * 카드 클릭 시 상태바에 `"{도시}이 선택되었습니다."` 표기.
  * 상세보기 버튼 클릭 시 이벤트 버블링 방지(`.stop`) 후 `window.alert` 출력.
* **Mockup 데이터 연동**: 본인만의 데이터 및 UI 모듈 추가.

#### 개인 Customization 내역

* **습도/풍속 데이터 항목 추가**: 기본 기온/상태 외에 습도(%) 및 풍속(m/s) 항목을 `weatherList`에 추가 바인딩.
* **본인만의 데이터 확장**: 서울/수원/부산 3개 도시 외에 제주도·부산 기장·강릉·대전 등을 추가해 총 7개 도시 Mockup 데이터로 확장.
* **구현 위치**: `src/components/exercise/WeatherMockup.vue`

---

### 2. Composition API (반응형 상태 관리)

#### 과제 요구사항

* **반응형 상태 관리 (`ref`, `reactive`)**: `searchQuery`, `selectedCityInfo`, `weatherList`를 반응형 상태로 정의.
* **Computed 활용**: 도시 이름 검색어 필터링 기능을 `filteredWeatherList` Computed로 구현.
* **Watcher (`watch`, `watchEffect`)**:
  * `watch`: `selectedCityInfo` 변경 시 콘솔 로그 출력.
  * `watchEffect`: `searchQuery` 실시간 타이핑 추적 콘솔 로그 출력.
* **검색 결과 예외 처리 (Template)**: 검색어 비어있음, 일치 데이터 있음, 일치 데이터 없음(안내 문구) 분기 처리.

#### 개인 Customization 내역

* **더운 도시만 보기 필터 (`showHotOnly`)**: 25°C 이상 도시만 걸러 보는 반응형 토글 상태 추가, `filteredWeatherList` Computed에 필터 조건으로 함께 반영.
* **더운 도시 개수 Computed (`hotCityCount`)**: 전체 `weatherList` 중 25°C 이상인 도시 개수를 계산하는 보조 Computed 속성 추가.
* **구현 위치**: `src/components/exercise/WeatherComposition.vue`

---

### 3. Vue Components (컴포넌트 분리 및 통신)

#### 과제 요구사항

* **기능 변경 없이 4개 컴포넌트로 분리**:
  1. `WeatherParent.vue`: 메인 반응형 데이터 상태 관리.
  2. `BaseDashboardCard.vue`: `<slot>` 기반의 검색/리스트 영역 공통 카드 레이아웃.
  3. `SearchBar.vue`: `props`로 검색어 수신, `emits('update-query')`로 검색어 전달.
  4. `WeatherCard.vue`: `props`로 도시 객체 수신, `emits('select-card')`, `emits('click-detail')` 전달.
* **스타일 캡슐화**: 각 컴포넌트에 `<style scoped>` 적용.

#### 개인 Customization 내역

* **즐겨찾기/삭제 기능을 `WeatherCard.vue`에 통합**: 기본 요구사항(선택/상세보기)에 더해 `toggle-favorite`, `remove-city` 이벤트를 추가로 emit하도록 확장, 카드 자체에서 즐겨찾기 별 아이콘과 삭제(✕) 버튼을 제공.
* **`BaseDashboardCard` 슬롯 구조화**: 검색 영역과 리스트 영역을 분리된 슬롯으로 주입할 수 있도록 구성해 홈 화면 외의 다른 뷰에서도 재사용 가능하도록 설계.
* **구현 위치**: `src/components/exercise/BaseDashboardCard.vue`, `SearchBar.vue`, `WeatherCard.vue`

---

### 4. Vue Router (페이지 라우팅)

#### 과제 요구사항

* **라우터 설정**: 라우터 지연 로딩(Lazy Loading, `import()`) 및 Catch-all Route(`/:pathMatch(.*)*`) 적용.
* **App.vue**: Navigation Bar(`RouterLink`) 및 메인 콘텐츠 영역(`RouterView`) 배치.
* **WeatherHomeView.vue**: `WeatherParent` 대체 (`/` 경로 대응). 상세보기 버튼 클릭 시 `window.alert()` 제거 후 `router.push('/weather/' + id)`로 프로그래밍 방식 이동.
* **WeatherDetailView.vue**: Dynamic Route Matching(`:cityId`) 기반으로 Mount 시점 Mock Data 데이터 바인딩.
* **WeatherAboutView.vue**: 프로젝트 소개 및 메인 대시보드 돌아가기 버튼 작성.
* **404 Not Found 전용 뷰 구성**: 잘못된 경로 접근 시 대시보드로 복귀를 유도하는 에러 페이지 UI 제공(`NotFoundView.vue`).

#### 개인 Customization 내역

* **`WeatherCompareView.vue` 추가 작성**: 두 개 이상(최대 4개)의 도시 기상을 한 화면에서 상호 비교할 수 있는 별도 라우트 `/compare` 추가. 가장 따뜻한 도시·대기질이 가장 좋은 도시를 자동 배지로 표시.
* **`KoreaMapView.vue` 추가 작성**: 기상청 예보 지점 전국 60여개 도시를 좌표 계산으로 그린 간략 지도 위에 표시하고, 클릭 시 해당 도시 상세 페이지(`/weather/:cityId`)로 이동하는 `/map` 라우트 신규 추가.
* **구현 위치**: `src/router/index.js`, `src/views/*`

---

### 5. Pinia (전역 상태 관리)

#### 과제 요구사항

* **`UnitToggler.vue`**: 대시보드 상단(Nav Bar 옆)에 섭씨(°C) / 화씨(°F) 단위 변경 UI 버튼 추가.
* **전역 단위 설정 적용**: 메인 및 상세 화면 전체에 Pinia 스토어를 통한 온도 단위 전환 연동.
* **Store 확장**: `configStore` 내부 `state`, `getter`, `action` 확장 또는 커스텀 스토어 연동.

#### 개인 Customization 내역

* **즐겨찾기 상태를 `configStore`에 통합 관리**: `favorites` 배열을 state에 추가하고 `toggleFavorite(cityId)` action, `isFavorite(cityId)` getter를 작성해 즐겨찾기 등록/해제 및 `localStorage` 자동 동기화(persist)를 구현.
* **다크모드 상태도 함께 persist**: `darkMode` state와 `toggleDarkMode()` action을 추가해 새로고침 후에도 유지되도록 처리.
* **온도 단위 변환 Getter (`convertTemp`)**: 스토어 내에서 입력된 섭씨 온도를 선택된 단위(℃/℉)에 따라 자동 변환해 반환하는 Getter 작성.
* **`citiesStore.js` 커스텀 스토어 신규 작성**: 추적 도시 목록, 도시별 실시간 날씨/로딩/에러 상태, 전국 지도용 경량 날씨 캐시(10분 TTL)를 관리하는 별도 스토어를 구축.
* **구현 위치**: `src/stores/configStore.js`, `src/stores/citiesStore.js`

---

### 6. Axios & OpenWeatherMap API (외부 데이터 통신)

#### 과제 요구사항

* **OpenWeatherMap API**: 실제 날씨 데이터 비동기 호출 및 애플리케이션 바인딩.
* **기능 확장**: OpenWeatherMap 추가 API (예: 5일·3시간 예보 API) 연동.
* **외부 API 추가**: 기타 외부 API(예: 카카오 위치/지오코딩 API, 대기오염 API 등) 연동.

#### 개인 Customization 내역

* **Air Pollution API(미세먼지/초미세먼지) 추가 연동**: 도시별 대기질(AQI) 수치를 추가로 수집하여 5단계 색상 배지로 시각화.
* **지오코딩 + 역지오코딩 연동**: 도시명 자동완성 검색(`AddCitySearch.vue`)과 Geolocation 기반 "내 위치 날씨 추가" 기능 구현.
* **동시 요청 제한 유틸(`concurrency.js`) 작성**: 전국 지도 페이지에서 60여개 지점의 날씨를 한 번에 호출하지 않도록 동시 요청 개수를 제한하는 `mapWithConcurrency` 유틸 추가.
* **API 호출 Skeleton UI / Loading Spinner 추가**: 비동기 데이터를 받아오는 동안 사용자 경험을 향상시키는 로딩 상태 UI 적용.
* **구현 위치**: `src/services/weatherService.js`, `src/utils/concurrency.js`, `src/components/AddCitySearch.vue`

---

### 7. UI Libraries (UI 라이브러리 적용)

#### 과제 요구사항

* **UI Library 선정 및 적용**: Element Plus(또는 기타 UI 라이브러리)를 도입하여 뷰 컴포넌트의 완성도 제고.

#### 개인 Customization 내역

* **Element Plus 전면 도입**: `el-card`, `el-input`, `el-button`, `el-tag`, `el-skeleton` 등 적용, `ElNotification`으로 단위 변경/즐겨찾기 추가·삭제 시 토스트 알림 연동.
* **이모지 → 아이콘 컴포넌트 전환**: 폰트/OS에 따라 이모지가 깨지거나 다르게 보이는 문제를 없애기 위해, 기존 이모지로 표시하던 UI 라벨·버튼 아이콘을 Element Plus 아이콘(`@element-plus/icons-vue`)으로 교체.
  * `main.js`에서 모든 아이콘을 전역 컴포넌트로 등록해 `<component :is="아이콘이름" />` 형태의 동적 렌더링 지원.
  * `utils/weatherHelpers.js`에 아이콘 매핑 헬퍼를 추가하고, 기존 이모지 폴백 함수는 하위 호환을 위해 유지.
  * 주요 매핑: 📍→`Location`, 💧→`Drizzling`(습도), 🌬️→`WindPower`(풍속), 👁️→`View`(가시거리), 🌅/🌇→`Sunrise`/`Sunset`, ☀️/🌙→`Sunny`/`Moon`(다크모드), 🔍→`Search`, ✕→`Close`, ★/☆→`StarFilled`/`Star`(즐겨찾기) 등.
* **구현 위치**: `src/main.js`, `src/utils/weatherHelpers.js`, 각 컴포넌트/뷰 전반

---

### 8. Vite Build & Deployment (품질 관리 및 배포)

#### 과제 요구사항

* **코드 품질 관리**:
  * ESLint 정적 검사를 통해 자바스크립트/Vue 코드 내 Error 0건 달성.
  * API Key 등 민감 정보는 `.env` 환경 변수로 분리하고 `.gitignore`에 등록하여 Git 추적 방지.
* **빌드 및 배포**:
  * `npm run build`를 통한 배포용 정적 파일 생성.
  * 정적 웹 호스팅 서버에 배포 완료 및 정상 작동 확인.

#### 개인 Customization 내역
* **환경 변수 분리**: OpenWeatherMap API 키를 `VITE_WEATHER_API_KEY`로 `.env`에 분리하고 `.gitignore`에 등록.

---

## 시작하기 (Getting Started)

### 환경 변수 설정 (`.env`)

프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 OpenWeatherMap API 키를 입력합니다.

```env
VITE_WEATHER_API_KEY=YOUR_API_KEY
```

### 설치 및 실행

```bash
# 의존성 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 코드 린트 및 품질 점검
npm run lint

# 코드 포맷팅
npm run format

# 프로젝트 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---