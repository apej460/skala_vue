<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="glass-panel not-found">
    <p class="code">404</p>
    <p>요청하신 페이지를 찾을 수 없습니다.</p>
    <button class="pill-btn" @click="router.push('/')">대시보드로 돌아가기</button>
  </section>
</template>

<style scoped>
.not-found {
  padding: 60px 30px;
  text-align: center;
}

.code {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 8px;
}
</style>
