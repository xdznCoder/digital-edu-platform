<template>
  <div class="stepper">
    <div
        v-for="(item, index) in items"
        :key="index"
        class="step"
        :class="{
        active: modelValue === index,
        done: index < modelValue
      }"
    >
      <div class="circle">{{ index + 1 }}</div>
      <div class="label">{{ item }}</div>
      <div
          v-if="index !== items.length - 1"
          class="divider"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
defineProps<{
  modelValue: number
  items: string[]
}>()
</script>

<style scoped lang="scss">
.stepper {
  display: flex;
  align-items: center;
  width: 100%;
}
.step {
  display: flex;
  align-items: center;
  position: relative;
}
.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.label {
  margin-left: 8px;
  font-size: 14px;
  color: #666;
  min-width: 60px;
}
.divider {
  width: 32px;
  height: 2px;
  background-color: #ccc;
  margin: 0 12px;
}
.active .circle {
  background-color: #8b95be;
}
.active .label {
  font-weight: 600;
}
.done .circle {
  background-color: #bedec0;
}
</style>



