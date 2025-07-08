<template>
  <div class="proposal-view-container d-flex flex-column">
    <PropHeader />
    <div class="proposal-main ma-4 d-flex">
      <PropSidebar class="mr-4" :data="GameStatus"/>
      <div class="d-flex flex-column w-100">
        <v-card style="flex: 1" v-if="GameStatus">
          <StepBar class="my-6 d-flex justify-center" :model-value="stage" :items="items"></StepBar>
          <v-divider></v-divider>
          <InitProp v-if="stage === 0" :data="GameStatus"
                    @update="useGameStatus"/>
          <TeamOrder v-if="stage === 1" :data="GameStatus"
                    @update="useGameStatus"/>
          <StageOne v-if="stage === 2 && GameStatus && GameStatus.proposalStage < 4" :data="GameStatus"
                    @update="useGameStatus"/>
          <KnockOut v-if="stage === 2 && GameStatus && GameStatus.proposalStage === 4" :data="GameStatus"
                    @update="useGameStatus"/>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PropHeader from "@/components/proposal/PropHeader.vue";
import PropSidebar from "@/components/proposal/PropSidebar.vue";
import {onMounted, ref} from "vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {game} from "@/api";
import {useRoute} from "vue-router";
import StepBar from "@/components/StepBar.vue";
import InitProp from "@/components/proposal/InitProp.vue";
import TeamOrder from "@/components/proposal/TeamOrder.vue";
import StageOne from "@/components/proposal/StageOne.vue";
import KnockOut from "@/components/proposal/KnockOut.vue";

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const gameId = ref<number>(0)
const route = useRoute()
const items = ref(['初始化积分', '轮次选择', '第一轮提案', '第二轮提案', '第三轮提案', '总结'])
const stage = ref<number>(0)

onMounted(() => {
  gameId.value = Number(route.query.id)
  useGameStatus()
})

function handleStage () {
  if (!GameStatus.value) return
  if (GameStatus.value.proposalStage < 2) stage.value = GameStatus.value.proposalStage
  else stage.value = GameStatus.value.proposalRound + 1
}

const useGameStatus = () => {
  useApi({
    api: game.GameStatus(gameId.value),
    onSuccess: resp => {
      GameStatus.value = resp.data as ApiMap['/game/status/:id']['resp']
      handleStage()
    }
  })
}
</script>

<style scoped lang="scss">
.proposal-view-container {
  height: 100vh;
  background-color: #f4f4f4;
}
.proposal-main {
  min-width: 1400px;
  flex: 1;
}
</style>

