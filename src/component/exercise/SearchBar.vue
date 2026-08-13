<script setup>
// 부모로부터 검색어(props)를 전달받아 표시하고,
// 입력이 바뀔 때마다 update-query 이벤트로 부모에게 전달한다.
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

function onInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <span class="search-icon">🔍</span>
    <input
      class="search-input"
      type="text"
      placeholder="도시 이름을 한글로 검색하세요 (예: 서울)"
      :value="modelValue"
      @input="onInput"
    />
    <span v-if="modelValue" class="search-echo">"{{ modelValue }}" 검색 중</span>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
}

.search-icon {
  font-size: 16px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #1e2a3a;
}

.search-input::placeholder {
  color: #5b6b7d;
}

.search-echo {
  font-size: 12px;
  color: #2b4a6b;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: 999px;
}
</style>
