<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="glass-panel about">
    <h1>🌤️ Weather Dashboard 소개</h1>
    <p>
      Vue 3(Composition API) + Vue Router + Pinia + Axios(OpenWeatherMap)로 만든 실습용 날씨
      대시보드입니다. 도시별 실시간 날씨를 검색·비교하고, 전국 지도에서 한눈에 확인할 수 있습니다.
    </p>

    <ul class="feature-list">
      <li>🔎 도시 검색/필터링, 지오코딩 자동완성으로 도시 추가</li>
      <li>📍 내 위치 날씨 자동 감지 (Geolocation API)</li>
      <li>🌡️ 섭씨 / 화씨 단위 전환, 🌙 다크모드 (Pinia + localStorage)</li>
      <li>⭐ 즐겨찾기, 🗺️ 전국 지도, 🆚 도시 비교 페이지</li>
      <li>☁️ 시간별·5일 예보, 대기질(AQI), 일출·일몰 정보</li>
      <li>🧭 Vue Router 동적 라우팅 + Lazy Loading</li>
    </ul>

    <p class="tech text-sub">Vue 3 · Vue Router 4 · Pinia · Axios · OpenWeatherMap API</p>

    <button class="pill-btn" @click="router.push('/')">← 메인 대시보드로 돌아가기</button>
  </section>
</template>

<style scoped>
.about {
  padding: 32px;
  max-width: 640px;
  margin: 0 auto;
}

.about h1 {
  margin-top: 0;
}

.feature-list {
  margin: 20px 0;
  padding-left: 20px;
  line-height: 1.9;
}

.tech {
  font-size: 13px;
  margin-bottom: 22px;
}
</style>
