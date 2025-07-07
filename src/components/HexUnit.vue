<template>
  <g class="hex-unit" style="cursor: pointer" @click="emits('onHexClick', props.id)">
    <polygon
        :points="points"
        :fill="fill ?? getFill()"
        :stroke="stroke"
        :stroke-width="1"
    />
      <text
          :x="props.x"
          :y="props.y"
          text-anchor="middle"
          dominant-baseline="middle"
          :font-size="radius / 1.5"
          fill="white"
      >
        {{ text }}
      </text>
  </g>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

interface Props {
  x: number
  y: number
  id: number
  radius: number
  mode?: 'origin' | 'fight-fortress' | 'gold-center' | 'black-swamp' | 'chance-place' | 'secret-place' | 'normal'
  fill?: string
  text?: string
}

const emits = defineEmits(['onHexClick'])

const props = defineProps<Props>()

const points = computed(() => {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i
    const px = props.x + props.radius * Math.cos(angle)
    const py = props.y + props.radius * Math.sin(angle)
    pts.push(`${px},${py}`)
  }
  return pts.join(' ')
})

const getFill = () => {
  switch (props.mode) {
    case 'origin':
      return '#8c8c8c'
    case 'fight-fortress':
      return '#ff9924'
    case 'gold-center':
      return '#fc3232'
    case 'secret-place':
      return '#3297fc'
    case 'black-swamp':
      return '#1e1e1e'
    case 'chance-place':
      return '#0ccb12'
    default:
      return '#ffffff'
  }
}
const stroke = '#333'
</script>

<style lang="scss" scoped>

</style>




