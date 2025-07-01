<template>
  <g style="cursor: pointer" @click="emits('onHexClick')">
    <polygon
        :points="points"
        :fill="fill"
        :stroke="stroke"
        :stroke-width="strokeWidth"
    />
    <text
        v-if="text"
        :x="props.x"
        :y="props.y + fontSize / 5"
        :font-size="fontSize"
        :fill="textColor"
        text-anchor="middle"
        dominant-baseline="middle"
        style="user-select: none;"
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
  radius: number
  text?: string
  textColor?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
}

const emits = defineEmits(['onHexClick'])

const props = defineProps<Props>()

const points = computed(() => {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i - Math.PI / 6
    const px = props.x + props.radius * Math.cos(angle)
    const py = props.y + props.radius * Math.sin(angle)
    pts.push(`${px},${py}`)
  }
  return pts.join(' ')
})

const fill = props.fill ?? '#1976d2'
const stroke = props.stroke ?? '#333'
const strokeWidth = props.strokeWidth ?? 1

const fontSize = props.radius / 2
const textColor = props.textColor ?? '#fff'
</script>





