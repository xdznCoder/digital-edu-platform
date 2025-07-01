<template>
  <svg width="400" height="300" >
    <Hex :x="100" :y="100" text="1" fill="red" :radius="30" @onHexClick="onHexClick(1)" />
    <Hex :x="152" :y="100" text="2" :radius="30" @onHexClick="onHexClick(2)" />
    <Hex :x="203" :y="100" text="3" :radius="30" @onHexClick="onHexClick(3)" />
    <Hex :x="177" :y="145" text="4" :radius="30" @onHexClick="onHexClick(4)" />
  </svg>
</template>

<script setup lang="ts">
import Hex from '../components/HexUnit.vue'

function onHexClick(id: number) {
  console.log(id)
}
</script>
