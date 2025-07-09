<template>
  <div class="summary-view">
    <div class="pa-6 text-h5 text-indigo-lighten-2">总结页面</div>
    <div class="d-flex mx-6">
      <RankList max-height="630" class="mr-6" style="flex: 1" :data="GameStatus" @click="console.log"/>
      <TileRank max-height="630" style="flex: 1" :data="GameStatus" show-change @click="console.log"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import RankList from "@/components/proposal/RankList.vue";
import TileRank from "@/components/board/TileRank.vue";
import {defineProps, ref, watch} from "vue";
import {ApiMap} from "@/api/type";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)

watch(() => props.data, newVal => {
  GameStatus.value = newVal ?? null
}, {immediate: true})
</script>


<style scoped lang="scss">

</style>
