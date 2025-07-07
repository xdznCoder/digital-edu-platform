<template>
  <div class="legend-container d-flex flex-column px-6 py-4 my-8">
    <div class="legend-item" v-for="(color, mode) in modeColorMap" :key="mode">
      <div class="color-box" :style="{ backgroundColor: color }" />
      <span class="label font-weight-bold ml-4">{{ modeLabelMap[mode] || mode }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const modeColorMap = {
  'origin': '#8c8c8c',
  'fight-fortress': '#ff9924',
  'gold-center': '#fc3232',
  'secret-place': '#3297fc',
  'black-swamp': '#1e1e1e',
  'chance-place': '#0ccb12',
} as const

const modeLabelMap: Record<keyof typeof modeColorMap, string> = {
  'origin': '出生地',
  'fight-fortress': '决战要塞',
  'gold-center': '黄金中心',
  'secret-place': '盲盒秘境',
  'black-swamp': '黑沼泽',
  'chance-place': '机会宝地',
}
</script>

<style scoped>
.legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
}
.color-box {
  width: 60px;
  height: 22px;
  border-radius: 4px;
  margin-right: 6px;
  border: 1px solid #ccc;
}
.label {
  font-size: 14px;
  color: #333;
}
</style>
