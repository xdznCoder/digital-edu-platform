<template>
  <v-card v-if="GameStatus">
      <div class="px-6 py-2 bg-indigo-lighten-2 d-flex justify-space-between">
        <div class="text-h6 ">游戏状态</div>
        <v-btn class="mr-2" variant="outlined" color="white" @click="emits('update')">下一轮</v-btn>
      </div>
    <div class="ma-4">
      <div class="ma-3"><span class="font-weight-bold">游戏赛段：</span>
        <v-chip :color="GameDisplay.colorTrans('stage', GameStatus.stage)">{{GameDisplay.displayTrans('stage',GameStatus.stage)}}</v-chip>
      </div>
      <div v-if="GameStatus.stage === 1">
        <div class="ma-3"><span class="font-weight-bold">棋盘赛轮次：</span>第 {{GameStatus.chessRound}} 轮
        </div>

        <div class="ma-3 d-flex justify-space-between ">
        <div><span class="font-weight-bold">棋盘阶段：</span>
          <v-chip :color="GameDisplay.colorTrans('chessPhase', GameStatus.chessPhase)">{{GameDisplay.displayTrans('chessPhase', GameStatus.chessPhase)}}</v-chip>
        </div>
        <v-btn v-if="GameStatus.chessPhase === 1" height="30" text="设置" variant="outlined" color="primary" @click="showOverlay = true"></v-btn>
        </div>
      </div>
    </div>
  </v-card>
  <v-overlay
      v-model="showOverlay"
      class="align-center justify-center">
    <TeamTile :team-ids="[1, 2, 3, 4, 5, 6, 7]" :game-id="GameStatus.id" @close="showOverlay = false" @update="emits('update')"></TeamTile>
  </v-overlay>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch, onMounted} from 'vue'
import {GameDisplay} from "@/utils";
import {ApiMap} from "@/api/type";
import TeamTile from "@/components/board/TeamTile.vue";

const props = defineProps<{
  data: ApiMap['/game/status/:id']['resp']
}>()

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const emits = defineEmits(['update'])
const showOverlay = ref<boolean>(false)

onMounted(() => {
  GameStatus.value = props.data
})

watch(() => props.data, newVal => {
  GameStatus.value = newVal
})
</script>

<style scoped lang="scss">

</style>
