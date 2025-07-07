<template>
  <div class="board-view-container d-flex">
    <div class="left" style="display: flex; flex-direction: column; ">
      <v-expansion-panels>
        <v-expansion-panel class="mt-2">
          <v-expansion-panel-title class="pa-3">
            <v-icon icon="mdi-cog" class="mx-4"></v-icon>
            <span class="text-h6">棋盘设置</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-2">
            <div class="d-flex">
              <div class="mx-2">调整X轴方位</div>
              <v-slider
                  v-model="originX"
                  :max="240"
                  :min="0"
                  :step="10"
                  thumb-label
              />
            </div>
            <div class="d-flex">
              <div class="mx-2">调整Y轴方位</div>
              <v-slider
                  v-model="originY"
                  :max="240"
                  :min="0"
                  :step="10"
                  thumb-label
              />
            </div>
            <div class="d-flex">
              <div class="mx-2">调整棋盘大小</div>
              <v-slider
                  v-model="radius"
                  :max="34"
                  :min="10"
                  :step="1"
                  thumb-label
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
        <SpecialCard :data="GameStatus" @update="useGameStatus"/>
        <TileRank :data="GameStatus" />
    </div>
      <div style="flex: 2; min-width: 800px">
      <BoardBox
          v-if="GameStatus"
          :data="GameStatus"
          :origin-x="originX"
          :origin-y="originY"
          :radius="radius"
          @update="useGameStatus"/>
    </div>
    <div class="right">
      <LegendBox />
      <BoardStatus v-if="GameStatus" :data="GameStatus" @update="useGameStatus"/>
      <GradeRank v-if="GameStatus" :game-id="gameId" :data="GameStatus" @update="useGameStatus"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useApi} from "@/api/handler";
import {game} from "@/api";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ApiMap} from "@/api/type";
import BoardBox from "@/components/board/BoardBox.vue";
import BoardStatus from "@/components/board/BoardStatus.vue";
import GradeRank from "@/components/board/GradeRank.vue";
import TileRank from "@/components/board/TileRank.vue";
import LegendBox from "@/components/board/LegendBox.vue";
import SpecialCard from "@/components/board/SpecialCard.vue";

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const route = useRoute()
const gameId = ref<number>(0)

const originX = ref(70)
const originY = ref(40)
const radius = ref(24)

onMounted(() => {
  gameId.value = Number(route.query.id)
  useGameStatus()
})

const useGameStatus = () => {
  useApi({
    api: game.GameStatus(gameId.value),
    onSuccess: resp => {
      GameStatus.value = resp.data as ApiMap['/game/status/:id']['resp']
    }
  })
}
</script>

<style lang="scss" scoped>
.board-view-container {
  background-color: #f4f4f4;
  min-width: 100vw;
  min-height: 100vh;

  .left {
    flex: 1;
    min-width: 300px;
  }

  .right {
    flex: 1;
    min-width: 400px
  }
}
</style>
