<template>
  <div class="proposal-view-container d-flex flex-column">
    <PropHeader @show-overlay="showOverlay = true" />
    <div class="proposal-main ma-4 d-flex">
      <PropSidebar :data="GameStatus" />
      <div class="d-flex ml-4 flex-column w-100">
        <v-card style="flex: 1" v-if="GameStatus">
          <StepBar class="my-6 d-flex justify-center" :model-value="stage" :items="items"></StepBar>
          <v-divider></v-divider>
          <InitProp v-if="stage === 0" :data="GameStatus" @update="useGameStatus" />
          <TeamOrder v-if="stage === 1" :data="GameStatus" @update="useGameStatus" />
          <PropVoteOne v-if="stage === 2 && GameStatus && GameStatus.proposalStage < 4" :data="GameStatus"
            @update="useGameStatus" />
          <KnockOut v-if="stage === 2 && GameStatus && GameStatus.proposalStage === 4" :data="GameStatus"
            @update="useGameStatus" />
          <PropVoteTwo v-if="stage === 3" :data="GameStatus" @update="useGameStatus" />
          <PropVoteThree v-if="stage === 4 && GameStatus && GameStatus.proposalStage < 4" :data="GameStatus"
            @update="useGameStatus" />
          <BuzzQuiz v-if="stage === 4 && GameStatus && GameStatus.proposalStage === 4" :data="GameStatus"
            @update="useGameStatus" />
          <SummaryBox v-if="stage === 5" :data="GameStatus" />
        </v-card>
      </div>
    </div>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <div class="d-flex mb-4">
      <v-btn :color="currentMode === 'team' ? 'primary' : 'grey'" @click="currentMode = 'team'">团队排行榜</v-btn>
      <v-btn :color="currentMode === 'student' ? 'primary' : 'grey'" @click="currentMode = 'student'">个人排行榜</v-btn>
    </div>

    <RankList v-if="currentMode === 'team'" key="team" :enable-edit="true" max-height="630" class="mr-6"
      style="width: 500px" :data="GameStatus"></RankList>
    <TileRank v-else-if="currentMode === 'student'" key="student" :enable-edit="true" max-height="630" class="mr-6"
      style="width: 500px" :data="GameStatus" mode="student" />
  </v-overlay>
</template>

<script setup lang="ts">
import PropHeader from "@/components/proposal/PropHeader.vue";
import PropSidebar from "@/components/proposal/PropSidebar.vue";
import { onMounted, ref } from "vue";
import { ApiMap } from "@/api/type";
import { useApi } from "@/api/handler";
import { game, team } from "@/api";
import { useRoute } from "vue-router";
import StepBar from "@/components/StepBar.vue";
import InitProp from "@/components/proposal/init/InitProp.vue";
import TeamOrder from "@/components/proposal/TeamOrder.vue";
import PropVoteOne from "@/components/proposal/vote/PropVoteOne.vue";
import KnockOut from "@/components/proposal/KnockOut.vue";
import PropVoteTwo from "@/components/proposal/vote/PropVoteTwo.vue";
import PropVoteThree from "@/components/proposal/vote/PropVoteThree.vue";
import BuzzQuiz from "@/components/proposal/BuzzQuiz.vue";
import SummaryBox from "@/components/SummaryBox.vue";
import RankList from "@/components/proposal/RankList.vue";
import TileRank from "@/components/board/TileRank.vue";

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const gameId = ref<number>(0)
const route = useRoute()
const items = ref(['初始化积分', '轮次选择', '第一轮提案', '第二轮提案', '第三轮提案', '总结'])
const stage = ref<number>(0)
const showOverlay = ref<boolean>(false)
const currentMode = ref<'team' | 'student'>('team')

onMounted(() => {
  gameId.value = Number(route.query.id)
  useGameStatus()
})

function handleStage() {
  if (!GameStatus.value) return
  if (GameStatus.value.status === 2) stage.value = 5
  else if (GameStatus.value.proposalStage < 2) stage.value = GameStatus.value.proposalStage
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
