<template>
  <svg width="2100" height="900" >
    <Hex v-for="(item, index) of hexGrid.hexArray" :key="index" :x="item.x" :y="item.y" :radius="item.radius" @onHexClick="onHexClick" :id="index" :mode="item.mode"/>
  </svg>
</template>

<script setup lang="ts">
import Hex from '../components/HexUnit.vue'
import {HexGrid} from "@/types/hex";

const originX = 200
const originY = 100

const hexGrid: HexGrid = new HexGrid(originX, originY, 22)

hexGrid.setMode([0, 6, 19, 21, 61, 62, 111, 165, 185, 228, 242, 266, 277, 279, 280, 282], 'origin')
hexGrid.setMode([22, 35, 53, 120, 137, 138, 140, 141, 144, 157, 161, 191, 250, 257], 'black-swamp')
hexGrid.setMode([51, 56, 219, 224], 'fight-fortress')
hexGrid.setMode([58], 'chance-place')
hexGrid.setMode([115, 135, 143, 162], 'secret-place')
hexGrid.setMode([139], 'gold-center')

function onHexClick(id: number) {
  console.log(id)
}
</script>
