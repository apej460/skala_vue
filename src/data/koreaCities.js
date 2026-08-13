// 기상청이 일기예보를 제공하는 주요 도시/지점 목록 (전국 지도 페이지용)
// id는 citiesStore에서 고정 슬러그로 사용되어, defaultCities.js와 겹치는 도시는 동일 id로 통일했습니다.
export const koreaCities = [
  // 특별시 / 광역시 / 특별자치시
  { id: 'seoul', name: '서울', region: '수도권', lat: 37.5665, lon: 126.978 },
  { id: 'busan', name: '부산', region: '영남', lat: 35.1796, lon: 129.0756 },
  { id: 'daegu', name: '대구', region: '영남', lat: 35.8714, lon: 128.6014 },
  { id: 'incheon', name: '인천', region: '수도권', lat: 37.4563, lon: 126.7052 },
  { id: 'gwangju', name: '광주', region: '호남', lat: 35.1595, lon: 126.8526 },
  { id: 'daejeon', name: '대전', region: '충청', lat: 36.3504, lon: 127.3845 },
  { id: 'ulsan', name: '울산', region: '영남', lat: 35.5384, lon: 129.3114 },
  { id: 'sejong', name: '세종', region: '충청', lat: 36.48, lon: 127.289 },

  // 경기
  { id: 'suwon', name: '수원', region: '수도권', lat: 37.2636, lon: 127.0286 },
  { id: 'seongnam', name: '성남', region: '수도권', lat: 37.4449, lon: 127.1388 },
  { id: 'goyang', name: '고양', region: '수도권', lat: 37.6584, lon: 126.832 },
  { id: 'yongin', name: '용인', region: '수도권', lat: 37.2411, lon: 127.1776 },
  { id: 'bucheon', name: '부천', region: '수도권', lat: 37.5034, lon: 126.766 },
  { id: 'ansan', name: '안산', region: '수도권', lat: 37.3219, lon: 126.8309 },
  { id: 'anyang', name: '안양', region: '수도권', lat: 37.3943, lon: 126.9568 },
  { id: 'pyeongtaek', name: '평택', region: '수도권', lat: 36.9921, lon: 127.1129 },
  { id: 'hwaseong', name: '화성', region: '수도권', lat: 37.1996, lon: 126.8312 },
  { id: 'uijeongbu', name: '의정부', region: '수도권', lat: 37.7381, lon: 127.0338 },
  { id: 'paju', name: '파주', region: '수도권', lat: 37.7599, lon: 126.7802 },
  { id: 'gimpo', name: '김포', region: '수도권', lat: 37.6152, lon: 126.7159 },
  { id: 'namyangju', name: '남양주', region: '수도권', lat: 37.636, lon: 127.2165 },
  { id: 'icheon', name: '이천', region: '수도권', lat: 37.2724, lon: 127.435 },

  // 강원
  { id: 'chuncheon', name: '춘천', region: '강원', lat: 37.8813, lon: 127.7298 },
  { id: 'wonju', name: '원주', region: '강원', lat: 37.3422, lon: 127.9202 },
  { id: 'gangneung', name: '강릉', region: '강원', lat: 37.7519, lon: 128.8761 },
  { id: 'sokcho', name: '속초', region: '강원', lat: 38.207, lon: 128.5918 },
  { id: 'donghae', name: '동해', region: '강원', lat: 37.5247, lon: 129.1143 },
  { id: 'taebaek', name: '태백', region: '강원', lat: 37.164, lon: 128.9856 },
  { id: 'samcheok', name: '삼척', region: '강원', lat: 37.45, lon: 129.1651 },

  // 충북 / 충남
  { id: 'cheongju', name: '청주', region: '충청', lat: 36.6424, lon: 127.489 },
  { id: 'chungju', name: '충주', region: '충청', lat: 36.991, lon: 127.926 },
  { id: 'jecheon', name: '제천', region: '충청', lat: 37.1326, lon: 128.191 },
  { id: 'cheonan', name: '천안', region: '충청', lat: 36.8151, lon: 127.1139 },
  { id: 'asan', name: '아산', region: '충청', lat: 36.7898, lon: 127.0019 },
  { id: 'seosan', name: '서산', region: '충청', lat: 36.7848, lon: 126.4503 },
  { id: 'boryeong', name: '보령', region: '충청', lat: 36.3335, lon: 126.6128 },
  { id: 'nonsan', name: '논산', region: '충청', lat: 36.1872, lon: 127.0987 },

  // 전북 / 전남
  { id: 'jeonju', name: '전주', region: '호남', lat: 35.8242, lon: 127.148 },
  { id: 'gunsan', name: '군산', region: '호남', lat: 35.9676, lon: 126.7369 },
  { id: 'iksan', name: '익산', region: '호남', lat: 35.9483, lon: 126.9575 },
  { id: 'jeongeup', name: '정읍', region: '호남', lat: 35.5699, lon: 126.8558 },
  { id: 'namwon', name: '남원', region: '호남', lat: 35.4164, lon: 127.3908 },
  { id: 'mokpo', name: '목포', region: '호남', lat: 34.8118, lon: 126.3922 },
  { id: 'yeosu', name: '여수', region: '호남', lat: 34.7604, lon: 127.6622 },
  { id: 'suncheon', name: '순천', region: '호남', lat: 34.9506, lon: 127.4872 },
  { id: 'naju', name: '나주', region: '호남', lat: 35.016, lon: 126.7108 },
  { id: 'gwangyang', name: '광양', region: '호남', lat: 34.9407, lon: 127.6958 },

  // 경북 / 경남
  { id: 'pohang', name: '포항', region: '영남', lat: 36.019, lon: 129.3435 },
  { id: 'gyeongju', name: '경주', region: '영남', lat: 35.8562, lon: 129.2247 },
  { id: 'gumi', name: '구미', region: '영남', lat: 36.1195, lon: 128.3446 },
  { id: 'andong', name: '안동', region: '영남', lat: 36.5684, lon: 128.7294 },
  { id: 'yeongju', name: '영주', region: '영남', lat: 36.8056, lon: 128.6239 },
  { id: 'sangju', name: '상주', region: '영남', lat: 36.4109, lon: 128.159 },
  { id: 'mungyeong', name: '문경', region: '영남', lat: 36.5867, lon: 128.1868 },
  { id: 'gimcheon', name: '김천', region: '영남', lat: 36.1398, lon: 128.1136 },
  { id: 'changwon', name: '창원', region: '영남', lat: 35.228, lon: 128.6811 },
  { id: 'jinju', name: '진주', region: '영남', lat: 35.1799, lon: 128.1076 },
  { id: 'tongyeong', name: '통영', region: '영남', lat: 34.8544, lon: 128.4331 },
  { id: 'gimhae', name: '김해', region: '영남', lat: 35.2285, lon: 128.8894 },
  { id: 'geoje', name: '거제', region: '영남', lat: 34.8806, lon: 128.6212 },
  { id: 'yangsan', name: '양산', region: '영남', lat: 35.335, lon: 129.0378 },
  { id: 'sacheon', name: '사천', region: '영남', lat: 35.0037, lon: 128.0642 },

  // 제주
  { id: 'jeju', name: '제주', region: '제주', lat: 33.4996, lon: 126.5312 },
  { id: 'seogwipo', name: '서귀포', region: '제주', lat: 33.254, lon: 126.56 },
]
