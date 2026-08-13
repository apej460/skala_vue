<script setup>
import { ref } from "vue";

const weatherList = ref([
  {
    id: "city_01",
    name: "서울",
    temp: 28,
    status: "맑음",
    humidity: "62%",
    wind: "2.1m/s",
  },
  {
    id: "city_02",
    name: "수원",
    temp: 24,
    status: "비",
    humidity: "81%",
    wind: "4.3m/s",
  },
  {
    id: "city_03",
    name: "부산",
    temp: 26,
    status: "구름",
    humidity: "70%",
    wind: "3.2m/s",
  },
]);

const keyword = ref("");

const selectedCity = ref("도시를 선택해주세요.");

const selectCity = (city) => {
  selectedCity.value = `${city}이(가) 선택되었습니다.`;
};

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`);
};
</script>

<template>
  <div class="container">
    <h1>⛅️ 과제 1 : 날씨 (Mockup)</h1>

    <div class="search-box">
      <input
        :value="keyword"
        @input="keyword = $event.target.value"
        placeholder="도시명을 입력하세요."
      />
    </div>

    <p class="keyword">
      입력한 도시 :
      <strong>{{ keyword || "없음" }}</strong>
    </p>

    <div class="status-bar">
      {{ selectedCity }}
    </div>

    <div class="card-list">
      <div
        class="weather-card"
        v-for="city in weatherList"
        :key="city.id"
        @click="selectCity(city.name)"
      >
        <h2>{{ city.name }}</h2>

        <div class="temp">
          {{ city.temp }}℃
        </div>

        <p class="status">
          {{ city.status }}
        </p>

        <p v-if="city.temp >= 25" class="hot">
          🔥 더움 (25도 이상)
        </p>

        <p v-else class="cool" >
          ❄️ 선선함 (25도 미만)
        </p>

        <div class="extra">
          <p>💧 습도 : {{ city.humidity }}</p>
          <p>🌬 풍속 : {{ city.wind }}</p>
        </div>

        <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container{
    max-width:1100px;
    margin:40px auto;
    padding:30px;

    background:#1e293b;

    border:1px solid #334155;

    border-radius:20px;
}

h1{
    text-align:center;
    color:#f8fafc;
    margin-bottom:35px;
}

.search-box{
    display:flex;
    justify-content:center;
}

.search-box input{
    width:320px;
    padding:12px 16px;
    background:#0f172a;
    color:#f8fafc;
    border:1px solid #334155;
    border-radius:10px;
    outline:none;
}

.search-box input::placeholder{
    color:#94a3b8;
}

.keyword{
    text-align:center;
    margin:18px 0;
    color:#cbd5e1;
}

.status-bar{
    margin:25px auto;
    width:450px;
    background:#0f172a;
    color:#f8fafc;
    border:1px solid #334155;
    border-radius:10px;
    padding:12px;
    text-align:center;
}

.card-list{
    display:flex;
    gap:20px;
    justify-content:center;
    flex-wrap:wrap;
}

.weather-card{
    width:250px;
    padding:20px;
    background:#0f172a;
    border:1px solid #334155;
    border-radius:16px;
    cursor:pointer;
    transition:.2s;
}

.weather-card:hover{
    transform:translateY(-5px);
    border-color:#64748b;
}

.weather-card h2{
    color:#f8fafc;
    text-align:center;
    margin-bottom:15px;
}

.temp{
    font-size:38px;
    font-weight:bold;
    text-align:center;
    color:#f8fafc;
    margin-bottom:10px;
}

.status{
    text-align:center;
    color:#cbd5e1;
    margin-bottom:10px;
}

.hot{
    text-align:center;
    color:#f97316;
    font-weight:bold;
}

.cool{
    text-align:center;
    color:#38bdf8;
    font-weight:bold;
}

.extra{
    margin-top:18px;
    padding-top:15px;
    border-top:1px solid #334155;
    color:#94a3b8;
    line-height:1.8;
}

button{
    width:100%;
    margin-top:18px;
    padding:10px;
    background:#2563eb;
    color:white;
    border:none;
    border-radius:10px;
    cursor:pointer;
    font-weight:bold;
}

button:hover{
    background:#1d4ed8;
}
</style>