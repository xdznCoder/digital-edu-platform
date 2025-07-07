<template>
  <transition name="event-fade">
    <div
        v-if="visible"
        class="event-title"
    >
      <div class="glow-text">{{ title }}</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'

const props = defineProps<{
  title: string
  duration?: number
}>()

const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, props.duration ?? 2000)
})
</script>

<style scoped>
.event-title {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #ffcc00;
  padding: 16px 32px;
  border-radius: 12px;
  z-index: 9999;
  animation: bounce-in 0.5s ease;
}

.glow-text {
  font-size: 24px;
  color: #ffcc00;
  font-weight: bold;
  text-shadow: 0 0 8px #ffcc00, 0 0 12px #ff9900;
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
}

@keyframes bounce-in {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 10%);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 0%);
  }
}

.event-fade-enter-active,
.event-fade-leave-active {
  transition: opacity 0.4s ease;
}
.event-fade-enter-from,
.event-fade-leave-to {
  opacity: 0;
}
</style>

